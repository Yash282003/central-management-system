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
  Bell,
  Boxes,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

const statusChip = (s: string) => {
  if (s === "pending" || s === "open") return "bg-amber-100 text-amber-800";
  if (s === "approved" || s === "resolved") return "bg-emerald-100 text-emerald-800";
  if (s === "rejected") return "bg-rose-100 text-rose-700";
  return "bg-sky-100 text-sky-800";
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

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

  const reload = async () => {
    const r = await fetch("/api/hostel/admin/dashboard");
    const d = await r.json();
    if (d.success) setStats(d.data);
  };

  useEffect(() => {
    reload().finally(() => setLoading(false));
  }, []);

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

  const studentsCounted = useCounter(loading ? 0 : (stats?.totalStudents ?? 0));
  const appsCounted = useCounter(loading ? 0 : (stats?.pendingApps ?? 0));
  const complaintsCounted = useCounter(loading ? 0 : (stats?.openComplaints ?? 0));
  const stockCounted = useCounter(loading ? 0 : (stats?.lowStock ?? 0));

  return (
    <div className="p-8">
      {/* Header */}
      <div
        className="mb-8"
        style={{ animation: "fadeSlideUp 0.4s ease both" }}
      >
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Hostel Management</h1>
        <p className="text-gray-500 text-sm">{today} · live operations overview</p>
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
              className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50 hover:-translate-y-0.5 transition-all"
              style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "60ms" }}
            >
              <CardContent className="p-5">
                <p className="text-xs font-medium text-emerald-600 mb-1">TOTAL STUDENTS</p>
                <p className="text-3xl font-bold text-emerald-700">{studentsCounted}</p>
                <p className="text-xs text-emerald-500 mt-1">across all hostels</p>
              </CardContent>
            </Card>
            <Card
              className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50 hover:-translate-y-0.5 transition-all"
              style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "120ms" }}
            >
              <CardContent className="p-5">
                <p className="text-xs font-medium text-amber-600 mb-1">PENDING APPLICATIONS</p>
                <p className="text-3xl font-bold text-amber-700">{appsCounted}</p>
                <p className="text-xs text-amber-500 mt-1">awaiting your decision</p>
              </CardContent>
            </Card>
            <Card
              className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-rose-50 to-red-50 hover:-translate-y-0.5 transition-all"
              style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "180ms" }}
            >
              <CardContent className="p-5">
                <p className="text-xs font-medium text-rose-600 mb-1">OPEN COMPLAINTS</p>
                <p className="text-3xl font-bold text-rose-700">{complaintsCounted}</p>
                <p className="text-xs text-rose-500 mt-1">in progress or new</p>
              </CardContent>
            </Card>
            <Card
              className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-violet-50 to-purple-50 hover:-translate-y-0.5 transition-all"
              style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "240ms" }}
            >
              <CardContent className="p-5">
                <p className="text-xs font-medium text-violet-600 mb-1">LOW STOCK ITEMS</p>
                <p className="text-3xl font-bold text-violet-700">{stockCounted}</p>
                <p className="text-xs text-violet-500 mt-1">at or below threshold</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Two-column lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent applications */}
        <Card
          className="rounded-2xl border-0 shadow-sm"
          style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "300ms" }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
              <button
                onClick={() => router.push("/hostel/admin/applications")}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
              >
                View all <ArrowUpRight className="size-3" />
              </button>
            </div>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 rounded-xl" />
                ))}
              </div>
            ) : !stats?.recentApplications.length ? (
              <p className="text-sm text-gray-400 py-10 text-center">No applications yet</p>
            ) : (
              <div className="space-y-2">
                {stats.recentApplications.map((a, i) => (
                  <div
                    key={a._id}
                    className="rounded-xl bg-gray-50 p-3.5 flex items-center justify-between gap-3"
                    style={{
                      animation: "fadeSlideUp 0.5s ease both",
                      animationDelay: `${360 + i * 60}ms`,
                    }}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{a.studentName}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5 font-mono capitalize">
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
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${statusChip(a.status)}`}>
                          {a.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent complaints */}
        <Card
          className="rounded-2xl border-0 shadow-sm"
          style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "380ms" }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Complaints</h2>
              <button
                onClick={() => router.push("/hostel/admin/complaints")}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
              >
                View all <ArrowUpRight className="size-3" />
              </button>
            </div>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 rounded-xl" />
                ))}
              </div>
            ) : !stats?.recentComplaints.length ? (
              <p className="text-sm text-gray-400 py-10 text-center">No complaints yet</p>
            ) : (
              <div className="space-y-2">
                {stats.recentComplaints.map((c, i) => (
                  <div
                    key={c._id}
                    className="rounded-xl bg-gray-50 p-3.5 flex items-center justify-between gap-3"
                    style={{
                      animation: "fadeSlideUp 0.5s ease both",
                      animationDelay: `${440 + i * 60}ms`,
                    }}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{c.studentName}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5 capitalize">{c.category}</p>
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full whitespace-nowrap ${statusChip(c.status)}`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick links */}
      <Card
        className="rounded-2xl border-0 shadow-sm"
        style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "460ms" }}
      >
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Operations Shortcuts</h2>
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
                  className="group rounded-xl border border-gray-100 bg-white p-4 text-left hover:border-emerald-200 hover:bg-emerald-50/40 transition-all hover:-translate-y-0.5"
                >
                  <Icon className="size-5 text-emerald-600" />
                  <p className="text-sm font-medium text-gray-700 mt-3">{q.label}</p>
                  <ArrowUpRight className="size-4 text-gray-300 mt-1 group-hover:text-emerald-600 transition-colors" />
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
