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
  GraduationCap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
        if (sRes.status === "fulfilled" && sRes.value.success)
          setStudents(sRes.value.data ?? []);
        if (nRes.status === "fulfilled" && nRes.value.success)
          setNoticesCount((nRes.value.data ?? []).length);
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

  const topStudents = students.slice(0, 5);

  const studentsCount = useCounter(loading ? 0 : students.length);
  const noticesCounted = useCounter(loading ? 0 : noticesCount);
  const testsCounted = useCounter(loading ? 0 : testsCount);

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
            <span>{fullName || "Professor"}</span>
          )}
        </h1>
        <p className="text-gray-500 text-sm">
          {teacher?.designation ?? "Faculty"}
          {teacher?.department ? ` · ${teacher.department} department` : ""}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))
        ) : (
          <>
            <Card
              className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 hover:-translate-y-0.5 transition-all"
              style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "60ms" }}
            >
              <CardContent className="p-5">
                <p className="text-xs font-medium text-blue-600 mb-1">STUDENTS IN DEPT</p>
                <p className="text-3xl font-bold text-blue-700">{studentsCount}</p>
                <p className="text-xs text-blue-500 mt-1">{teacher?.department ?? "all branches"}</p>
              </CardContent>
            </Card>
            <Card
              className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50 hover:-translate-y-0.5 transition-all"
              style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "120ms" }}
            >
              <CardContent className="p-5">
                <p className="text-xs font-medium text-emerald-600 mb-1">NOTICES POSTED</p>
                <p className="text-3xl font-bold text-emerald-700">{noticesCounted}</p>
                <p className="text-xs text-emerald-500 mt-1">visible to your branch</p>
              </CardContent>
            </Card>
            <Card
              className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-violet-50 to-purple-50 hover:-translate-y-0.5 transition-all"
              style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "180ms" }}
            >
              <CardContent className="p-5">
                <p className="text-xs font-medium text-violet-600 mb-1">UPCOMING TESTS</p>
                <p className="text-3xl font-bold text-violet-700">{testsCounted}</p>
                <p className="text-xs text-violet-500 mt-1">scheduled ahead</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Students table + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          className="lg:col-span-2 rounded-2xl border-0 shadow-sm"
          style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "240ms" }}
        >
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Students</h2>
                <p className="text-xs text-gray-500 mt-0.5">Quick view of CGPA & attendance</p>
              </div>
              <button
                onClick={() => router.push("/dept/teacher/students")}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                View all <ArrowUpRight className="size-3" />
              </button>
            </div>

            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded-xl" />
                ))}
              </div>
            ) : topStudents.length === 0 ? (
              <div className="py-12 text-center">
                <GraduationCap className="size-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No students yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {topStudents.map((s, i) => {
                  const initials =
                    `${s.name.first?.[0] ?? ""}${s.name.last?.[0] ?? ""}`.toUpperCase();
                  return (
                    <div
                      key={s._id}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                      style={{
                        animation: "fadeSlideUp 0.5s ease both",
                        animationDelay: `${300 + i * 50}ms`,
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xs font-semibold text-blue-700">
                          {initials || "ST"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {s.name.first} {s.name.last}
                          </p>
                          <p className="text-[11px] text-gray-400 font-mono">{s.regdNo}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-right">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-400">CGPA</p>
                          <p className="text-sm font-semibold text-gray-900 mt-0.5">{s.cgpa ?? "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-400">Attd.</p>
                          <p className="text-sm font-semibold text-gray-900 mt-0.5">
                            {s.avgAttendance != null ? `${s.avgAttendance}%` : "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card
          className="rounded-2xl border-0 shadow-sm"
          style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "320ms" }}
        >
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
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
