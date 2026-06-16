import React from "react";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F7F3EC] text-[#111827] flex items-center justify-center p-6 select-none font-sans">
      <div className="w-full max-w-md flex flex-col items-center">
        <SignIn />
      </div>
    </main>
  );
}
