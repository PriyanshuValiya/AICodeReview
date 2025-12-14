import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (!session.customer || !session.subscription) break;

      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: session.customer.toString() },
      });

      if (!user) break;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionTier: "PRO",
          subscriptionStatus: "ACTIVE",
          stripeSubscriptionId: session.subscription.toString(),
        },
      });

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      await prisma.user.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          subscriptionTier: "FREE",
          subscriptionStatus: "CANCELED",
          stripeSubscriptionId: null,
        },
      });

      break;
    }
  }

  return NextResponse.json({ received: true });
}
