"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  MessageSquare,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Bell,
  Boxes,
} from "lucide-react";

interface Application {
  _id: string;
  studentName: string;
  studentRegdNo: string;
  roomType: string;
  status: string;
  createdAt: string;
}

interface Complaint {
  _id: string;
  studentName: string;
  studentRegdNo: string;
  category: string;
  status: string;
  createdAt: string;
}

interface Stats {
  totalStudents: number;
  pendingApps: number;
  openComplaints: number;
  lowStock: number;
  recentApplications: Application[];
  recentComplaints: Complaint[];
}

type TimeOfDay = "morning" | "afternoon" | "evening";
function getTimeOfDay(): TimeOfDay {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
function greetingFor(t: TimeOfDay) {
  return t === "morning"
    ? "Good morning"
    : t === "afternoon"
    ? "Good afternoon"
    : "Good evening";
}
const timeGradient: Record<TimeOfDay, string> = {
  morning:
    "radial-gradient(1200px 600px at 10% -10%, #fde68a 0%, transparent 60%), radial-gradient(900px 500px at 90% 0%, #fecdd3 0%, transparent 55%), linear-gradient(180deg, #fff7ed 0%, #ecfccb 100%)",
  afternoon:
    "radial-gradient(1200px 600px at 0% -10%, #bae6fd 0%, transparent 60%), radial-gradient(900px 600px at 100% 10%, #a7f3d0 0%, transparent 55%), linear-gradient(180deg, #ecfeff 0%, #f0fdf4 100%)",
  evening:
    "radial-gradient(1200px 700px at 100% -10%, #c4b5fd 0%, transparent 60%), radial-gradient(900px 600px at 0% 0%, #fbcfe8 0%, transparent 55%), linear-gradient(180deg, #f5f3ff 0%, #ecfdf5 100%)",
};

function useCounter(target: number, duration = 1100) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) {
      setVal(0);
      return;
    }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(timer);
      } else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return val;
}

