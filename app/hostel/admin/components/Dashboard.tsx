"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, FileText, AlertTriangle, Clock } from "lucide-react";

interface Stats {
  totalStudents: number;
  pendingApps: number;
  openComplaints: number;
  lowStock: number;
  recentApplications: { studentName: string; roomType: string; status: string; createdAt: string }[];
  recentComplaints: { studentName: string; category: string; status: string; createdAt: string }[];
}

const statusColor = (s: string) => {
  if (s === "pending" || s === "open") return "bg-amber-100 text-amber-700";
  if (s === "approved" || s === "resolved") return "bg-emerald-100 text-emerald-700";
  if (s === "rejected") return "bg-red-100 text-red-700";
  return "bg-blue-100 text-blue-700";
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hostel/admin/dashboard")
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: "Total Students", value: stats.totalStudents, icon: Users, color: "text-blue-600", bg: "from-blue-50 to-indigo-50" },
    { label: "Pending Applications", value: stats.pendingApps, icon: FileText, color: "text-amber-600", bg: "from-amber-50 to-orange-50" },
    { label: "Open Complaints", value: stats.openComplaints, icon: MessageSquare, color: "text-red-600", bg: "from-red-50 to-rose-50" },
    { label: "Low Stock Items", value: stats.lowStock, icon: AlertTriangle, color: "text-violet-600", bg: "from-violet-50 to-purple-50" },
  ] : [];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Hostel Dashboard</h1>
        <p className="text-gray-500 text-sm">Overview of hostel operations</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
          : statCards.map((s) => (
            <Card key={s.label} className={`rounded-2xl border-0 shadow-sm bg-gradient-to-br ${s.bg}`}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className={`text-xs font-medium ${s.color} mb-1`}>{s.label}</p>
                  <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                </div>
                <s.icon className={`size-8 ${s.color} opacity-60`} />
              </CardContent>
            </Card>
          ))
        }
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Clock className="size-4 text-gray-400" /> Recent Applications</h3>
            {loading ? <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-xl" />)}</div>
              : !stats?.recentApplications.length ? <p className="text-sm text-gray-400 text-center py-6">No applications yet</p>
              : stats.recentApplications.map((a, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{a.studentName}</p>
                    <p className="text-xs text-gray-400 capitalize">{a.roomType} room</p>
                  </div>
                  <Badge className={`text-xs capitalize ${statusColor(a.status)}`}>{a.status}</Badge>
                </div>
              ))}
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><MessageSquare className="size-4 text-gray-400" /> Recent Complaints</h3>
            {loading ? <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-xl" />)}</div>
              : !stats?.recentComplaints.length ? <p className="text-sm text-gray-400 text-center py-6">No complaints yet</p>
              : stats.recentComplaints.map((c, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{c.studentName}</p>
                    <p className="text-xs text-gray-400 capitalize">{c.category}</p>
                  </div>
                  <Badge className={`text-xs capitalize ${statusColor(c.status)}`}>{c.status}</Badge>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
