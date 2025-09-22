"use client";

import { useState, useTransition } from "react";
import { createCheckoutSession } from "@/lib/actions/stripe.action";
import { toast } from "sonner";
import { Check, Star } from "lucide-react";

interface PricingCardProps {
  plan: "monthly" | "yearly";
  price: number;
  period: string;
  features: Array<{
    name: string;
    included: boolean;
  }>;
  popular?: boolean;
  savings?: number;
}

const PricingCard = ({
  plan,
  price,
  period,
  features,
  popular = false,
  savings = 0,
}: PricingCardProps) => {
  const [isPending, startTransition] = useTransition();

  const handleSubscribe = () => {
    startTransition(async () => {
      try {
        const result = await createCheckoutSession({
          priceId:
            plan === "monthly"
              ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!
              : process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID!,
          planType: plan,
        });

        if (result.success && result.data?.url) {
          window.location.href = result.data.url;
        } else {
          toast.error("Failed to create checkout session", {
            description: result.error?.message || "Please try again",
          });
        }
      } catch (error) {
        toast.error("Something went wrong", {
          description: "Please try again later",
        });
      }
    });
  };

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 ${
        popular ? "ring-2 ring-blue-500 scale-105" : ""
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span>Most Popular</span>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {plan === "monthly" ? "Monthly" : "Yearly"} Plan
        </h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">
            ${price}
          </span>
          <span className="text-gray-600 dark:text-gray-400">/{period}</span>
        </div>
        {savings > 0 && (
          <div className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
            Save {savings}%
          </div>
        )}
      </div>

      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-3">
            {feature.included ? (
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0" />
            )}
            <span
              className={`text-sm ${
                feature.included
                  ? "text-gray-700 dark:text-gray-300"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {feature.name}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubscribe}
        disabled={isPending}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
          popular
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isPending ? "Processing..." : "Get Started"}
      </button>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
        Cancel anytime. 30-day money-back guarantee.
      </p>
    </div>
  );
};

export default PricingCard;
