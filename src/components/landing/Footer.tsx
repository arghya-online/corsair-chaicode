"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogoMark } from "@/src/components/shared/LogoMark";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Modal states
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // Contact form state
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.includes("@") || !contactMessage.trim()) {
      toast.error("Please enter a valid email and message.");
      return;
    }
    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSending(false);
    toast.success("Message sent! Zentra support will contact you shortly.");
    setContactEmail("");
    setContactMessage("");
    setContactOpen(false);
  };

  return (
    <footer className="bg-[#FFFDF9] border-t border-[rgba(28,36,49,0.08)] py-16 px-6 select-none">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center select-none group">
              <LogoMark className="transition-transform duration-300 group-hover:scale-105 h-8 w-auto" />
            </Link>
            <p className="text-[14px] text-espresso-400 font-sans max-w-sm leading-relaxed">
              The assistant that acts while you think. Connecting your inbox, calendar, and workflows under a secure native agent.
            </p>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-left">
            {/* Product Column */}
            <div className="space-y-3">
              <span className="text-[11px] font-medium text-espresso-300 uppercase tracking-widest font-mono">
                product
              </span>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-[14px] text-espresso-400 hover:text-[#A85A3A] transition-colors font-sans font-medium">
                    features
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-[14px] text-espresso-400 hover:text-[#A85A3A] transition-colors font-sans font-medium">
                    about
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-[14px] text-espresso-400 hover:text-[#A85A3A] transition-colors font-sans font-medium">
                    pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Security Column */}
            <div className="space-y-3">
              <span className="text-[11px] font-medium text-espresso-300 uppercase tracking-widest font-mono">
                security
              </span>
              <ul className="space-y-2">
                <li>
                  <span className="text-[14px] text-espresso-400 font-sans font-medium">
                    google OAuth
                  </span>
                </li>
                <li>
                  <span className="text-[14px] text-espresso-400 font-sans font-medium">
                    data encryption
                  </span>
                </li>
                <li>
                  <span className="text-[14px] text-espresso-400 font-sans font-medium">
                    secure AI sandbox
                  </span>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="space-y-3">
              <span className="text-[11px] font-medium text-espresso-300 uppercase tracking-widest font-mono">
                support & legal
              </span>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setPrivacyOpen(true)}
                    className="text-[14px] text-espresso-400 hover:text-[#A85A3A] transition-colors cursor-pointer font-sans font-medium text-left bg-transparent border-none p-0 outline-none"
                  >
                    privacy policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setTermsOpen(true)}
                    className="text-[14px] text-espresso-400 hover:text-[#A85A3A] transition-colors cursor-pointer font-sans font-medium text-left bg-transparent border-none p-0 outline-none"
                  >
                    terms of service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setContactOpen(true)}
                    className="text-[14px] text-espresso-400 hover:text-[#A85A3A] transition-colors cursor-pointer font-sans font-medium text-left bg-transparent border-none p-0 outline-none"
                  >
                    contact us
                  </button>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom copyright segment */}
        <div className="border-t border-[rgba(28,36,49,0.08)] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
          <span className="text-[12px] font-mono text-espresso-300">
            &copy; {currentYear} zentra. crafted for the future of work.
          </span>
          <div className="flex gap-4">
            <Link href="/login" className="text-[12px] text-espresso-300 hover:text-[#A85A3A] transition-colors font-sans">
              sign in
            </Link>
            <span className="text-espresso-100 font-sans text-[12px] select-none">|</span>
            <Link href="/register" className="text-[12px] text-espresso-300 hover:text-[#A85A3A] transition-colors font-sans">
              get started
            </Link>
          </div>
        </div>

      </div>

      {/* ── Privacy Policy Modal ── */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="bg-white border-border rounded-2xl max-w-[500px] p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-[22px] font-normal text-espresso">
              Privacy policy
            </DialogTitle>
          </DialogHeader>
          <div className="font-sans text-[14px] text-espresso-400 space-y-3.5 leading-relaxed mt-2">
            <p>
              Your data privacy is our core engineering design choice. Zentra routes OAuth sync workflows through official Google API integrations and executes prompts safely.
            </p>
            <p className="font-medium text-espresso">
              Data Isolation
            </p>
            <p>
              We do not aggregate, read, or sell your emails, calendars, or command histories. Data classifications are cached securely on your workspace database tenant.
            </p>
            <p className="font-medium text-espresso">
              Model Training
            </p>
            <p>
              None of your inbox text, command descriptions, or private documents are used to train external large language models.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Terms of Service Modal ── */}
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="bg-white border-border rounded-2xl max-w-[500px] p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-[22px] font-normal text-espresso">
              Terms of service
            </DialogTitle>
          </DialogHeader>
          <div className="font-sans text-[14px] text-espresso-400 space-y-3.5 leading-relaxed mt-2">
            <p>
              Welcome to Zentra. By connecting your Google Accounts, you authorize Zentra to access message lists, draft compositions, and scheduler databases scope permissions under your control.
            </p>
            <p className="font-medium text-espresso">
              Authorized Usage
            </p>
            <p>
              You agree to use Zentra's background sync and response modules solely for personal or authorized organization operations, complying with legal workspace restrictions.
            </p>
            <p className="font-medium text-espresso">
              Early Access
            </p>
            <p>
              Zentra features are currently in beta. Support, availability guarantees, and service scopes may update as our engine scales.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Contact Us Modal ── */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="bg-white border-border rounded-2xl max-w-[420px] p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-[22px] font-normal text-espresso">
              Contact us
            </DialogTitle>
          </DialogHeader>
          <p className="font-sans text-[13px] text-espresso-400 mt-1.5 leading-relaxed">
            Need support or have integration feedback? Submit your details below or write to us at <span className="text-peach-text font-medium">support@zentra.ai</span>.
          </p>
          <form onSubmit={handleContactSubmit} className="mt-4 flex flex-col gap-3">
            <Input
              type="email"
              placeholder="your@email.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              disabled={sending}
              required
              className="bg-cream-200 border-border rounded-xl text-[13px] h-10"
            />
            <Textarea
              placeholder="How can we help you?"
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              disabled={sending}
              required
              className="bg-cream-200 border-border rounded-xl text-[13px] min-h-[90px] resize-none"
            />
            <Button type="submit" disabled={sending} className="w-full rounded-pill h-10 text-[13px]">
              {sending ? "Sending..." : "Submit message"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

    </footer>
  );
}

export default Footer;
