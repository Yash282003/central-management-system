"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "../../dashboardLayout";
import { BranchRate, CompanyHiring, NavItem, PackageGrowth, PlacementTrend, UnplacedReason } from "../../type";

// DATA
const placementTrends: PlacementTrend[] = [
  { year: "2020-21", percentage: 78, avgPackage: 6.2 },
  { year: "2021-22", percentage: 82, avgPackage: 6.8 },
  { year: "2022-23", percentage: 86, avgPackage: 7.3 },
  { year: "2023-24", percentage: 89, avgPackage: 7.9 },
  { year: "2024-25", percentage: 92, avgPackage: 8.5 },
  { year: "2025-26", percentage: 88.8, avgPackage: 6.8 },
];

const packageGrowth: PackageGrowth[] = [
  { year: "2020-21", min: 3.5, avg: 6.2, max: 18 },
  { year: "2021-22", min: 3.8, avg: 6.8, max: 22 },
  { year: "2022-23", min: 4.2, avg: 7.3, max: 24 },
  { year: "2023-24", min: 4.5, avg: 7.9, max: 28 },
  { year: "2024-25", min: 5.0, avg: 8.5, max: 32 },
  { year: "2025-26", min: 4.5, avg: 6.8, max: 28 },
];

const branchWiseRate: BranchRate[] = [
  { branch: "CSE", rate: 95 },
  { branch: "IT", rate: 93 },
  { branch: "ECE", rate: 90 },
  { branch: "EEE", rate: 86 },
  { branch: "MECH", rate: 83 },
  { branch: "CIVIL", rate: 82 },
];

const companyHiring: CompanyHiring[] = [
  { name: "TCS", value: 180 },
  { name: "Infosys", value: 150 },
  { name: "Wipro", value: 120 },
  { name: "Accenture", value: 100 },
  { name: "Cognizant", value: 85 },
  { name: "Others", value: 409 },
];

const unplacedReasons: UnplacedReason[] = [
  { reason: "Skill Gap", value: 35 },
  { reason: "Weak Coding Ability", value: 28 },
  { reason: "Poor Resume", value: 18 },
  { reason: "Lack of Projects", value: 22 },
  { reason: "Low CGPA", value: 25 },
  { reason: "Physical Fitness Issues", value: 3 },
];

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

// ✅ COMPONENT
export default function ManagementAnalytics() {
  return (
    
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>

        {/* Placement Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Placement Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={placementTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="percentage" stroke="#4f46e5" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Fix */}
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={unplacedReasons}
              dataKey="value"
              nameKey="reason"
              outerRadius={100}
              label={(entry: any) =>
                `${entry.reason}: ${entry.value}`
              }
            >
              {unplacedReasons.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
   
  );
}