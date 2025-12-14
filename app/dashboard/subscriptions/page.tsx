/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";

function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md border border-zinc-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Upgrade your plan</h1>
        <p className="text-zinc-400 mb-6">
          You are currently on the <b>FREE</b> plan.
        </p>

        <div className="border border-zinc-800 rounded-md p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">PRO Plan</h2>
          <ul className="text-sm text-zinc-400 space-y-1">
            <li>• Unlimited repositories</li>
            <li>• Unlimited PR reviews</li>
            <li>• Priority processing</li>
          </ul>
        </div>

        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full bg-white text-black font-medium py-2 rounded-md hover:bg-zinc-200 disabled:opacity-50"
        >
          {loading ? "Redirecting to Stripe..." : "Upgrade to PRO"}
        </button>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
}

export default SubscriptionPage;
