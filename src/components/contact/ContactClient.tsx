"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Mail, MessageSquare, Send, Sparkles } from "lucide-react";
import { Nav } from "@/src/components/landing/Nav";
import { Footer } from "@/src/components/landing/Footer";

interface ContactClientProps {
  user: any;
}

export function ContactClient({ user }: ContactClientProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("General Support");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || !message.trim()) {
      toast.error("Please enter a valid email and details.");
      return;
    }

    setSending(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSending(false);

    toast.success("Inquiry sent! Zentra's support team will get in touch shortly.");
    setEmail("");
    setName("");
    setMessage("");
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

      {/* Hero Content */}
      <section className="pt-32 pb-24 px-6 max-w-6xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left pane: Details (Span 5) */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[rgba(198,123,61,0.1)] shadow-xs">
            <Sparkles className="w-3 h-3 text-[#C67B3D]" />
            <span className="text-[10px] font-bold text-[#64748B] tracking-wider uppercase">Contact Zentra</span>
          </div>

          <h1 className="text-[44px] sm:text-[54px] font-serif font-normal text-[#111827] leading-tight tracking-tight">
            How can we help?
          </h1>
          <p className="text-[15px] text-[#64748B] leading-relaxed">
            Need integration help, enterprise details, custom billing support, or have product queries? Reach out, and we will get back to you shortly.
          </p>

          <div className="space-y-4 pt-4 text-[14px]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white border border-[rgba(17,24,39,0.06)] rounded-lg flex items-center justify-center text-[#C67B3D]">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="font-semibold text-[#111827]">General inquiries</p>
                <a href="mailto:hello@zentra.ai" className="text-[#64748B] hover:text-[#C67B3D] transition-colors">hello@zentra.ai</a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white border border-[rgba(17,24,39,0.06)] rounded-lg flex items-center justify-center text-[#C67B3D]">
                <MessageSquare className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="font-semibold text-[#111827]">Technical Support</p>
                <a href="mailto:support@zentra.ai" className="text-[#64748B] hover:text-[#C67B3D] transition-colors">support@zentra.ai</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right pane: Form Container (Span 7) */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(20px)",
          }}
          className="lg:col-span-7 p-8 sm:p-10 rounded-[28px] border border-[rgba(198,123,61,0.15)] shadow-[0_20px_50px_rgba(0,0,0,0.04)] text-left w-full"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name input */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[#111827] uppercase tracking-wider block">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full bg-[#FBF8F2] border border-[rgba(17,24,39,0.08)] rounded-xl px-4 py-3 text-[14px] text-[#111827] focus:border-[#C67B3D] transition-colors duration-200 outline-none"
              />
            </div>

            {/* Email input */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[#111827] uppercase tracking-wider block">Your Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="w-full bg-[#FBF8F2] border border-[rgba(17,24,39,0.08)] rounded-xl px-4 py-3 text-[14px] text-[#111827] focus:border-[#C67B3D] transition-colors duration-200 outline-none"
              />
            </div>

            {/* Subject Select */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[#111827] uppercase tracking-wider block">Topic</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#FBF8F2] border border-[rgba(17,24,39,0.08)] rounded-xl px-4 py-3 text-[14px] text-[#111827] focus:border-[#C67B3D] transition-colors duration-200 outline-none"
              >
                <option value="General Support">General Support</option>
                <option value="Technical Integration">Technical Integration</option>
                <option value="Enterprise Workspace">Enterprise Workspace</option>
                <option value="Billing Details">Billing Details</option>
              </select>
            </div>

            {/* Message input */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[#111827] uppercase tracking-wider block">How can we help?</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your inquiry in detail..."
                required
                rows={5}
                className="w-full bg-[#FBF8F2] border border-[rgba(17,24,39,0.08)] rounded-xl px-4 py-3 text-[14px] text-[#111827] focus:border-[#C67B3D] transition-colors duration-200 outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-xl bg-[#111827] hover:bg-[#C67B3D] text-[13.5px] font-bold text-white transition-all duration-300 py-4 cursor-pointer flex items-center justify-center gap-2"
            >
              {sending ? (
                <span>Sending...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
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
