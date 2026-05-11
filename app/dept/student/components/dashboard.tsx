"use client";
import {
  Calendar,
  BookOpen,
  TrendingUp,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ChevronRight,
  Bell,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getDetails } from "@/services/student/me/getDetails";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Student {
  _id: string;
  regdNo: string;
  branch: string;
  mobile: string;
  email: string;
  dob: string;
  address: string;
  profileUrl: string;
  cgpa?: number;
  name: { first: string; middle: string; last: string };
}

function useCounter(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) { setVal(0); return; }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Number(start.toFixed(target % 1 === 0 ? 0 : 2)));
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

const priorityBadge = (p: string) => {
  if (p === "high") return "bg-rose-100 text-rose-700";
  if (p === "medium") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
};

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [openNotice, setOpenNotice] = useState<number | null>(null);
  const [recentNotices, setRecentNotices] = useState<any[]>([]);

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

    fetch("/api/dept/notices", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { if (d.success) setRecentNotices((d.data ?? []).slice(0, 3)); })
      .catch(() => {});
  }, []);

  const cgpaCount = useCounter(loading ? 0 : (user?.cgpa ?? 0));

  return (
    <div className="p-8">
      {/* Header */}
      <div
        className="mb-8"
        style={{ animation: "fadeSlideUp 0.4s ease both" }}
      >
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          {greeting()},{" "}
          {loading ? (
            <Skeleton className="inline-block h-7 w-36 align-middle" />
          ) : (
            <span>{user ? user.name.first : "Student"}</span>
          )}
        </h1>
        <p className="text-gray-500 text-sm">
          Here is a snapshot of your semester
          {user?.branch ? ` — ${user.branch} department` : ""}.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))
        ) : (
          <>
            <Card
              className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 hover:-translate-y-0.5 transition-all"
              style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "60ms" }}
            >
              <CardContent className="p-5">
                <p className="text-xs font-medium text-blue-600 mb-1">CURRENT CGPA</p>
                {user?.cgpa != null ? (
                  <>
                    <p className="text-3xl font-bold text-blue-700">{cgpaCount.toFixed(2)}</p>
                    <p className="text-xs text-blue-500 mt-1">out of 10.0</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-semibold text-blue-700/80 leading-tight">Grades coming soon</p>
                    <p className="text-xs text-blue-500 mt-1.5">Your teacher will publish them shortly.</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card
              className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50 hover:-translate-y-0.5 transition-all"
              style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "120ms" }}
            >
              <CardContent className="p-5">
                <p className="text-xs font-medium text-emerald-600 mb-1">AVG ATTENDANCE</p>
                <p className="text-3xl font-bold text-emerald-700">—</p>
                <p className="text-xs text-emerald-500 mt-1">across all courses</p>
              </CardContent>
            </Card>
            <Card
              className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-violet-50 to-purple-50 hover:-translate-y-0.5 transition-all"
              style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "180ms" }}
            >
              <CardContent className="p-5">
                <p className="text-xs font-medium text-violet-600 mb-1">TOTAL COURSES</p>
                <p className="text-3xl font-bold text-violet-700">—</p>
                <p className="text-xs text-violet-500 mt-1">enrolled this term</p>
              </CardContent>
            </Card>
            <Card
              className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50 hover:-translate-y-0.5 transition-all"
              style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "240ms" }}
            >
              <CardContent className="p-5">
                <p className="text-xs font-medium text-amber-600 mb-1">UPCOMING TESTS</p>
                <p className="text-3xl font-bold text-amber-700">—</p>
                <p className="text-xs text-amber-500 mt-1">in the next 14 days</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Notices + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card
          className="lg:col-span-2 rounded-2xl border-0 shadow-sm"
          style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "300ms" }}
        >
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Notices</h2>
              <button
                onClick={() => router.push("/dept/student/notices")}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                View all <ArrowUpRight className="size-3" />
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {recentNotices.map((notice, i) => {
                const open = openNotice === i;
                return (
                  <button
                    key={notice.id}
                    onClick={() => setOpenNotice(open ? null : i)}
                    className="w-full text-left py-3.5 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <Bell className="size-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notice.title}
                          </p>
                          <Badge className={`text-[10px] uppercase ${priorityBadge(notice.priority)}`}>
                            {notice.priority}
                          </Badge>
                        </div>
                        <p className={`text-xs text-gray-500 mt-1 ${open ? "" : "line-clamp-1"}`}>
                          {notice.content}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">
                          {new Date(notice.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <ChevronRight
                        className={`size-4 text-gray-300 mt-0.5 transition-transform ${open ? "rotate-90" : ""}`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card
          className="rounded-2xl border-0 shadow-sm"
          style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "380ms" }}
        >
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: "View all grades", path: "/dept/student/grades", icon: TrendingUp },
                { label: "Check attendance", path: "/dept/student/attendance", icon: Calendar },
                { label: "Upcoming tests", path: "/dept/student/student_tests", icon: Clock },
                { label: "Department news", path: "/dept/student/department", icon: BookOpen },
              ].map((q) => {
                const Icon = q.icon;
                return (
                  <button
                    key={q.label}
                    onClick={() => router.push(q.path)}
                    className="w-full flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 text-left hover:border-blue-200 hover:bg-blue-50/40 transition-colors group"
                  >
                    <span className="inline-flex items-center gap-2.5 text-sm font-medium text-gray-700">
                      <Icon className="size-4 text-blue-500" />
                      {q.label}
                    </span>
                    <ArrowUpRight className="size-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
