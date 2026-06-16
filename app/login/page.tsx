"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInAction } from "@/src/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signInAction({ email, password });
      if (res.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(res.error || "Authentication failed");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#0D0D0D] flex items-center justify-center p-6 select-none font-sans">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="text-3xl font-extrabold tracking-widest text-[#0D0D0D] uppercase font-display">
            ZENTRA
          </Link>
          <p className="mt-2 text-sm text-[#6B7280]">
            Sign in to access your workflow center
          </p>
        </div>

        <div className="bg-white border border-[#E8E8EC] rounded-[24px] p-8 shadow-[0_8px_40px_rgba(13,13,13,0.03)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-[#E8E8EC] bg-[#FAFAFA] py-3 px-4 text-sm text-[#0D0D0D] placeholder-[#6B7280]/40 outline-none transition focus:border-[#1B4FD8] focus:bg-white focus:ring-1 focus:ring-[#1B4FD8]"
                placeholder="name@domain.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-[#E8E8EC] bg-[#FAFAFA] py-3 px-4 text-sm text-[#0D0D0D] placeholder-[#6B7280]/40 outline-none transition focus:border-[#1B4FD8] focus:bg-white focus:ring-1 focus:ring-[#1B4FD8]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center rounded-full bg-[#1B4FD8] py-3 text-sm font-semibold text-white transition hover:bg-[#1844C0] active:scale-[0.98] disabled:opacity-50 cursor-pointer hover:shadow-[0_4px_16px_rgba(27,79,216,0.25)]"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#6B7280]">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-[#1B4FD8] hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
