"use server";

import Stripe from "stripe";
import { auth } from "@/auth";
import { ProMembership } from "@/database";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { z } from "zod";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

// Validation schemas
const CreateCheckoutSessionSchema = z.object({
  priceId: z.string().min(1, "Price ID is required"),
  planType: z.enum(["monthly", "yearly"]),
});

const CreateCustomerPortalSchema = z.object({
  returnUrl: z
    .string()
    .url({ message: "Please provide a valid URL with http:// or https://" }),
});

// Pro membership pricing (you'll need to create these in Stripe Dashboard)
const PRICING = {
  monthly: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
    amount: 999, // $9.99 in cents
  },
  yearly: {
    priceId: process.env.STRIPE_YEARLY_PRICE_ID!,
    amount: 9999, // $99.99 in cents
  },
};

export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<ActionResponse<{ url: string }>> {
  const validationResult = await action({
    params,
    schema: CreateCheckoutSessionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { priceId, planType } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    // Check if user already has an active subscription
    const existingMembership = await ProMembership.findOne({
      user: userId,
      status: "active",
    });

    if (existingMembership) {
      return {
        success: false,
        error: {
          message: "You already have an active pro membership",
        },
      };
    }

    // Create or retrieve Stripe customer
    let customer;
    const existingCustomer = await stripe.customers.list({
      email: validationResult.session?.user?.email,
      limit: 1,
    });

    if (existingCustomer.data.length > 0) {
      customer = existingCustomer.data[0];
    } else {
      customer = await stripe.customers.create({
        email: validationResult.session?.user?.email,
        name: validationResult.session?.user?.name,
        metadata: {
          userId: userId!,
        },
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/jobs?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing?canceled=true`,
      metadata: {
        userId: userId!,
        planType,
      },
    });

    return {
      success: true,
      data: { url: session.url! },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createCustomerPortal(
  params: CreateCustomerPortalParams
): Promise<ActionResponse<{ url: string }>> {
  const validationResult = await action({
    params,
    schema: CreateCustomerPortalSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { returnUrl } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    // Get user's membership
    const membership = await ProMembership.findOne({
      user: userId,
    });

    if (!membership) {
      return {
        success: false,
        error: {
          message: "No active membership found",
        },
      };
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: membership.stripeCustomerId,
      return_url: returnUrl,
    });

    return {
      success: true,
      data: { url: session.url },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserMembership(): Promise<
  ActionResponse<ProMembership | null>
> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: {
        message: "Not authenticated",
      },
    };
  }

  try {
    const membership = await ProMembership.findOne({
      user: session.user.id,
      status: "active",
    }).populate("user", "name email");

    return {
      success: true,
      data: membership,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function checkProMembership(): Promise<
  ActionResponse<{ isPro: boolean; membership?: ProMembership }>
> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: true,
      data: { isPro: false },
    };
  }

  try {
    const membership = await ProMembership.findOne({
      user: session.user.id,
      status: "active",
      currentPeriodEnd: { $gt: new Date() },
    });

    return {
      success: true,
      data: {
        isPro: !!membership,
        membership: membership || undefined,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function cancelSubscription(): Promise<ActionResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: {
        message: "Not authenticated",
      },
    };
  }

  try {
    const membership = await ProMembership.findOne({
      user: session.user.id,
      status: "active",
    });

    if (!membership) {
      return {
        success: false,
        error: {
          message: "No active membership found",
        },
      };
    }

    // Cancel subscription in Stripe
    await stripe.subscriptions.update(membership.stripeSubscriptionId!, {
      cancel_at_period_end: true,
    });

    // Update membership in database
    await ProMembership.findByIdAndUpdate(membership._id, {
      cancelAtPeriodEnd: true,
    });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function reactivateSubscription(): Promise<ActionResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: {
        message: "Not authenticated",
      },
    };
  }

  try {
    const membership = await ProMembership.findOne({
      user: session.user.id,
      status: "active",
      cancelAtPeriodEnd: true,
    });

    if (!membership) {
      return {
        success: false,
        error: {
          message: "No cancellable membership found",
        },
      };
    }

    // Reactivate subscription in Stripe
    await stripe.subscriptions.update(membership.stripeSubscriptionId!, {
      cancel_at_period_end: false,
    });

    // Update membership in database
    await ProMembership.findByIdAndUpdate(membership._id, {
      cancelAtPeriodEnd: false,
    });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
