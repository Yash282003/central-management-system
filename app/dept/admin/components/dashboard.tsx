"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  GraduationCap,
  BookOpen,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

interface Admin {
  _id: string;
  name?: { first?: string; last?: string };
  email?: string;
  designation?: string;
}

interface BranchEntry {
  _id: string;
  count: number;
}

interface DashData {
  totalStudents: number;
  totalTeachers: number;
  branchBreakdown: BranchEntry[];
  departmentBreakdown: BranchEntry[];
}

interface NoticeRow {
  _id: string;
  title: string;
  authorName: string;
  authorRole: string;
  priority?: string;
  createdAt: string;
}

interface CourseRow {
  _id: string;
  name: string;
  code: string;
  branch: string;
  semester: number;
}

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
      } else {
        setVal(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return val;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

interface StatProps {
  label: string;
  value: number;
  hue: string;
  accent: string;
  icon: React.ReactNode;
  caption?: string;
  delay: number;
}

function StatCard({ label, value, hue, accent, icon, caption, delay }: StatProps) {
  const count = useCounter(value);
  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
      style={{
        border: "1px solid rgba(99,102,241,0.08)",
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        animation: "fadeSlideUp 0.6s ease both",
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rotate-12 opacity-[0.07]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${hue} 0 2px, transparent 2px 10px)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, transparent, ${hue}, transparent)` }}
      />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 font-medium">
            {label}
          </p>
          <p
            className="mt-3 text-4xl font-semibold tracking-tight"
            style={{ fontFamily: "'Sora', sans-serif", color: "#0f172a" }}
          >
            {count}
          </p>
          {caption && <p className="mt-1 text-xs text-slate-400">{caption}</p>}
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: `${hue}14`, color: accent }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function Skel({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 ${className}`}
    />
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [data, setData] = useState<DashData | null>(null);
  const [notices, setNotices] = useState<NoticeRow[]>([]);
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [meRes, dashRes, noticeRes, coursesRes] = await Promise.allSettled([
          fetch("/api/admin/me").then((r) => r.json()),
          fetch("/api/admin/dashboard").then((r) => r.json()),
          fetch("/api/dept/notices").then((r) => r.json()),
          fetch("/api/dept/courses").then((r) => r.json()),
        ]);
        if (meRes.status === "fulfilled" && meRes.value.success)
          setAdmin(meRes.value.data);
        if (dashRes.status === "fulfilled" && dashRes.value.success)
          setData(dashRes.value.data);
        if (noticeRes.status === "fulfilled" && noticeRes.value.success)
          setNotices(noticeRes.value.data ?? []);
        if (coursesRes.status === "fulfilled" && coursesRes.value.success)
          setCourses(coursesRes.value.data ?? []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const adminName =
    admin?.name?.first || admin?.name?.last
      ? `${admin?.name?.first ?? ""} ${admin?.name?.last ?? ""}`.trim()
      : admin?.email?.split("@")[0] ?? "Administrator";

  const today = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    []
  );

  const recentNotices = notices.slice(0, 5);
  const totalCourses = courses.length;
  const branchData = data?.branchBreakdown ?? [];
  const maxBranchCount = Math.max(1, ...branchData.map((b) => b.count));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap');
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes growBar {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .dept-root { font-family: 'DM Sans', sans-serif; }
        .dept-display { font-family: 'Sora', sans-serif; letter-spacing: -0.02em; }
      `}</style>

      <div className="dept-root min-h-full bg-[#fafbff] p-8">
        {/* Header */}
        <div className="mb-10" style={{ animation: "fadeSlideUp 0.5s ease both" }}>
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-600">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span className="uppercase tracking-[0.14em]">{today} · Admin console</span>
          </div>
          {loading ? (
            <Skel className="h-10 w-72 mt-3" />
          ) : (
            <h1 className="dept-display mt-3 text-[2.4rem] leading-[1.05] font-semibold text-slate-900">
              {greeting()},{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
                {adminName}
              </span>
              <span className="text-slate-400">.</span>
            </h1>
          )}
          <p className="mt-2 text-sm text-slate-500">
            A live overview of the department.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skel key={i} className="h-32" />)
          ) : (
            <>
              <StatCard
                label="Total Students"
                value={data?.totalStudents ?? 0}
                hue="#6366f1"
                accent="#4f46e5"
                icon={<GraduationCap className="size-4" />}
                caption="Across all branches"
                delay={60}
              />
              <StatCard
                label="Total Teachers"
                value={data?.totalTeachers ?? 0}
                hue="#0ea5e9"
                accent="#0284c7"
                icon={<Users className="size-4" />}
                caption="Active faculty"
                delay={140}
              />
              <StatCard
                label="Active Courses"
                value={totalCourses}
                hue="#8b5cf6"
                accent="#7c3aed"
                icon={<BookOpen className="size-4" />}
                caption="Live this term"
                delay={220}
              />
              <StatCard
                label="Notices Live"
                value={notices.length}
                hue="#f59e0b"
                accent="#d97706"
                icon={<AlertCircle className="size-4" />}
                caption="Across the dept"
                delay={300}
              />
            </>
          )}
        </div>

        {/* Branch breakdown */}
        <div
          className="rounded-2xl bg-white p-6 mb-6"
          style={{
            border: "1px solid rgba(99,102,241,0.08)",
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
            animation: "fadeSlideUp 0.6s ease both",
            animationDelay: "360ms",
          }}
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="dept-display text-lg font-semibold text-slate-900">
                Students by branch
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Department distribution
              </p>
            </div>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skel key={i} className="h-7" />
              ))}
            </div>
          ) : branchData.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">No branch data yet</p>
          ) : (
            <div className="space-y-4">
              {branchData.map((b, i) => {
                const pct = (b.count / maxBranchCount) * 100;
                return (
                  <div key={b._id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700">
                        {b._id || "Unassigned"}
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        {b.count}
                      </span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="absolute inset-y-0 left-0 origin-left rounded-full"
                        style={{
                          width: `${pct}%`,
                          background:
                            "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
                          animation: "growBar 0.9s cubic-bezier(0.4,0,0.2,1) both",
                          animationDelay: `${420 + i * 80}ms`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Two col: notices + courses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            className="rounded-2xl bg-white p-6"
            style={{
              border: "1px solid rgba(99,102,241,0.08)",
              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
              animation: "fadeSlideUp 0.6s ease both",
              animationDelay: "440ms",
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="dept-display text-lg font-semibold text-slate-900">
                Recent notices
              </h3>
              <button
                onClick={() => router.push("/dept/admin/notices")}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                Manage <ArrowUpRight className="size-3" />
              </button>
            </div>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skel key={i} className="h-12" />
                ))}
              </div>
            ) : recentNotices.length === 0 ? (
              <p className="text-sm text-slate-400 py-8 text-center">No notices yet</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentNotices.map((n) => (
                  <div
                    key={n._id}
                    className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {n.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {n.authorName} · {n.authorRole} ·{" "}
                        {new Date(n.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {n.priority && (
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          n.priority === "high"
                            ? "bg-rose-50 text-rose-700"
                            : n.priority === "medium"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {n.priority}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className="rounded-2xl bg-white p-6"
            style={{
              border: "1px solid rgba(99,102,241,0.08)",
              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
              animation: "fadeSlideUp 0.6s ease both",
              animationDelay: "520ms",
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="dept-display text-lg font-semibold text-slate-900">
                Recent courses
              </h3>
              <button
                onClick={() => router.push("/dept/admin/courses")}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                Manage <ArrowUpRight className="size-3" />
              </button>
            </div>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skel key={i} className="h-12" />
                ))}
              </div>
            ) : courses.length === 0 ? (
              <p className="text-sm text-slate-400 py-8 text-center">No courses yet</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {courses.slice(0, 5).map((c) => (
                  <div
                    key={c._id}
                    className="py-3 first:pt-0 last:pb-0 flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {c.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {c.code}
                      </p>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      {c.branch} · Sem {c.semester}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions footer */}
        <div
          className="mt-6 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-blue-50/30 p-5"
          style={{
            border: "1px solid rgba(99,102,241,0.12)",
            animation: "fadeSlideUp 0.6s ease both",
            animationDelay: "600ms",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="size-4 text-indigo-500" />
            <h3 className="dept-display text-base font-semibold text-slate-900">
              Quick admin actions
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: "Manage students", path: "/dept/admin/students" },
              { label: "Manage members", path: "/dept/admin/members" },
              { label: "Courses", path: "/dept/admin/courses" },
              { label: "Publications", path: "/dept/admin/publications" },
            ].map((q) => (
              <button
                key={q.path}
                onClick={() => router.push(q.path)}
                className="rounded-xl bg-white border border-slate-100 px-4 py-3 text-left hover:border-indigo-200 hover:shadow-sm transition-all group"
              >
                <span className="text-sm font-medium text-slate-700 inline-flex items-center justify-between w-full">
                  {q.label}
                  <ArrowUpRight className="size-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
