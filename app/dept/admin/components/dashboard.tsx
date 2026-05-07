"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  GraduationCap,
  BookOpen,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
    if (!target) { setVal(0); return; }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
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

  const recentNotices = notices.slice(0, 5);
  const totalCourses = courses.length;
  const branchData = data?.branchBreakdown ?? [];
  const maxBranchCount = Math.max(1, ...branchData.map((b) => b.count));

  const studentsCounted = useCounter(loading ? 0 : (data?.totalStudents ?? 0));
  const teachersCounted = useCounter(loading ? 0 : (data?.totalTeachers ?? 0));
  const coursesCounted = useCounter(loading ? 0 : totalCourses);
  const noticesCounted = useCounter(loading ? 0 : notices.length);

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
            <span>{adminName}</span>
          )}
        </h1>
        <p className="text-gray-500 text-sm">A live overview of the department.</p>
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
                <p className="text-xs font-medium text-blue-600 mb-1">TOTAL STUDENTS</p>
                <p className="text-3xl font-bold text-blue-700">{studentsCounted}</p>
                <p className="text-xs text-blue-500 mt-1">across all branches</p>
              </CardContent>
            </Card>
            <Card
              className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50 hover:-translate-y-0.5 transition-all"
              style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "120ms" }}
            >
              <CardContent className="p-5">
                <p className="text-xs font-medium text-emerald-600 mb-1">TOTAL FACULTY</p>
                <p className="text-3xl font-bold text-emerald-700">{teachersCounted}</p>
                <p className="text-xs text-emerald-500 mt-1">active teachers</p>
              </CardContent>
            </Card>
            <Card
              className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-violet-50 to-purple-50 hover:-translate-y-0.5 transition-all"
              style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "180ms" }}
            >
              <CardContent className="p-5">
                <p className="text-xs font-medium text-violet-600 mb-1">ACTIVE COURSES</p>
                <p className="text-3xl font-bold text-violet-700">{coursesCounted}</p>
                <p className="text-xs text-violet-500 mt-1">live this term</p>
              </CardContent>
            </Card>
            <Card
              className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50 hover:-translate-y-0.5 transition-all"
              style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "240ms" }}
            >
              <CardContent className="p-5">
                <p className="text-xs font-medium text-amber-600 mb-1">NOTICES LIVE</p>
                <p className="text-3xl font-bold text-amber-700">{noticesCounted}</p>
                <p className="text-xs text-amber-500 mt-1">across the dept</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Branch breakdown */}
      <Card
        className="rounded-2xl border-0 shadow-sm mb-6"
        style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "300ms" }}
      >
        <CardContent className="p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">Students by Branch</h2>
            <p className="text-xs text-gray-500 mt-0.5">Department distribution</p>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-7 rounded-xl" />
              ))}
            </div>
          ) : branchData.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No branch data yet</p>
          ) : (
            <div className="space-y-4">
              {branchData.map((b, i) => {
                const pct = (b.count / maxBranchCount) * 100;
                return (
                  <div key={b._id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-700">{b._id || "Unassigned"}</span>
                      <span className="text-xs font-mono text-gray-500">{b.count}</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="absolute inset-y-0 left-0 origin-left rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"
                        style={{
                          width: `${pct}%`,
                          animation: "growBar 0.9s cubic-bezier(0.4,0,0.2,1) both",
                          animationDelay: `${360 + i * 80}ms`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two-column: notices + courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card
          className="rounded-2xl border-0 shadow-sm"
          style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "380ms" }}
        >
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Notices</h2>
              <button
                onClick={() => router.push("/dept/admin/notices")}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                Manage <ArrowUpRight className="size-3" />
              </button>
            </div>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded-xl" />
                ))}
              </div>
            ) : recentNotices.length === 0 ? (
              <p className="text-sm text-gray-400 py-8 text-center">No notices yet</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentNotices.map((n) => (
                  <div
                    key={n._id}
                    className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {n.authorName} · {n.authorRole} · {new Date(n.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {n.priority && (
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${priorityBadge(n.priority)}`}>
                        {n.priority}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card
          className="rounded-2xl border-0 shadow-sm"
          style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "460ms" }}
        >
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Courses</h2>
              <button
                onClick={() => router.push("/dept/admin/courses")}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                Manage <ArrowUpRight className="size-3" />
              </button>
            </div>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded-xl" />
                ))}
              </div>
            ) : courses.length === 0 ? (
              <p className="text-sm text-gray-400 py-8 text-center">No courses yet</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {courses.slice(0, 5).map((c) => (
                  <div
                    key={c._id}
                    className="py-3 first:pt-0 last:pb-0 flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                      <p className="text-[11px] text-gray-400 font-mono mt-0.5">{c.code}</p>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      {c.branch} · Sem {c.semester}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions footer */}
      <Card
        className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-blue-50/50 to-indigo-50/30"
        style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "540ms" }}
      >
        <CardContent className="p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Quick Admin Actions</h2>
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
                className="rounded-xl bg-white border border-gray-100 px-4 py-3 text-left hover:border-blue-200 hover:shadow-sm transition-all group"
              >
                <span className="text-sm font-medium text-gray-700 inline-flex items-center justify-between w-full">
                  {q.label}
                  <ArrowUpRight className="size-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes growBar {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
