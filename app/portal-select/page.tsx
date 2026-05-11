"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import { ArrowUpRight, LogOut } from "lucide-react";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});
const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jb-mono",
});

type Portal = {
  id: "dept" | "tnp" | "hostel";
  label: string;
  description: string;
  href: string;
};
type PortalsResponse = {
  success: boolean;
  user?: { name: string; role: string; initials: string };
  portals?: Portal[];
  message?: string;
};

const portalAccents: Record<Portal["id"], { accent: string; bg: string; tag: string; arrow: string; ring: string }> = {
  dept: {
    accent: "#3b3f9c",
    bg: "from-indigo-50 via-white to-white",
    tag: "Academic",
    arrow: "text-indigo-700",
    ring: "group-hover:ring-indigo-200",
  },
  tnp: {
    accent: "#0f7a5c",
    bg: "from-emerald-50 via-white to-white",
    tag: "Career",
    arrow: "text-emerald-700",
    ring: "group-hover:ring-emerald-200",
  },
  hostel: {
    accent: "#a3631a",
    bg: "from-amber-50 via-white to-white",
    tag: "Residence",
    arrow: "text-amber-700",
    ring: "group-hover:ring-amber-200",
  },
};

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Working late";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
}

export default function PortalSelectPage() {
  const router = useRouter();
  const [data, setData] = useState<PortalsResponse | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch("/api/me/portals", { credentials: "include" })
      .then((r) => r.json())
      .then((d: PortalsResponse) => {
        if (!d.success) router.replace("/login");
        else setData(d);
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      router.replace("/login");
    } catch {
      setLoggingOut(false);
    }
  }

  const user = data?.user;
  const portals = data?.portals ?? [];

  return (
    <div className={`${fraunces.variable} ${jbMono.variable} min-h-screen relative overflow-hidden`}
         style={{ background: "#F8F5EE" }}>
      {/* Dot grid background */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, #b8a98c 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Warm glow blobs */}
      <div aria-hidden className="absolute -top-32 -right-32 size-[480px] rounded-full blur-3xl opacity-40"
           style={{ background: "radial-gradient(circle, #f4d9a5 0%, transparent 70%)" }} />
      <div aria-hidden className="absolute -bottom-40 -left-32 size-[520px] rounded-full blur-3xl opacity-30"
           style={{ background: "radial-gradient(circle, #c3d9c7 0%, transparent 70%)" }} />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-8 md:px-14 pt-8">
        <div className="flex items-center gap-2.5">
          <div className="size-2.5 rounded-full bg-stone-900" />
          <span style={{ fontFamily: "var(--font-jb-mono)" }} className="text-xs tracking-[0.18em] text-stone-700 uppercase">
            CPMS · Portal
          </span>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="group flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-stone-500 hover:text-stone-900 transition-colors disabled:opacity-50"
          style={{ fontFamily: "var(--font-jb-mono)" }}
        >
          <LogOut className="size-3.5" />
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </header>

      {/* Main */}
      <main className="relative z-10 px-8 md:px-14 pt-16 md:pt-24 pb-16 max-w-6xl">
        {/* Greeting */}
        <div className="mb-14 md:mb-20">
          <p
            style={{ fontFamily: "var(--font-jb-mono)" }}
            className="text-[11px] tracking-[0.22em] text-stone-500 uppercase mb-5 opacity-0 animate-fadeup"
          >
            ※ Welcome back
          </p>
          <h1
            style={{ fontFamily: "var(--font-fraunces)", fontFeatureSettings: "'ss01' on, 'ss02' on" }}
            className="text-[44px] md:text-[68px] leading-[0.95] tracking-tight text-stone-900 font-medium opacity-0 animate-fadeup"
            data-delay="80"
          >
            {data ? greeting() : "Welcome"},{" "}
            <span style={{ fontStyle: "italic", fontWeight: 400, color: "#8a6a2f" }}>
              {user?.name?.split(" ")[0] ?? "—"}
            </span>
          </h1>
          <p
            className="mt-5 text-stone-600 text-base md:text-lg max-w-xl opacity-0 animate-fadeup"
            data-delay="160"
          >
            Choose where you want to go. Each portal is a different part of campus life,
            quietly waiting for you.
          </p>
        </div>

        {/* Portals */}
        <div className="space-y-3 md:space-y-4">
          {!data &&
            [1, 2, 3].map((i) => (
              <div key={i} className="h-[112px] rounded-2xl bg-stone-100/60 border border-stone-200/60 animate-pulse" />
            ))}

          {data &&
            portals.map((p, i) => {
              const acc = portalAccents[p.id];
              const num = String(i + 1).padStart(2, "0");
              return (
                <a
                  key={p.id}
                  href={p.href}
                  className={`group relative block opacity-0 animate-fadeup`}
                  data-delay={String(220 + i * 90)}
                >
                  <div
                    className={`relative grid grid-cols-[80px_1fr_auto] md:grid-cols-[120px_1fr_auto] items-center gap-4 md:gap-8
                      bg-white/80 backdrop-blur-sm border border-stone-200/80 rounded-2xl px-5 md:px-8 py-6 md:py-7
                      transition-all duration-500 ease-out
                      hover:translate-x-[2px] hover:shadow-[0_24px_60px_-30px_rgba(60,40,20,0.18)]
                      hover:bg-gradient-to-r ${acc.bg}
                      ring-1 ring-transparent ${acc.ring}`}
                  >
                    {/* Accent bar */}
                    <span
                      aria-hidden
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-10 rounded-r-full transition-all duration-500 group-hover:h-16"
                      style={{ background: acc.accent }}
                    />

                    {/* Numeral */}
                    <div className="flex flex-col items-start">
                      <span
                        style={{ fontFamily: "var(--font-fraunces)", fontFeatureSettings: "'ss01' on" }}
                        className="text-[44px] md:text-[60px] leading-none font-medium text-stone-900/85 tracking-tight"
                      >
                        {num}
                      </span>
                      <span
                        style={{ fontFamily: "var(--font-jb-mono)" }}
                        className="text-[10px] tracking-[0.18em] uppercase text-stone-400 mt-1"
                      >
                        {acc.tag}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="min-w-0">
                      <h2
                        style={{ fontFamily: "var(--font-fraunces)" }}
                        className="text-2xl md:text-3xl text-stone-900 font-medium tracking-tight leading-tight"
                      >
                        {p.label}
                      </h2>
                      <p className="text-stone-500 text-sm md:text-[15px] mt-1.5 leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 md:gap-3">
                      <span
                        style={{ fontFamily: "var(--font-jb-mono)" }}
                        className={`hidden md:inline text-[11px] tracking-[0.2em] uppercase ${acc.arrow} opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500`}
                      >
                        Enter
                      </span>
                      <div
                        className={`size-11 md:size-12 rounded-full border border-stone-200 flex items-center justify-center transition-all duration-500
                          group-hover:rotate-[-12deg] group-hover:border-transparent`}
                        style={
                          {
                            "--accent": acc.accent,
                          } as React.CSSProperties
                        }
                      >
                        <ArrowUpRight
                          className={`size-5 ${acc.arrow} transition-transform duration-500 group-hover:scale-110`}
                        />
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}

          {data && portals.length === 0 && (
            <div className="text-center py-20 text-stone-500 text-sm">
              No portals are available for your account. Contact administration.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-20 flex items-center justify-between text-xs text-stone-400" style={{ fontFamily: "var(--font-jb-mono)" }}>
          <span className="tracking-[0.16em] uppercase">VSSUT · Burla</span>
          <span>© 2026</span>
        </div>
      </main>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeup {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        :global(.animate-fadeup) {
          animation: fadeup 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
        }
        :global(.animate-fadeup[data-delay]) {
          animation-delay: calc(var(--d, 0) * 1ms);
        }
      `}</style>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.querySelectorAll('.animate-fadeup[data-delay]').forEach(el => { el.style.setProperty('--d', el.getAttribute('data-delay')); });`,
        }}
      />
    </div>
  );
}
