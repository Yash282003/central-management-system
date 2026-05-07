"use client";
import {
  Calendar,
  BookOpen,
  TrendingUp,
  Clock,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { statsData, notices, timetable } from "../../data/mockdata";
import { getDetails } from "@/services/student/me/getDetails";

interface Student {
  _id: string;
  regdNo: string;
  branch: string;
  mobile: string;
  email: string;
  dob: string;
  address: string;
  profileUrl: string;
  name: { first: string; middle: string; last: string };
}

function useCounter(target: number, duration = 1200) {
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
        setVal(Number(start.toFixed(target % 1 === 0 ? 0 : 2)));
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
  suffix?: string;
  decimals?: number;
  hue: string; // tailwind base hue for the stripe
  accent: string; // text accent
  icon: React.ReactNode;
  caption?: string;
  delay: number;
}

function StatCard({ label, value, suffix = "", decimals = 0, hue, accent, icon, caption, delay }: StatProps) {
  const count = useCounter(value);
  const display =
    decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toString();
  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-white p-6 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        border: "1px solid rgba(99,102,241,0.08)",
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        animation: "fadeSlideUp 0.6s ease both",
        animationDelay: `${delay}ms`,
      }}
    >
      {/* diagonal stripe pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rotate-12 opacity-[0.07]"
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
            {display}
            <span className="text-2xl text-slate-400 ml-0.5">{suffix}</span>
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

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 ${className}`}
    />
  );
}

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [openNotice, setOpenNotice] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getDetails();
        if (res?.success) setUser(res.data);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const stats = statsData.student;
  const todaySchedule = timetable[0].slots;
  const recentNotices = notices.slice(0, 3);

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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap');
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dept-root { font-family: 'DM Sans', sans-serif; }
        .dept-display { font-family: 'Sora', 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.02em; }
      `}</style>

      <div className="dept-root min-h-full bg-[#fafbff] p-8">
        {/* Hero */}
        <div
          className="mb-10"
          style={{ animation: "fadeSlideUp 0.5s ease both" }}
        >
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-600">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span className="uppercase tracking-[0.14em]">{today}</span>
          </div>
          <h1
            className="dept-display mt-3 text-[2.4rem] leading-[1.05] font-semibold text-slate-900"
          >
            {greeting()},{" "}
            {loading ? (
              <span className="inline-block h-8 w-44 align-middle rounded-md bg-gradient-to-r from-slate-200 to-slate-100 animate-pulse" />
            ) : (
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
                {user ? user.name.first : "Student"}
              </span>
            )}
            <span className="text-slate-400">.</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Here is a quiet snapshot of your semester
            {user?.branch ? ` — ${user.branch} department` : ""}.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-32" />
            ))
          ) : (
            <>
              <StatCard
                label="Current CGPA"
                value={stats.currentCGPA as number}
                decimals={2}
                hue="#6366f1"
                accent="#4f46e5"
                icon={<TrendingUp className="size-4" />}
                caption="Out of 10.00"
                delay={60}
              />
              <StatCard
                label="Avg Attendance"
                value={stats.averageAttendance as number}
                suffix="%"
                hue="#0ea5e9"
                accent="#0284c7"
                icon={<Calendar className="size-4" />}
                caption="Across all courses"
                delay={140}
              />
              <StatCard
                label="Total Courses"
                value={stats.totalCourses as number}
                hue="#8b5cf6"
                accent="#7c3aed"
                icon={<BookOpen className="size-4" />}
                caption="Enrolled this term"
                delay={220}
              />
              <StatCard
                label="Upcoming Tests"
                value={stats.upcomingTests as number}
                hue="#f59e0b"
                accent="#d97706"
                icon={<Clock className="size-4" />}
                caption="In the next 14 days"
                delay={300}
              />
            </>
          )}
        </div>

        {/* Notices strip + Quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div
            className="lg:col-span-2 rounded-2xl bg-white p-6"
            style={{
              border: "1px solid rgba(99,102,241,0.08)",
              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
              animation: "fadeSlideUp 0.6s ease both",
              animationDelay: "380ms",
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="dept-display text-lg font-semibold text-slate-900">
                Recent notices
              </h3>
              <button
                onClick={() => router.push("/dept/student/notices")}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                View all <ArrowUpRight className="size-3" />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {recentNotices.map((notice, i) => {
                const open = openNotice === i;
                const tone =
                  notice.priority === "high"
                    ? { bg: "bg-rose-50", text: "text-rose-700", dot: "#f43f5e" }
                    : notice.priority === "medium"
                    ? { bg: "bg-amber-50", text: "text-amber-700", dot: "#f59e0b" }
                    : { bg: "bg-emerald-50", text: "text-emerald-700", dot: "#10b981" };
                return (
                  <button
                    key={notice.id}
                    onClick={() => setOpenNotice(open ? null : i)}
                    className="w-full text-left py-3.5 first:pt-0 last:pb-0 group"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="mt-2 inline-block h-1.5 w-1.5 rounded-full flex-shrink-0"
                        style={{ background: tone.dot }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {notice.title}
                          </p>
                          <span
                            className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${tone.bg} ${tone.text}`}
                          >
                            {notice.priority}
                          </span>
                        </div>
                        <p
                          className={`text-xs text-slate-500 mt-1 transition-all ${
                            open ? "" : "line-clamp-1"
                          }`}
                        >
                          {notice.content}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1.5">
                          {notice.date}
                        </p>
                      </div>
                      <ChevronRight
                        className={`size-4 text-slate-300 mt-1 transition-transform ${
                          open ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div
            className="rounded-2xl bg-white p-6"
            style={{
              border: "1px solid rgba(99,102,241,0.08)",
              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
              animation: "fadeSlideUp 0.6s ease both",
              animationDelay: "460ms",
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
                { label: "View all grades", path: "/dept/student/grades" },
                { label: "Check attendance", path: "/dept/student/attendance" },
                { label: "Upcoming tests", path: "/dept/student/student_tests" },
                { label: "Department news", path: "/dept/student/department" },
              ].map((q, idx) => (
                <button
                  key={q.label}
                  onClick={() => router.push(q.path)}
                  className="w-full flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-left hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors group"
                >
                  <span className="text-sm font-medium text-slate-700">
                    {q.label}
                  </span>
                  <ArrowUpRight className="size-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div
          className="rounded-2xl bg-white p-6"
          style={{
            border: "1px solid rgba(99,102,241,0.08)",
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
            animation: "fadeSlideUp 0.6s ease both",
            animationDelay: "540ms",
          }}
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="dept-display text-lg font-semibold text-slate-900">
                Today&apos;s schedule
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                A timeline of your day
              </p>
            </div>
          </div>
          <div className="relative">
            <div
              aria-hidden
              className="absolute left-[6px] top-1 bottom-1 w-px bg-gradient-to-b from-indigo-200 via-indigo-100 to-transparent"
            />
            <div className="space-y-3">
              {todaySchedule.map((slot, idx) => (
                <div
                  key={idx}
                  className="relative pl-8"
                  style={{
                    animation: "fadeSlideUp 0.5s ease both",
                    animationDelay: `${600 + idx * 60}ms`,
                  }}
                >
                  <span
                    className={`absolute left-0 top-3 inline-block h-3 w-3 rounded-full ring-2 ring-white ${
                      slot.course === "Break"
                        ? "bg-slate-300"
                        : "bg-indigo-500"
                    }`}
                  />
                  <div
                    className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                      slot.course === "Break"
                        ? "bg-slate-50/60"
                        : "bg-indigo-50/40"
                    }`}
                  >
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                        {slot.time}
                      </p>
                      <p className="text-sm font-semibold text-slate-900 mt-1">
                        {slot.course}
                      </p>
                      {slot.course !== "Break" && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {slot.instructor} · {slot.room}
                        </p>
                      )}
                    </div>
                    {slot.course !== "Break" && (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-white text-indigo-700 border border-indigo-100">
                        In-person
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
