"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Users,
  ClipboardList,
  ArrowUpRight,
  Plus,
  FileText,
  Bell,
  Sparkles,
  GraduationCap,
} from "lucide-react";

interface Teacher {
  _id: string;
  name: { first: string; middle?: string; last: string };
  email: string;
  department: string;
  designation?: string;
  employeeId?: string;
}

interface StudentRow {
  _id: string;
  regdNo: string;
  branch: string;
  name: { first: string; middle?: string; last: string };
  cgpa: number | null;
  avgAttendance: number | null;
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
            style={{ fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif", color: "#0f172a" }}
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

export default function TeacherDashboard() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [noticesCount, setNoticesCount] = useState(0);
  const [testsCount, setTestsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch("/api/teacher/me");
        let dept = "";
        if (meRes.ok) {
          const data = await meRes.json();
          setTeacher(data.data);
          dept = data.data?.department ?? "";
        }
        const branchQ = dept ? `?branch=${encodeURIComponent(dept)}` : "";
        const [sRes, nRes, tRes] = await Promise.allSettled([
          fetch(`/api/dept/students${branchQ}`).then((r) => r.json()),
          fetch(`/api/dept/notices${branchQ}`).then((r) => r.json()),
          fetch(`/api/dept/tests${branchQ}`).then((r) => r.json()),
        ]);
        if (sRes.status === "fulfilled" && sRes.value.success) {
          setStudents(sRes.value.data ?? []);
        }
        if (nRes.status === "fulfilled" && nRes.value.success) {
          setNoticesCount((nRes.value.data ?? []).length);
        }
        if (tRes.status === "fulfilled" && tRes.value.success) {
          const upcoming = (tRes.value.data ?? []).filter(
            (t: { date: string }) => new Date(t.date) >= new Date()
          );
          setTestsCount(upcoming.length);
        }
      } catch {
        // graceful fall-through
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const fullName = teacher
    ? `${teacher.name?.first ?? ""} ${teacher.name?.last ?? ""}`.trim()
    : "";

  const today = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    []
  );

  const topStudents = students.slice(0, 5);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap');
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dept-root { font-family: 'DM Sans', sans-serif; }
        .dept-display { font-family: 'Sora', sans-serif; letter-spacing: -0.02em; }
      `}</style>

      <div className="dept-root min-h-full bg-[#fafbff] p-8">
        {/* Header */}
        <div className="mb-10" style={{ animation: "fadeSlideUp 0.5s ease both" }}>
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-600">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span className="uppercase tracking-[0.14em]">{today}</span>
          </div>
          {loading ? (
            <Skel className="h-10 w-72 mt-3" />
          ) : (
            <h1 className="dept-display mt-3 text-[2.4rem] leading-[1.05] font-semibold text-slate-900">
              {greeting()},{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
                {fullName || "Professor"}
              </span>
              <span className="text-slate-400">.</span>
            </h1>
          )}
          <p className="mt-2 text-sm text-slate-500">
            {teacher?.designation ?? "Faculty"}
            {teacher?.department ? ` · ${teacher.department} department` : ""}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <Skel key={i} className="h-32" />)
          ) : (
            <>
              <StatCard
                label="Students in dept"
                value={students.length}
                hue="#6366f1"
                accent="#4f46e5"
                icon={<Users className="size-4" />}
                caption={teacher?.department ?? "All branches"}
                delay={60}
              />
              <StatCard
                label="Notices posted"
                value={noticesCount}
                hue="#0ea5e9"
                accent="#0284c7"
                icon={<Bell className="size-4" />}
                caption="Visible to your branch"
                delay={140}
              />
              <StatCard
                label="Upcoming tests"
                value={testsCount}
                hue="#f59e0b"
                accent="#d97706"
                icon={<ClipboardList className="size-4" />}
                caption="Scheduled ahead"
                delay={220}
              />
            </>
          )}
        </div>

        {/* Two col: students + actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className="lg:col-span-2 rounded-2xl bg-white p-6"
            style={{
              border: "1px solid rgba(99,102,241,0.08)",
              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
              animation: "fadeSlideUp 0.6s ease both",
              animationDelay: "300ms",
            }}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="dept-display text-lg font-semibold text-slate-900">
                  Recent students
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Quick view of CGPA & attendance
                </p>
              </div>
              <button
                onClick={() => router.push("/dept/teacher/students")}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                View all <ArrowUpRight className="size-3" />
              </button>
            </div>

            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skel key={i} className="h-12" />
                ))}
              </div>
            ) : topStudents.length === 0 ? (
              <div className="py-12 text-center">
                <GraduationCap className="size-8 text-slate-300 mx-auto" />
                <p className="text-sm text-slate-400 mt-3">No students yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {topStudents.map((s, i) => {
                  const initials =
                    `${s.name.first?.[0] ?? ""}${s.name.last?.[0] ?? ""}`.toUpperCase();
                  return (
                    <div
                      key={s._id}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                      style={{
                        animation: "fadeSlideUp 0.5s ease both",
                        animationDelay: `${360 + i * 60}ms`,
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-xs font-semibold text-indigo-700">
                          {initials || "ST"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {s.name.first} {s.name.last}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {s.regdNo}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-right">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-400">
                            CGPA
                          </p>
                          <p className="text-sm font-semibold text-slate-900 mt-0.5">
                            {s.cgpa ?? "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-400">
                            Attd.
                          </p>
                          <p className="text-sm font-semibold text-slate-900 mt-0.5">
                            {s.avgAttendance != null ? `${s.avgAttendance}%` : "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div
            className="rounded-2xl bg-white p-6"
            style={{
              border: "1px solid rgba(99,102,241,0.08)",
              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
              animation: "fadeSlideUp 0.6s ease both",
              animationDelay: "380ms",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="size-4 text-indigo-500" />
              <h3 className="dept-display text-lg font-semibold text-slate-900">
                Quick actions
              </h3>
            </div>
            <div className="space-y-2">
              {[
                { label: "Post a notice", path: "/dept/teacher/notices", icon: Plus },
                { label: "Create test", path: "/dept/teacher/teacher_tests", icon: ClipboardList },
                { label: "Manage students", path: "/dept/teacher/students", icon: Users },
                { label: "Upload notes", path: "/dept/teacher/notes", icon: FileText },
                { label: "Browse courses", path: "/dept/teacher/department", icon: BookOpen },
              ].map((q) => {
                const Icon = q.icon;
                return (
                  <button
                    key={q.label}
                    onClick={() => router.push(q.path)}
                    className="w-full flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-left hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors group"
                  >
                    <span className="inline-flex items-center gap-2.5 text-sm font-medium text-slate-700">
                      <Icon className="size-4 text-indigo-500" />
                      {q.label}
                    </span>
                    <ArrowUpRight className="size-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
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
