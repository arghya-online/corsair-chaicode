"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { Loader2, Check } from "lucide-react";
import { createRazorpayOrderAction, verifyRazorpayPaymentAction } from "@/src/actions/billing";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
  const { user } = useUser();
  const [selectedPlan, setSelectedPlan] = useState<"alpha" | "gama">("alpha");
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("Please sign in to upgrade.");
      return;
    }

    setLoading(true);
    try {
      // Create Razorpay Order
      const orderRes = await createRazorpayOrderAction(selectedPlan);
      if (!orderRes.success || !orderRes.orderId) {
        toast.error(orderRes.error || "Failed to create payment order.");
        setLoading(false);
        return;
      }



      // If keys are active, load Razorpay SDK
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
        setLoading(false);
        return;
      }

      const emailAddress = user.primaryEmailAddress?.emailAddress || "";
      const fullName = user.fullName || "";

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        amount: orderRes.amount,
        currency: orderRes.currency,
        name: "Zentra AI",
        description: `${selectedPlan.toUpperCase()} Plan Subscription`,
        order_id: orderRes.orderId,
        handler: async function (response: any) {
          setLoading(true);
          try {
            const verifyRes = await verifyRazorpayPaymentAction(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              selectedPlan
            );
            if (verifyRes.success) {
              toast.success(`Welcome to Zentra ${selectedPlan.toUpperCase()}!`);
              onOpenChange(false);
              window.location.reload();
            } else {
              toast.error(verifyRes.error || "Failed to verify payment.");
            }
          } catch (err) {
            toast.error("An error occurred during verification.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          email: emailAddress,
          name: fullName,
        },
        theme: {
          color: "#C67B3D",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error("Payment failed: " + response.error.description);
      });
      rzp.open();
    } catch (err: any) {
      toast.error("An error occurred during checkout initialization.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cream-100 border-border rounded-2xl max-w-[420px] p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-[22px] font-normal text-espresso">
            Upgrade Your Plan
          </DialogTitle>
        </DialogHeader>
        <p className="font-sans text-[13px] leading-relaxed text-espresso-400 mt-1">
          Unlock unlimited active integrations, co-pilot drafting, and advanced AI features.
        </p>

        {/* Plan Cards selector */}
        <div className="flex flex-col gap-3.5 mt-5">
          {/* Alpha Plan */}
          <div
            onClick={() => !loading && setSelectedPlan("alpha")}
            className={`border rounded-xl p-4 cursor-pointer transition-all flex items-start justify-between ${
              selectedPlan === "alpha"
                ? "border-[#C67B3D] bg-white shadow-sm"
                : "border-border/60 hover:border-[#C67B3D]/50 hover:bg-white/40"
            }`}
          >
            <div className="space-y-1">
              <span className="font-sans text-[11px] font-bold tracking-wider text-[#C67B3D] uppercase block">
                ALPHA
              </span>
              <span className="font-sans text-[14px] font-semibold text-espresso block">
                Alpha Plan
              </span>
              <span className="font-sans text-[12px] text-espresso-300 block">
                Gmail & Calendar, up to 20 chats
              </span>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              <span className="font-serif text-[18px] text-espresso font-normal">
                ₹399
              </span>
              <span className="font-sans text-[10px] text-espresso-300">/ month</span>
            </div>
          </div>

          {/* Gama Plan */}
          <div
            onClick={() => !loading && setSelectedPlan("gama")}
            className={`border rounded-xl p-4 cursor-pointer transition-all flex items-start justify-between ${
              selectedPlan === "gama"
                ? "border-[#C67B3D] bg-white shadow-sm"
                : "border-border/60 hover:border-[#C67B3D]/50 hover:bg-white/40"
            }`}
          >
            <div className="space-y-1">
              <span className="font-sans text-[11px] font-bold tracking-wider text-espresso uppercase block">
                GAMA
              </span>
              <span className="font-sans text-[14px] font-semibold text-espresso block">
                Gama Plan
              </span>
              <span className="font-sans text-[12px] text-espresso-300 block">
                Gmail & Calendar, unlimited chats
              </span>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              <span className="font-serif text-[18px] text-espresso font-normal">
                ₹999
              </span>
              <span className="font-sans text-[10px] text-espresso-300">/ month</span>
            </div>
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="mt-6 flex flex-col gap-2">
          <Button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full rounded-pill bg-[#C67B3D] hover:bg-[#b0672e] text-white font-medium py-2.5 h-11"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              `Upgrade to ${selectedPlan.toUpperCase()}`
            )}
          </Button>
          <button
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="w-full text-center text-[12px] text-espresso-300 hover:text-espresso py-1 font-sans transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default UpgradeModal;
