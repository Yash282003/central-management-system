"use client";
import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, XCircle, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AttendanceRecord {
  _id: string;
  courseName: string;
  courseCode: string;
  totalClasses: number;
  attended: number;
  percentage: number;
}

const getStatus = (pct: number) => {
  if (pct >= 75) return { label: "Good", color: "text-emerald-600", bg: "bg-emerald-100", icon: CheckCircle };
  if (pct >= 60) return { label: "Warning", color: "text-amber-600", bg: "bg-amber-100", icon: AlertTriangle };
  return { label: "Critical", color: "text-red-600", bg: "bg-red-100", icon: XCircle };
};

export default function StudentAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await fetch("/api/student/me");
        const me = await meRes.json();
        if (!me.success) return;

        const res = await fetch(`/api/dept/attendance?studentId=${me.data._id}`);
        const data = await res.json();
        if (data.success) setRecords(data.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const overall = records.length
    ? Math.round(records.reduce((s, r) => s + r.percentage, 0) / records.length)
    : 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Attendance</h1>
        <p className="text-gray-500 text-sm">Track your attendance across all courses</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-2xl" />
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
        </div>
      ) : records.length === 0 ? (
        <div className="py-20 text-center">
          <BookOpen className="size-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No attendance records yet</p>
          <p className="text-gray-400 text-sm">Your teacher will update attendance regularly</p>
        </div>
      ) : (
        <>
          <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 mb-6">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 mb-1">Overall Attendance</p>
                <p className="text-3xl font-bold text-blue-700">{overall}%</p>
                <p className="text-xs text-blue-500 mt-1">across {records.length} courses</p>
              </div>
              <div className="size-16">
                <svg viewBox="0 0 36 36" className="size-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#dbeafe" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3b82f6" strokeWidth="3"
                    strokeDasharray={`${overall} ${100 - overall}`} strokeLinecap="round" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {records.map((r) => {
              const status = getStatus(r.percentage);
              const Icon = status.icon;
              return (
                <Card key={r._id} className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{r.courseName}</p>
                        {r.courseCode && <p className="text-xs text-gray-400">{r.courseCode}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs font-semibold ${status.bg} ${status.color}`}>
                          <Icon className="size-3 mr-1" />{status.label}
                        </Badge>
                        <span className="font-bold text-gray-900">{r.percentage}%</span>
                      </div>
                    </div>
                    <Progress value={r.percentage} className="h-2" />
                    <p className="text-xs text-gray-400 mt-2">{r.attended} / {r.totalClasses} classes attended</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <p className="text-xs font-medium text-amber-700">Minimum 75% attendance required to sit for exams.</p>
          </div>
        </>
      )}
    </div>
  );
}
