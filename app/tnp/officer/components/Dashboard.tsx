"use client";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Users, TrendingUp, Award, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

// Demo recent activity log — useful for showcasing the dashboard
const recentActivities = [
  { action: "Student marked as placed", detail: "Rahul Kumar (2021CS045)", company: "Google", time: "2 hours ago" },
  { action: "New company added", detail: "Amazon Web Services", company: "", time: "4 hours ago" },
  { action: "Drive scheduled", detail: "Microsoft Campus Drive", company: "", time: "6 hours ago" },
  { action: "Student profile updated", detail: "Priya Sharma (2021EC089)", company: "", time: "1 day ago" },
];

type Student = { branch: string; status: string; package?: number; companyName?: string };

type BranchStat = { branch: string; placed: number; unplaced: number; ineligible: number };
type CompanyStat = { name: string; value: number };

export default function OfficerDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tnp/students")
      .then((r) => r.json())
      .then((d) => { if (d.success) setStudents(d.data ?? []); })
      .finally(() => setLoading(false));
  }, []);

  const total = students.length;
  const placed = students.filter((s) => s.status === "PLACED").length;
  const unplaced = students.filter((s) => s.status === "UNPLACED").length;
  const placementPct = total > 0 ? Math.round((placed / total) * 100) : 0;

  const branchMap: Record<string, BranchStat> = {};
  students.forEach((s) => {
    if (!branchMap[s.branch]) branchMap[s.branch] = { branch: s.branch, placed: 0, unplaced: 0, ineligible: 0 };
    if (s.status === "PLACED") branchMap[s.branch].placed++;
    else if (s.status === "INELIGIBLE") branchMap[s.branch].ineligible++;
    else branchMap[s.branch].unplaced++;
  });
  const branchWiseData = Object.values(branchMap).sort((a, b) => a.branch.localeCompare(b.branch));

  const companyMap: Record<string, number> = {};
  students.filter((s) => s.status === "PLACED" && s.companyName).forEach((s) => {
    companyMap[s.companyName!] = (companyMap[s.companyName!] || 0) + 1;
  });
  const sorted = Object.entries(companyMap).sort((a, b) => b[1] - a[1]);
  const top4 = sorted.slice(0, 4);
  const othersCount = sorted.slice(4).reduce((acc, [, v]) => acc + v, 0);
  const companyHiringData: CompanyStat[] = [
    ...top4.map(([name, value]) => ({ name, value })),
    ...(othersCount > 0 ? [{ name: "Others", value: othersCount }] : []),
  ];

  const stats = [
    { title: "Total Students", value: loading ? "…" : String(total), icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Students Placed", value: loading ? "…" : String(placed), icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { title: "Students Unplaced", value: loading ? "…" : String(unplaced), icon: Users, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "Placement %", value: loading ? "…" : `${placementPct}%`, icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Monitor placement statistics and activities</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Branch-wise Placement */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Branch-wise Placement Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] bg-gray-100 animate-pulse rounded-lg" />
            ) : branchWiseData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">No student data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={branchWiseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="branch" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="placed" fill="#4f46e5" name="Placed" />
                  <Bar dataKey="unplaced" fill="#f59e0b" name="Unplaced" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Company Hiring */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Company Hiring Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] bg-gray-100 animate-pulse rounded-lg" />
            ) : companyHiringData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">No placements recorded yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={companyHiringData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {companyHiringData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0">
                <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.detail}{activity.company && ` at ${activity.company}`}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Branch-wise Quick Stats Table */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Branch-wise Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />
          ) : branchWiseData.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">No student data yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    {["Branch", "Total", "Placed", "Unplaced", "Percentage"].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-sm font-medium text-gray-900">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {branchWiseData.map((b) => {
                    const tot = b.placed + b.unplaced + b.ineligible;
                    const pct = tot > 0 ? ((b.placed / tot) * 100).toFixed(1) : "0.0";
                    return (
                      <tr key={b.branch} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{b.branch}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{tot}</td>
                        <td className="py-3 px-4 text-sm text-green-600 font-medium">{b.placed}</td>
                        <td className="py-3 px-4 text-sm text-orange-600 font-medium">{b.unplaced}</td>
                        <td className="py-3 px-4 text-sm text-indigo-600 font-semibold">{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
