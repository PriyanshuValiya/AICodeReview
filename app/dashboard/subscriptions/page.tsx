/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { getDashboardStats } from "@/module/dashboard/actions";
import { Button } from "@/components/ui/button";

interface TierInfo {
  name: "FREE" | "PRO";
  price: string;
  description: string;
  features: string[];
}

const TIERS: Record<string, TierInfo> = {
  FREE: {
    name: "FREE",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "5 repositories",
      "Basic PR reviews",
      "Standard processing",
      "Community support",
    ],
  },
  PRO: {
    name: "PRO",
    price: "$15",
    description: "For power users",
    features: [
      "Unlimited repositories",
      "Unlimited PR reviews",
      "Priority processing",
      "24/7 priority support",
      "Advanced analytics",
    ],
  },
};

function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTier, setCurrentTier] = useState<"FREE" | "PRO">("FREE");
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    async function fetchUserTier() {
      const subscriptionTier = await getDashboardStats();

      if (
        subscriptionTier?.subscriptionType?.subscriptionTier === "PRO" &&
        subscriptionTier?.subscriptionType?.subscriptionStatus === "ACTIVE"
      ) {
        setCurrentTier("PRO");
      }

      setIsLoadingStats(false);
    }

    fetchUserTier();
  }, []);

  async function handleUpgrade() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      if (!res.ok) {
        let message = "Checkout failed";

        try {
          const body = await res.json();
          message = body?.error || message;
        } catch {}

        throw new Error(message);
      }

      const data = await res.json();

      if (!data.url) {
        throw new Error("Stripe checkout URL missing");
      }

      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-4 sm:p-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">Upgrade your plan</h1>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-10">
          {Object.values(TIERS).map((tier) => {
            const isCurrentPlan = currentTier === tier.name;
            const isFree = tier.name === "FREE";

            return (
              <div
                key={tier.name}
                className={`relative border rounded-lg p-6 transition-all ${
                  isCurrentPlan
                    ? "text-black shadow-xl border-2 border-blue-700 shadow-blue-500"
                    : "hover:border-blue-700"
                }`}
              >
                {isCurrentPlan && (
                  <div className="border-2 border-blue-700 absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-blue-700 px-3 py-1 rounded-full text-sm">
                    Current Plan
                  </div>
                )}

                {/* Tier Info */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">{tier.name} Plan</h2>
                  <p className="text-zinc-400 text-sm mb-4">
                    {tier.description}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {!isFree && <span className="text-zinc-400">/month</span>}
                  </div>
                </div>

                {/* Features List */}
                <div className="mb-6 border-t border-blue-700 pt-6">
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5" />
                        <span className="">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                {tier.name === "PRO" && (
                  <Button
                    onClick={handleUpgrade}
                    disabled={loading || isCurrentPlan || isLoadingStats}
                    className={`w-full py-2 rounded-md font-medium transition-all ${
                      isCurrentPlan
                        ? ""
                        : "hover:bg-zinc-200 disabled:opacity-50"
                    }`}
                  >
                    {isLoadingStats
                      ? "Loading..."
                      : isCurrentPlan
                      ? "Current Plan"
                      : loading
                      ? "Redirecting to Stripe..."
                      : "Upgrade to PRO"}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-8 max-w-4xl mx-auto">
            <p className="text-red-500 text-sm bg-red-950 border border-red-800 rounded-md p-3">
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubscriptionPage;
