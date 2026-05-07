"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  MessageSquare,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Users,
  Utensils,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Notification {
  title: string;
  message: string;
  priority: string;
  sentBy: string;
  createdAt: string;
}
interface Complaint {
  _id: string;
  category: string;
  status: string;
  createdAt: string;
}
interface Application {
  _id: string;
  roomType: string;
  status: string;
  createdAt: string;
}
interface StudentMe {
  name?: string;
  regd?: string;
  hostel?: string;
  room?: string;
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
  if (p === "urgent") return "bg-rose-100 text-rose-700";
  if (p === "important") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
};

export default function HostelStudentDashboard() {
  const router = useRouter();
  const [me, setMe] = useState<StudentMe | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const [meRes, notifRes, compRes, appRes] = await Promise.allSettled([
          fetch("/api/student/hostel").then((r) => r.json()),
          fetch("/api/hostel/student/notifications").then((r) => r.json()),
          fetch("/api/hostel/student/complaints").then((r) => r.json()),
          fetch("/api/hostel/student/applications").then((r) => r.json()),
        ]);
        if (meRes.status === "fulfilled") setMe(meRes.value ?? null);
        if (notifRes.status === "fulfilled")
          setNotifications(Array.isArray(notifRes.value.data) ? notifRes.value.data : []);
        if (compRes.status === "fulfilled")
          setComplaints(Array.isArray(compRes.value.data) ? compRes.value.data : []);
        if (appRes.status === "fulfilled")
          setApplications(Array.isArray(appRes.value.data) ? appRes.value.data : []);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const activeComplaints = complaints.filter((c) => c.status !== "resolved").length;
  const pendingApplications = applications.filter((a) => a.status === "pending").length;
  const recentNotifications = notifications.slice(0, 3);

  const complaintsCounted = useCounter(loading ? 0 : activeComplaints);
  const appsCounted = useCounter(loading ? 0 : pendingApplications);
  const notifCounted = useCounter(loading ? 0 : notifications.length);

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
            <span>{me?.name || "Student"}</span>
          )}
        </h1>
        <p className="text-gray-500 text-sm">Welcome home. Here is what is happening at the hostel today.</p>
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
              className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50 hover:-translate-y-0.5 transition-all"
              style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "60ms" }}
            >
              <CardContent className="p-5">
                <p className="text-xs font-medium text-emerald-600 mb-1">ACTIVE COMPLAINTS</p>
                <p className="text-3xl font-bold text-emerald-700">{complaintsCounted}</p>
                <p className="text-xs text-emerald-500 mt-1">
                  {activeComplaints === 0 ? "All clear" : "Awaiting resolution"}
                </p>
              </CardContent>
            </Card>
            <Card
              className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 hover:-translate-y-0.5 transition-all"
              style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "120ms" }}
            >
              <CardContent className="p-5">
                <p className="text-xs font-medium text-green-600 mb-1">PENDING APPLICATIONS</p>
                <p className="text-3xl font-bold text-green-700">{appsCounted}</p>
                <p className="text-xs text-green-500 mt-1">
                  {pendingApplications === 0 ? "Nothing pending" : "Under review"}
                </p>
              </CardContent>
            </Card>
            <Card
              className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-teal-50 to-cyan-50 hover:-translate-y-0.5 transition-all"
              style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "180ms" }}
            >
              <CardContent className="p-5">
                <p className="text-xs font-medium text-teal-600 mb-1">NOTIFICATIONS</p>
                <p className="text-3xl font-bold text-teal-700">{notifCounted}</p>
                <p className="text-xs text-teal-500 mt-1">from the hostel office</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Recent notifications */}
      <Card
        className="rounded-2xl border-0 shadow-sm mb-6"
        style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "240ms" }}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Updates</h2>
            <button
              onClick={() => router.push("/hostel/student/notifications")}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
            >
              View all <ArrowUpRight className="size-3" />
            </button>
          </div>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : recentNotifications.length === 0 ? (
            <div className="py-10 text-center">
              <CheckCircle2 className="size-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No notifications yet</p>
              <p className="text-xs text-gray-400 mt-1">Calm and quiet on the hostel front.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentNotifications.map((n, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl bg-gray-50 p-4"
                  style={{
                    animation: "fadeSlideUp 0.5s ease both",
                    animationDelay: `${300 + i * 60}ms`,
                  }}
                >
                  <div className="size-9 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Bell className="size-4 text-emerald-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-gray-900">{n.title}</p>
                      <Badge className={`text-[10px] uppercase ${priorityBadge(n.priority)}`}>
                        {n.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{n.message}</p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleDateString()} · {n.sentBy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick links */}
      <Card
        className="rounded-2xl border-0 shadow-sm"
        style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "380ms" }}
      >
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "File Complaint", icon: MessageSquare, path: "/hostel/student/complaints" },
              { label: "Apply for Room", icon: FileText, path: "/hostel/student/applications" },
              { label: "View Mess Menu", icon: Utensils, path: "/hostel/student/mess" },
              { label: "Notifications", icon: Bell, path: "/hostel/student/notifications" },
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
