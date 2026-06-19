import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Zentra",
  description: "AI-native workspace integrating your inbox, calendar, and codebase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#F7F3EC] text-[#111827]" suppressHydrationWarning>
        <ClerkProvider appearance={{ theme: shadcn }}>
          <TooltipProvider delay={150}>
            {children}
          </TooltipProvider>
          <Toaster theme="light" toastOptions={{ className: 'font-sans text-[12px]' }} />
        </ClerkProvider>
      </body>
    </html>
  );
}
