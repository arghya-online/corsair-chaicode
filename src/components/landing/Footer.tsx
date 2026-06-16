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
    <footer className="bg-[#F7F3EC] py-24 px-6 select-none font-sans text-left border-t border-[rgba(17,24,39,0.06)]">
      <div className="mx-auto max-w-6xl space-y-12">
        
        {/* Upper Layout: Brand, Nav & Socials */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          
          {/* Left: Brand Logo */}
          <div className="space-y-4">
            <Link href="/" className="group flex items-center">
              <LogoMark className="h-6 w-auto transition-transform duration-300 group-hover:scale-105" />
            </Link>
          </div>

          {/* Center & Right: Navigation & Socials */}
          <div className="flex flex-wrap gap-x-12 gap-y-8 text-[15px] font-medium text-[#5F6B7A]">
            
            {/* Navigation */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[11px] font-semibold text-[#111827] uppercase tracking-[0.15em] mb-1">Navigation</span>
              <a href="#features" className="hover:text-[#C1783F] transition-colors">Features</a>
              <a href="#workflow" className="hover:text-[#C1783F] transition-colors">How It Works</a>
              <a href="#pricing" className="hover:text-[#C1783F] transition-colors">Pricing</a>
              <a href="#about" className="hover:text-[#C1783F] transition-colors">About</a>
            </div>

            {/* Socials */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[11px] font-semibold text-[#111827] uppercase tracking-[0.15em] mb-1">Socials</span>
              <a href="https://twitter.com/zentra_ai" target="_blank" rel="noreferrer" className="hover:text-[#C1783F] transition-colors">Twitter</a>
              <a href="https://github.com/zentra" target="_blank" rel="noreferrer" className="hover:text-[#C1783F] transition-colors">GitHub</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#C1783F] transition-colors">LinkedIn</a>
            </div>

            {/* Support */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[11px] font-semibold text-[#111827] uppercase tracking-[0.15em] mb-1">Privacy & Help</span>
              <button onClick={() => setPrivacyOpen(true)} className="text-left hover:text-[#C1783F] cursor-pointer">Privacy Policy</button>
              <button onClick={() => setTermsOpen(true)} className="text-left hover:text-[#C1783F] cursor-pointer">Terms of Service</button>
              <button onClick={() => setContactOpen(true)} className="text-left hover:text-[#C1783F] cursor-pointer">Contact Support</button>
            </div>

          </div>

        </div>

        {/* Small Divider */}
        <hr className="border-[rgba(17,24,39,0.06)]" />

        {/* Lower Row: Footer Text & Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[14px] text-[#5F6B7A]">
          <span className="font-serif italic text-[16px] text-[#111827]">Built for calm, focused work.</span>
          <span>&copy; {currentYear} Zentra. All rights reserved.</span>
        </div>

      </div>

      {/* ── Privacy Policy Modal ── */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="bg-[#FCFAF7] border-[rgba(17,24,39,0.08)] rounded-2xl max-w-[500px] p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-[22px] font-normal text-[#111827]">
              Privacy Policy
            </DialogTitle>
          </DialogHeader>
          <div className="font-sans text-[14px] text-[#5F6B7A] space-y-3.5 leading-relaxed mt-2">
            <p>
              Your data privacy is our core engineering design choice. Zentra routes OAuth sync workflows through official Google API integrations and executes prompts safely.
            </p>
            <p className="font-semibold text-[#111827]">
              Data Isolation
            </p>
            <p>
              We do not aggregate, read, or sell your emails, calendars, or command histories. Data classifications are cached securely on your workspace database tenant.
            </p>
            <p className="font-semibold text-[#111827]">
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
        <DialogContent className="bg-[#FCFAF7] border-[rgba(17,24,39,0.08)] rounded-2xl max-w-[500px] p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-[22px] font-normal text-[#111827]">
              Terms of Service
            </DialogTitle>
          </DialogHeader>
          <div className="font-sans text-[14px] text-[#5F6B7A] space-y-3.5 leading-relaxed mt-2">
            <p>
              Welcome to Zentra. By connecting your Google Accounts, you authorize Zentra to access message lists, draft compositions, and scheduler databases scope permissions under your control.
            </p>
            <p className="font-semibold text-[#111827]">
              Authorized Usage
            </p>
            <p>
              You agree to use Zentra's background sync and response modules solely for personal or authorized organization operations, complying with legal workspace restrictions.
            </p>
            <p className="font-semibold text-[#111827]">
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
        <DialogContent className="bg-[#FCFAF7] border-[rgba(17,24,39,0.08)] rounded-2xl max-w-[420px] p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-[22px] font-normal text-[#111827]">
              Contact Us
            </DialogTitle>
          </DialogHeader>
          <p className="font-sans text-[13px] text-[#5F6B7A] mt-1.5 leading-relaxed">
            Need support or have integration feedback? Submit your details below or write to us at <span className="text-[#C1783F] font-semibold">support@zentra.ai</span>.
          </p>
          <form onSubmit={handleContactSubmit} className="mt-4 flex flex-col gap-3">
            <Input
              type="email"
              placeholder="your@email.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              disabled={sending}
              required
              className="bg-[#F7F3EC] border-[rgba(17,24,39,0.08)] rounded-xl text-[13px] h-10"
            />
            <Textarea
              placeholder="How can we help you?"
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              disabled={sending}
              required
              className="bg-[#F7F3EC] border-[rgba(17,24,39,0.08)] rounded-xl text-[13px] min-h-[90px] resize-none"
            />
            <Button type="submit" disabled={sending} className="w-full bg-[#111827] hover:bg-[#111827]/95 text-white rounded-full h-10 text-[13px]">
              {sending ? "Sending..." : "Submit Message"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

    </footer>
  );
}

export default Footer;
