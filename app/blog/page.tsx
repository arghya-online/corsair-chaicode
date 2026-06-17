import React from "react";
import { getCurrentUser } from "@/src/actions/auth";
import { Nav } from "@/src/components/landing/Nav";
import { Footer } from "@/src/components/landing/Footer";
import { Clock } from "lucide-react";

export default async function BlogPage() {
  const user = await getCurrentUser();

  const posts = [
    {
      title: "Designing software to reduce cognitive load",
      date: "June 14, 2026",
      readTime: "5 min read",
      author: "Aditi Rao",
      desc: "Why modern software defaults to noise, and how Zentra uses Indian courtyard layout principles to build workspaces that feel calming and spacious.",
    },
    {
      title: "Offline-first SQLite vector search indices",
      date: "June 03, 2026",
      readTime: "8 min read",
      author: "Devendra Patil",
      desc: "An in-depth look at our client-side database schemas. Learn how we cache inbox threads safely without transmitting raw texts to remote databases.",
    },
    {
      title: "Reclaiming focus: The end of email inbox tabs",
      date: "May 22, 2026",
      readTime: "4 min read",
      author: "Vikram Malhotra",
      desc: "Why nesting emails into categorized tabs fails, and how semantic NLP context grouping presents summaries you actually need.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F7F3EC] text-[#111827] flex flex-col font-sans relative overflow-hidden">
      <Nav user={user} />

      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="url(#footer-jaali)" />
        </svg>
      </div>
      <div className="absolute top-[20%] left-[10%] w-[550px] h-[550px] rounded-full bg-[#C67B3D]/5 blur-[120px] pointer-events-none z-0" />

      {/* Hero Header */}
      <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto w-full z-10 text-left">
        <div className="max-w-3xl space-y-4 mb-16">
          <span className="text-[12px] font-bold tracking-[0.2em] text-[#C67B3D] uppercase">JOURNAL</span>
          <h1 className="text-[48px] sm:text-[60px] font-serif font-normal text-[#111827] leading-tight tracking-tight">
            Zentra Journal
          </h1>
          <p className="text-[16px] sm:text-[18px] text-[#64748B] max-w-2xl leading-relaxed">
            Observations on software design, data isolation, and methods to create a calm, focused workday.
          </p>
        </div>

        {/* Blog Post List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {posts.map((p, idx) => (
            <div
              key={idx}
              style={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(20px)",
              }}
              className="p-6.5 rounded-[24px] border border-[rgba(198,123,61,0.12)] hover:border-[#C67B3D]/30 transition-all duration-300 flex flex-col justify-between text-left"
            >
              <div className="space-y-4">
                {/* Meta details */}
                <div className="flex items-center gap-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                  <span>{p.date}</span>
                  <span className="w-1 h-1 rounded-full bg-[#64748B]/30" />
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{p.readTime}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-[18px] font-serif font-bold text-[#111827] leading-snug line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="text-[13px] text-[#64748B] leading-relaxed line-clamp-4">
                    {p.desc}
                  </p>
                </div>
              </div>

              {/* Author info */}
              <div className="pt-6 border-t border-[rgba(17,24,39,0.06)] mt-6 flex justify-between items-center text-[12px]">
                <span className="font-bold text-[#111827]">{p.author}</span>
                <span className="text-[#C67B3D] font-semibold hover:underline cursor-pointer">Read article &rarr;</span>
              </div>
            </div>
          ))}
        </div>

      </section>

      <Footer />
    </main>
  );
}
