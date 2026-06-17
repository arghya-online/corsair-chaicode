"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Star, Sparkles, Send } from "lucide-react";
import { Nav } from "@/src/components/landing/Nav";
import { Footer } from "@/src/components/landing/Footer";

interface FeedbackClientProps {
  user: any;
}

export function FeedbackClient({ user }: FeedbackClientProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      toast.error("Please enter your feedback text.");
      return;
    }

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitting(false);

    toast.success("Feedback submitted! Thank you for helping us shape Zentra.");
    setFeedbackText("");
  };

  return (
    <main className="min-h-screen bg-[#F7F3EC] text-[#111827] flex flex-col font-sans relative overflow-hidden">
      <Nav user={user} />

      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="url(#footer-jaali)" />
        </svg>
      </div>
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-[#C67B3D]/5 blur-[120px] pointer-events-none z-0" />

      {/* Hero Header */}
      <section className="pt-32 pb-24 px-6 max-w-xl mx-auto w-full z-10 text-center">
        
        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[rgba(198,123,61,0.1)] shadow-xs">
            <Sparkles className="w-3 h-3 text-[#C67B3D]" />
            <span className="text-[10px] font-bold text-[#64748B] tracking-wider uppercase">User Feedback</span>
          </div>

          <h1 className="text-[44px] font-serif font-normal text-[#111827] leading-tight tracking-tight">
            Share your thoughts
          </h1>
          <p className="text-[14.5px] text-[#64748B] leading-relaxed">
            Your reviews help us design the future of calm productivity. Rate your experience and leave your notes below.
          </p>
        </div>

        {/* Feedback Card */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(20px)",
          }}
          className="p-8 rounded-[28px] border border-[rgba(198,123,61,0.15)] shadow-[0_20px_50px_rgba(0,0,0,0.04)] text-left w-full"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Star Rating */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[#111827] uppercase tracking-wider block">Overall Experience</label>
              
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = (hoverRating !== null ? hoverRating : rating) >= star;
                  return (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="text-[#C67B3D] transition-transform duration-150 hover:scale-110 cursor-pointer"
                    >
                      <Star
                        className="w-8 h-8 fill-current"
                        style={{
                          fillOpacity: isActive ? 1 : 0.08,
                          strokeWidth: 1.5,
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes Textarea */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[#111827] uppercase tracking-wider block">Your Feedback</label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="What do you like about Zentra? What can we do better?"
                required
                rows={5}
                className="w-full bg-[#FBF8F2] border border-[rgba(17,24,39,0.08)] rounded-xl px-4 py-3 text-[14px] text-[#111827] focus:border-[#C67B3D] transition-colors duration-200 outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-[#111827] hover:bg-[#C67B3D] text-[13.5px] font-bold text-white transition-all duration-300 py-4 cursor-pointer flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>

          </form>
        </div>

      </section>

      <Footer />
    </main>
  );
}
