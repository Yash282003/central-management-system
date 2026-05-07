"use client"
import { useState, useEffect } from "react";
import { BookOpen, Users, ClipboardList, TrendingUp, Clock, AlertCircle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Teacher {
  _id: string;
  name: { first: string; middle?: string; last: string };
  email: string;
  department: string;
  designation?: string;
  employeeId?: string;
}

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/teacher/me");
        if (res.ok) {
          const data = await res.json();
          setTeacher(data.data);
        }
      } catch {
        // silently fail — dashboard still renders without name
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const fullName = teacher
    ? `${teacher.name?.first ?? ""} ${teacher.name?.last ?? ""}`.trim()
    : "";

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        {loading ? (
          <>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Good morning{fullName ? `, ${fullName}` : ""}!
            </h1>
            <p className="text-gray-600">
              {teacher?.designation ?? "Teacher"}
              {teacher?.department ? ` — ${teacher.department} Department` : ""}
            </p>
          </>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">—</p>
                <p className="text-xs text-gray-500 mt-1">View in Students tab</p>
              </div>
              <div className="size-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="size-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Courses</p>
                <p className="text-2xl font-semibold text-gray-900">—</p>
                <p className="text-xs text-gray-500 mt-1">This semester</p>
              </div>
              <div className="size-12 bg-green-50 rounded-xl flex items-center justify-center">
                <BookOpen className="size-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Scheduled Tests</p>
                <p className="text-2xl font-semibold text-gray-900">—</p>
                <p className="text-xs text-gray-500 mt-1">View in Tests tab</p>
              </div>
              <div className="size-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <ClipboardList className="size-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Notes Uploaded</p>
                <p className="text-2xl font-semibold text-gray-900">—</p>
                <p className="text-xs text-gray-500 mt-1">View in Notes tab</p>
              </div>
              <div className="size-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="size-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Welcome</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm leading-relaxed">
                Use the sidebar to navigate to Students, Notes, Tests, and your Profile.
                You can manage your students&apos; grades and attendance, upload course materials, and schedule tests.
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors">
                  <Plus className="size-4 text-blue-600" />
                  <span className="font-medium text-sm text-gray-900">Post a Notice</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors">
                  <ClipboardList className="size-4 text-blue-600" />
                  <span className="font-medium text-sm text-gray-900">Create Test</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors">
                  <Users className="size-4 text-blue-600" />
                  <span className="font-medium text-sm text-gray-900">View Students</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors">
                  <BookOpen className="size-4 text-blue-600" />
                  <span className="font-medium text-sm text-gray-900">Upload Notes</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
