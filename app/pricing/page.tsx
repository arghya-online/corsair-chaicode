import React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/src/actions/auth";

export default async function PricingPage() {
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#0D0D0D] flex flex-col font-sans selection:bg-[#1B4FD8] selection:text-white">
      {/* Header */}
      <header className="border-b border-[#E8E8EC] bg-[#FAFAFA]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-6">
          <Link href="/" id="brand-logo" className="text-xl font-bold tracking-widest text-[#0D0D0D] uppercase font-display">
            Zentra
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/pricing" id="nav-pricing" className="text-sm font-semibold text-[#0D0D0D]">
              Pricing
            </Link>
            {user ? (
              <Link
                href="/dashboard"
                id="nav-console"
                className="rounded-full bg-[#1B4FD8] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#1844C0]"
              >
                Go to Console
              </Link>
            ) : (
              <>
                <Link href="/login" id="nav-login" className="text-sm font-semibold text-[#6B7280] hover:text-[#0D0D0D]">
                  Sign In
                </Link>
                <Link
                  href="/register"
                  id="nav-register"
                  className="rounded-full bg-[#1B4FD8] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#1844C0]"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Pricing Container */}
      <section className="flex-1 flex flex-col items-center justify-center py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-[#F4622A] uppercase tracking-wider font-mono">
            Simple Outcomes
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-[#0D0D0D] font-display sm:text-5xl">
            Choose how you build.
          </h1>
          <p className="text-base text-[#6B7280]">
            No complex comparison sheets. Select the outcome that matches your pace.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch w-full max-w-5xl">
          {/* Card: Free */}
          <div className="bg-white border border-[#E8E8EC] rounded-[24px] p-10 shadow-[0_8px_40px_rgba(13,13,13,0.04)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(13,13,13,0.08)]">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  Free
                </span>
                <div className="mt-2 flex items-baseline font-display text-5xl font-bold text-[#1B4FD8]">
                  $0
                  <span className="text-xs font-mono font-medium text-[#6B7280] tracking-normal ml-1">
                    /mo
                  </span>
                </div>
                <p className="mt-2 text-xs font-mono text-[#6B7280]">
                  For builders just getting started
                </p>
              </div>

              <div className="h-[1px] bg-[#E8E8EC]" />

              <ul className="space-y-4 text-sm text-[#0D0D0D]">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B4FD8]" />
                  <span>Up to 3 integrations synced</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B4FD8]" />
                  <span>50 AI autonomous actions / month</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B4FD8]" />
                  <span>Standard database tasks link</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              id="cta-free-btn"
              className="mt-8 block w-full rounded-full border border-[#E8E8EC] bg-white text-center py-3 text-xs font-semibold text-[#0D0D0D] transition hover:bg-[#F2F2F5]"
            >
              Start for free
            </Link>
          </div>

          {/* Card: Pro (Slightly larger, Glow, Sits higher on desktop) */}
          <div className="bg-white border border-[#E8E8EC] rounded-[24px] p-10 flex flex-col justify-between transition-all duration-300 hover:-translate-y-4 hover:shadow-[0_24px_60px_rgba(244,98,42,0.18)] relative md:scale-[1.03] md:-translate-y-4 shadow-[0_8px_40px_rgba(244,98,42,0.10),0_0_0_1px_rgba(244,98,42,0.15)]">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F4622A]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F4622A] animate-pulse" />
                    Pro
                  </span>
                  <div className="mt-2 flex items-baseline font-display text-5xl font-bold text-[#F4622A]">
                    $24
                    <span className="text-xs font-mono font-medium text-[#6B7280] tracking-normal ml-1">
                      /mo
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-mono text-[#6B7280]">
                    For professionals who move fast
                  </p>
                </div>
              </div>

              <div className="h-[1px] bg-[#E8E8EC]" />

              <ul className="space-y-4 text-sm text-[#0D0D0D]">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F4622A]" />
                  <span>Unlimited active integrations</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F4622A]" />
                  <span>Unlimited AI actions & drafting</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F4622A]" />
                  <span>Priority processing (0.2s latency)</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F4622A]" />
                  <span>Drafts emails before you open them</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              id="cta-pro-btn"
              className="mt-8 block w-full rounded-full bg-[#F4622A] text-white text-center py-3 text-xs font-semibold transition hover:bg-[#ea580c] hover:shadow-[0_4px_16px_rgba(244,98,42,0.3)]"
            >
              Get started now
            </Link>
          </div>

          {/* Card: Team */}
          <div className="bg-white border border-[#E8E8EC] rounded-[24px] p-10 shadow-[0_8px_40px_rgba(13,13,13,0.04)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(13,13,13,0.08)]">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  Team
                </span>
                <div className="mt-2 flex items-baseline font-display text-5xl font-bold text-[#1B4FD8]">
                  $79
                  <span className="text-xs font-mono font-medium text-[#6B7280] tracking-normal ml-1">
                    /mo per seat
                  </span>
                </div>
                <p className="mt-2 text-xs font-mono text-[#6B7280]">
                  For teams that collaborate on everything
                </p>
              </div>

              <div className="h-[1px] bg-[#E8E8EC]" />

              <ul className="space-y-4 text-sm text-[#0D0D0D]">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B4FD8]" />
                  <span>Everything included in Pro plan</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B4FD8]" />
                  <span>Shared organizational AI contexts</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B4FD8]" />
                  <span>Team-level access permissions</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B4FD8]" />
                  <span>Audit trails & detailed system logs</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              id="cta-team-btn"
              className="mt-8 block w-full rounded-full border border-[#E8E8EC] bg-white text-center py-3 text-xs font-semibold text-[#0D0D0D] transition hover:bg-[#F2F2F5]"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8E8EC] bg-white py-12 text-center text-xs text-[#6B7280]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center px-6 gap-6">
          <span className="font-mono">&copy; {new Date().getFullYear()} Zentra AI. Crafted for the future of work.</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-[#0D0D0D] transition-colors">Home</Link>
            <Link href="/login" className="hover:text-[#0D0D0D] transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-[#0D0D0D] transition-colors">Get Started</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
