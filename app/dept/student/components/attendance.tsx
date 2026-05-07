"use client";
import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, XCircle, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  if (pct >= 75) return { label: "On Track", color: "text-emerald-600", bg: "bg-emerald-100", icon: CheckCircle, stroke: "#10b981", track: "#d1fae5" };
  if (pct >= 60) return { label: "Warning", color: "text-amber-600", bg: "bg-amber-100", icon: AlertTriangle, stroke: "#f59e0b", track: "#fef3c7" };
  return { label: "Critical", color: "text-red-600", bg: "bg-red-100", icon: XCircle, stroke: "#ef4444", track: "#fee2e2" };
};

function CircularProgress({ value }: { value: number }) {
  const radius = 15.9;
  const circumference = 2 * Math.PI * radius;
  const dash = (value / 100) * circumference;
  const status = getStatus(value);
  return (
    <svg viewBox="0 0 36 36" className="size-14 -rotate-90">
      <circle cx="18" cy="18" r={radius} fill="none" stroke={status.track} strokeWidth="3" />
      <circle
        cx="18" cy="18" r={radius} fill="none"
        stroke={status.stroke} strokeWidth="3"
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

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

  const below75 = records.filter((r) => r.percentage < 75).length;
  const onTrack = records.filter((r) => r.percentage >= 75).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Attendance</h1>
        <p className="text-gray-500 text-sm">Track your attendance across all courses</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
        ) : (
          <>
            <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-600 mb-1">Avg Attendance</p>
                  <p className="text-3xl font-bold text-blue-700">{overall}%</p>
                  <p className="text-xs text-blue-500 mt-1">across {records.length} courses</p>
                </div>
                <div className="relative size-14 flex items-center justify-center">
                  <CircularProgress value={overall} />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50">
              <CardContent className="p-5">
                <p className="text-xs font-medium text-amber-600 mb-1">Below 75%</p>
                <p className="text-3xl font-bold text-amber-700">{below75}</p>
                <p className="text-xs text-amber-500 mt-1">
                  {below75 === 0 ? "All courses on track" : `course${below75 > 1 ? "s" : ""} need attention`}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardContent className="p-5">
                <p className="text-xs font-medium text-emerald-600 mb-1">On Track</p>
                <p className="text-3xl font-bold text-emerald-700">{onTrack}</p>
                <p className="text-xs text-emerald-500 mt-1">
                  {onTrack === records.length && records.length > 0 ? "All courses" : `of ${records.length} courses`}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Course Cards */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      ) : records.length === 0 ? (
        <div className="py-20 text-center">
          <BookOpen className="size-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No attendance records yet</p>
          <p className="text-gray-400 text-sm">Your teacher will update attendance regularly</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {records.map((r) => {
              const status = getStatus(r.percentage);
              const Icon = status.icon;
              return (
                <Card
                  key={r._id}
                  className="rounded-2xl border-0 shadow-sm hover:-translate-y-0.5 transition-all"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      {/* SVG ring */}
                      <div className="relative flex-shrink-0 flex items-center justify-center size-14">
                        <CircularProgress value={r.percentage} />
                        <span className={`absolute text-[10px] font-bold ${status.color}`}>
                          {r.percentage}%
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-gray-900 text-sm truncate">{r.courseName}</p>
                          <Badge className={`text-xs font-semibold ${status.bg} ${status.color} border-0 flex-shrink-0`}>
                            <Icon className="size-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>
                        {r.courseCode && (
                          <p className="text-xs text-gray-400 mt-0.5">{r.courseCode}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          {r.attended} / {r.totalClasses} classes attended
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <p className="text-xs font-medium text-amber-700">
              Minimum 75% attendance is required to sit for examinations.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
