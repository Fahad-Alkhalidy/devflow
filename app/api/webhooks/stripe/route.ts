import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ProMembership } from "@/database";
import dbConnect from "@/lib/mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    await dbConnect();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const planType = session.metadata?.planType;

  if (!userId || !planType) {
    console.error("Missing metadata in checkout session:", session.id);
    return;
  }

  // Get the subscription
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  // Create or update membership
  await ProMembership.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      status: subscription.status as any,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      planType: planType as "monthly" | "yearly",
      amount: subscription.items.data[0].price.unit_amount || 0,
      currency: subscription.currency,
    },
    { upsert: true, new: true }
  );

  console.log(`Membership created/updated for user ${userId}`);
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer as string);
  const userId = customer.metadata?.userId;

  if (!userId) {
    console.error("No userId found in customer metadata");
    return;
  }

  await ProMembership.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      status: subscription.status as any,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      planType: subscription.items.data[0].price.recurring?.interval === "year" ? "yearly" : "monthly",
      amount: subscription.items.data[0].price.unit_amount || 0,
      currency: subscription.currency,
    },
    { upsert: true, new: true }
  );

  console.log(`Subscription created for user ${userId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  await ProMembership.findOneAndUpdate(
    { stripeSubscriptionId: subscription.id },
    {
      status: subscription.status as any,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    }
  );

  console.log(`Subscription updated: ${subscription.id}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await ProMembership.findOneAndUpdate(
    { stripeSubscriptionId: subscription.id },
    {
      status: "canceled",
      cancelAtPeriodEnd: false,
    }
  );

  console.log(`Subscription canceled: ${subscription.id}`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    await ProMembership.findOneAndUpdate(
      { stripeSubscriptionId: invoice.subscription as string },
      {
        status: "active",
        currentPeriodStart: new Date(invoice.period_start * 1000),
        currentPeriodEnd: new Date(invoice.period_end * 1000),
      }
    );

    console.log(`Payment succeeded for subscription: ${invoice.subscription}`);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    await ProMembership.findOneAndUpdate(
      { stripeSubscriptionId: invoice.subscription as string },
      {
        status: "past_due",
      }
    );

    console.log(`Payment failed for subscription: ${invoice.subscription}`);
  }
}
