"use client";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Users, TrendingUp, Award, Building2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Historical demo data — useful for showcasing trends
const yearlyPlacementData = [
  { year: "2020", percentage: 78, avgPackage: 6.2 },
  { year: "2021", percentage: 82, avgPackage: 6.8 },
  { year: "2022", percentage: 86, avgPackage: 7.3 },
  { year: "2023", percentage: 89, avgPackage: 7.9 },
  { year: "2024", percentage: 92, avgPackage: 8.5 },
];

const packageTrends = [
  { year: "2020", min: 3.5, avg: 6.2, max: 18 },
  { year: "2021", min: 3.8, avg: 6.8, max: 22 },
  { year: "2022", min: 4.2, avg: 7.3, max: 24 },
  { year: "2023", min: 4.5, avg: 7.9, max: 28 },
  { year: "2024", min: 5.0, avg: 8.5, max: 32 },
];

type Student = { branch: string; status: string; package?: number };

type BranchStat = {
  branch: string;
  total: number;
  placed: number;
  unplaced: number;
  rate: string;
  avgPackage: string;
};

export default function ManagementDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tnp/students?limit=1000")
      .then((r) => r.json())
      .then((d) => { if (d.success) setStudents(d.data ?? []); })
      .finally(() => setLoading(false));
  }, []);

  const total = students.length;
  const placed = students.filter((s) => s.status === "PLACED").length;
  const placementPct = total > 0 ? Math.round((placed / total) * 100) : 0;
  const packages = students.filter((s) => s.status === "PLACED" && s.package && s.package > 0).map((s) => s.package!);
  const avgPkg = packages.length > 0 ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(1) : null;

  const branchMap: Record<string, { placed: number; unplaced: number; pkgs: number[] }> = {};
  students.forEach((s) => {
    if (!branchMap[s.branch]) branchMap[s.branch] = { placed: 0, unplaced: 0, pkgs: [] };
    if (s.status === "PLACED") {
      branchMap[s.branch].placed++;
      if (s.package) branchMap[s.branch].pkgs.push(s.package);
    } else {
      branchMap[s.branch].unplaced++;
    }
  });

  const branchData: BranchStat[] = Object.entries(branchMap)
    .map(([branch, d]) => {
      const tot = d.placed + d.unplaced;
      const avg = d.pkgs.length > 0
        ? (d.pkgs.reduce((a, b) => a + b, 0) / d.pkgs.length).toFixed(1)
        : "—";
      return {
        branch,
        total: tot,
        placed: d.placed,
        unplaced: d.unplaced,
        rate: tot > 0 ? ((d.placed / tot) * 100).toFixed(0) : "0",
        avgPackage: avg,
      };
    })
    .sort((a, b) => a.branch.localeCompare(b.branch));

  const stats = [
    { title: "Overall Placement Rate", value: loading ? "…" : `${placementPct}%`, icon: Award, color: "text-green-600", bg: "bg-green-50" },
    { title: "Total Students", value: loading ? "…" : String(total), icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Students Placed", value: loading ? "…" : String(placed), icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Avg Package", value: loading ? "…" : (avgPkg ? `${avgPkg} LPA` : "—"), icon: Building2, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Management Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive placement analytics and insights</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Live KPI Cards */}
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

      {/* Historical Trends */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Historical Placement Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yearlyPlacementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="percentage" stroke="#4f46e5" strokeWidth={2} name="Placement %" />
              <Line yAxisId="right" type="monotone" dataKey="avgPackage" stroke="#10b981" strokeWidth={2} name="Avg Package (LPA)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Live Branch Chart */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Current Branch-wise Placement</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] bg-gray-100 animate-pulse rounded-lg" />
            ) : branchData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">No student data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={branchData}>
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

        {/* Historical Package Distribution */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Historical Package Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={packageTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="min" stroke="#f59e0b" strokeWidth={2} name="Min (LPA)" />
                <Line type="monotone" dataKey="avg" stroke="#4f46e5" strokeWidth={2} name="Avg (LPA)" />
                <Line type="monotone" dataKey="max" stroke="#10b981" strokeWidth={2} name="Max (LPA)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Live Branch Table */}
      {!loading && branchData.length > 0 && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Current Branch-wise Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    {["Branch", "Total", "Placed", "Unplaced", "Rate", "Avg Package"].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-sm font-medium text-gray-900">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {branchData.map((b) => (
                    <tr key={b.branch} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{b.branch}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{b.total}</td>
                      <td className="py-3 px-4 text-sm text-green-600 font-medium">{b.placed}</td>
                      <td className="py-3 px-4 text-sm text-orange-600 font-medium">{b.unplaced}</td>
                      <td className="py-3 px-4 text-sm text-indigo-600 font-semibold">{b.rate}%</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{b.avgPackage !== "—" ? `${b.avgPackage} LPA` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