interface BigStatProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  caption?: string;
  delay: number;
  tone: "primary" | "amber" | "rose" | "violet";
}
function BigStat({ label, value, icon, caption, delay, tone }: BigStatProps) {
  const counted = useCounter(value);
  const tones = {
    primary: { ring: "rgba(16,185,129,0.18)", text: "text-emerald-700", iconBg: "bg-emerald-700/10 text-emerald-800" },
    amber: { ring: "rgba(245,158,11,0.18)", text: "text-amber-700", iconBg: "bg-amber-500/15 text-amber-700" },
    rose: { ring: "rgba(244,63,94,0.18)", text: "text-rose-700", iconBg: "bg-rose-500/15 text-rose-700" },
    violet: { ring: "rgba(139,92,246,0.18)", text: "text-violet-700", iconBg: "bg-violet-500/15 text-violet-700" },
  }[tone];
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: `1px solid ${tones.ring}`,
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.7) inset, 0 8px 30px -12px rgba(20,83,45,0.18)",
        animation: "fadeSlideUp 0.6s ease both",
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-emerald-900/60 font-semibold">
            {label}
          </p>
          <p
            className="mt-3 text-5xl font-semibold tracking-tight text-emerald-950"
            style={{
              fontFamily: "'Bricolage Grotesque', 'DM Serif Display', serif",
            }}
          >
            {counted}
          </p>
          {caption && (
            <p className={`mt-1 text-xs ${tones.text}`}>{caption}</p>
          )}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones.iconBg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function Skel({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-3xl bg-white/40 ${className}`}
      style={{ backdropFilter: "blur(8px)" }}
    />
  );
}

const statusChip = (s: string) => {
  if (s === "pending" || s === "open")
    return "bg-amber-100/80 text-amber-800 border-amber-200/70";
  if (s === "approved" || s === "resolved")
    return "bg-emerald-100/80 text-emerald-800 border-emerald-200/70";
  if (s === "rejected") return "bg-rose-100/80 text-rose-700 border-rose-200/70";
  return "bg-sky-100/80 text-sky-800 border-sky-200/70";
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const tod = useMemo<TimeOfDay>(() => getTimeOfDay(), []);

  const reload = async () => {
    const r = await fetch("/api/hostel/admin/dashboard");
    const d = await r.json();
    if (d.success) setStats(d.data);
  };

  useEffect(() => {
    reload().finally(() => setLoading(false));
  }, []);

  const today = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    []
  );

  const decideApp = async (id: string, status: "approved" | "rejected") => {
    setActing(id);
    try {
      await fetch(`/api/hostel/admin/applications?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await reload();
    } finally {
      setActing(null);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Bricolage+Grotesque:wght@500;600;700&family=DM+Serif+Display&display=swap');
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ambientShift {
          0%, 100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(0,-12px,0) scale(1.02); }
        }
        .hostel-root { font-family: 'Nunito', sans-serif; }
        .hostel-display { font-family: 'Bricolage Grotesque', 'DM Serif Display', serif; letter-spacing: -0.02em; }
      `}</style>

      <div className="hostel-root relative min-h-screen overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: timeGradient[tod],
            animation: "ambientShift 18s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto p-8 space-y-6">
          {/* Header */}
          <div style={{ animation: "fadeSlideUp 0.5s ease both" }}>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800/70">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span className="uppercase tracking-[0.14em]">{today}</span>
            </div>
            <h1 className="hostel-display mt-3 text-[2.6rem] leading-[1.05] font-semibold text-emerald-950">
              {greetingFor(tod)},{" "}
              <span className="bg-gradient-to-br from-emerald-700 via-green-600 to-teal-600 bg-clip-text text-transparent">
                hostel admin
              </span>
              <span className="text-emerald-900/40">.</span>
            </h1>
            <p className="mt-2 text-emerald-900/70">
              Hostel Management System · live operations overview
            </p>
          </div>

          {/* Big stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading || !stats ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skel key={i} className="h-36" />
              ))
            ) : (
              <>
                <BigStat
                  label="Total students"
                  value={stats.totalStudents}
                  icon={<Users className="size-5" />}
                  caption="Across all hostels"
                  tone="primary"
                  delay={80}
                />
                <BigStat
                  label="Pending applications"
                  value={stats.pendingApps}
                  icon={<FileText className="size-5" />}
                  caption="Awaiting your decision"
                  tone="amber"
                  delay={160}
                />
                <BigStat
                  label="Open complaints"
                  value={stats.openComplaints}
                  icon={<MessageSquare className="size-5" />}
                  caption="In progress or new"
                  tone="rose"
                  delay={240}
                />
                <BigStat
                  label="Low-stock items"
                  value={stats.lowStock}
                  icon={<AlertTriangle className="size-5" />}
                  caption="At or below threshold"
                  tone="violet"
                  delay={320}
                />
              </>
            )}
          </div>

          {/* Two-column lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent applications */}
            <div
              className="rounded-3xl p-6"
              style={{
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.6)",
                boxShadow: "0 8px 30px -12px rgba(20,83,45,0.15)",
                animation: "fadeSlideUp 0.6s ease both",
                animationDelay: "400ms",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="hostel-display text-lg font-semibold text-emerald-950 inline-flex items-center gap-2">
                  <FileText className="size-5 text-emerald-700" />
                  Recent applications
                </h3>
                <button
                  onClick={() => router.push("/hostel/admin/applications")}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 inline-flex items-center gap-1"
                >
                  View all <ArrowUpRight className="size-3" />
                </button>
              </div>
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skel key={i} className="h-14" />
                  ))}
                </div>
              ) : !stats?.recentApplications.length ? (
                <p className="text-sm text-emerald-900/50 py-10 text-center">
                  No applications yet
                </p>
              ) : (
                <div className="space-y-2">
                  {stats.recentApplications.map((a, i) => (
                    <div
                      key={a._id}
                      className="rounded-2xl bg-white/70 border border-white/70 p-3.5 flex items-center justify-between gap-3"
                      style={{
                        animation: "fadeSlideUp 0.5s ease both",
                        animationDelay: `${460 + i * 60}ms`,
                      }}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-emerald-950 truncate">
                          {a.studentName}
                        </p>
                        <p className="text-[11px] text-emerald-900/60 mt-0.5 capitalize font-mono">
                          {a.studentRegdNo} · {a.roomType} room
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {a.status === "pending" ? (
                          <>
                            <button
                              disabled={acting === a._id}
                              onClick={() => decideApp(a._id, "approved")}
                              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                            >
                              <CheckCircle2 className="size-3.5" /> Approve
                            </button>
                            <button
                              disabled={acting === a._id}
                              onClick={() => decideApp(a._id, "rejected")}
                              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full bg-white text-rose-700 border border-rose-200 hover:bg-rose-50 transition-colors disabled:opacity-50"
                            >
                              <XCircle className="size-3.5" /> Reject
                            </button>
                          </>
                        ) : (
                          <span
                            className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${statusChip(
                              a.status
                            )}`}
                          >
                            {a.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent complaints */}
            <div
              className="rounded-3xl p-6"
              style={{
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.6)",
                boxShadow: "0 8px 30px -12px rgba(20,83,45,0.15)",
                animation: "fadeSlideUp 0.6s ease both",
                animationDelay: "480ms",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="hostel-display text-lg font-semibold text-emerald-950 inline-flex items-center gap-2">
                  <MessageSquare className="size-5 text-emerald-700" />
                  Recent complaints
                </h3>
                <button
                  onClick={() => router.push("/hostel/admin/complaints")}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 inline-flex items-center gap-1"
                >
                  View all <ArrowUpRight className="size-3" />
                </button>
              </div>
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skel key={i} className="h-14" />
                  ))}
                </div>
              ) : !stats?.recentComplaints.length ? (
                <p className="text-sm text-emerald-900/50 py-10 text-center">
                  No complaints yet
                </p>
              ) : (
                <div className="space-y-2">
                  {stats.recentComplaints.map((c, i) => (
                    <div
                      key={c._id}
                      className="rounded-2xl bg-white/70 border border-white/70 p-3.5 flex items-center justify-between gap-3"
                      style={{
                        animation: "fadeSlideUp 0.5s ease both",
                        animationDelay: `${540 + i * 60}ms`,
                      }}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-emerald-950 truncate">
                          {c.studentName}
                        </p>
                        <p className="text-[11px] text-emerald-900/60 mt-0.5 capitalize">
                          {c.category}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border whitespace-nowrap ${statusChip(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div
            className="rounded-3xl p-6"
            style={{
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.6)",
              animation: "fadeSlideUp 0.6s ease both",
              animationDelay: "560ms",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="size-4 text-emerald-700" />
              <h3 className="hostel-display text-lg font-semibold text-emerald-950">
                Operations shortcuts
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Students", icon: Users, path: "/hostel/admin/students" },
                { label: "Stock", icon: Boxes, path: "/hostel/admin/stock" },
                { label: "Notifications", icon: Bell, path: "/hostel/admin/notifications" },
                { label: "Mess", icon: FileText, path: "/hostel/admin/mess" },
              ].map((q) => {
                const Icon = q.icon;
                return (
                  <button
                    key={q.label}
                    onClick={() => router.push(q.path)}
                    className="group rounded-2xl bg-white/80 hover:bg-white border border-white/60 hover:border-emerald-200 p-4 text-left transition-all hover:-translate-y-0.5"
                  >
                    <Icon className="size-5 text-emerald-700" />
                    <p className="text-sm font-semibold text-emerald-950 mt-3">
                      {q.label}
                    </p>
                    <ArrowUpRight className="size-4 text-emerald-400 mt-1 group-hover:text-emerald-700 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
