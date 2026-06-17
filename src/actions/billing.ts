"use server";

import prisma from "@/src/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import Razorpay from "razorpay";

// Helper to retrieve Razorpay API keys and raise error if unconfigured
function getRazorpayConfig() {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_API_KEY;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (
    !keyId ||
    !keySecret ||
    keyId === "YOUR_RAZORPAY_API_KEY" ||
    keySecret === "YOUR_RAZORPAY_KEY_SECRET"
  ) {
    throw new Error("Razorpay credentials are not configured in your environment (.env file).");
  }

  return {
    keyId,
    keySecret,
  };
}

/**
 * Server action to create a Razorpay order
 */
export async function createRazorpayOrderAction(planName: "alpha" | "gama") {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const { keyId, keySecret } = getRazorpayConfig();

    // Determine price in paise (₹1 = 100 paise)
    // Alpha = ₹399 -> 39900 paise
    // Gama = ₹999 -> 99900 paise
    const amount = planName === "alpha" ? 39900 : 99900;

    // Initialize Razorpay SDK
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${userId.slice(-6)}_${Date.now()}`,
      notes: {
        userId,
        planName,
      },
    });

    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      isMock: false,
    };
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return {
      success: false,
      error: error.message || "Failed to initiate payment order.",
    };
  }
}

/**
 * Server action to verify a Razorpay payment signature
 */
export async function verifyRazorpayPaymentAction(
  orderId: string,
  paymentId: string,
  signature: string,
  planName: "alpha" | "gama"
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const { keySecret } = getRazorpayConfig();

    // Verify signature natively using Node.js crypto
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (generatedSignature !== signature) {
      return { success: false, error: "Payment verification failed. Invalid signature." };
    }

    // Update the user's plan in local DB
    await prisma.user.update({
      where: { id: userId },
      data: { plan: planName },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");

    return { success: true, isMock: false };
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return {
      success: false,
      error: error.message || "Failed to verify payment.",
    };
  }
}
