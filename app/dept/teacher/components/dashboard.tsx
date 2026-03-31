"use client"
import { useState } from "react";
import { BookOpen, Users, ClipboardList, TrendingUp, Clock, AlertCircle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { currentUser, statsData, notices, timetable, students, courses } from "../../data/mockdata";

export default function TeacherDashboard() {
  const user = currentUser.teacher;
  const stats = statsData.teacher;
  const todaySchedule = timetable[0].slots;
  const recentNotices = notices.slice(0, 3);
  const lowAttendance = students.filter(s => s.attendance < 85);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Good morning, {user.name}!
        </h1>
        <p className="text-gray-600">
          {user.designation} — {user.department} Department
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalStudents}</p>
                <p className="text-xs text-green-600 mt-1">↑ 12 this semester</p>
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
                <p className="text-2xl font-semibold text-gray-900">{stats.activeCourses}</p>
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
                <p className="text-sm text-gray-600 mb-1">Pending Assignments</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingAssignments}</p>
                <p className="text-xs text-orange-600 mt-1">Need grading</p>
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
                <p className="text-sm text-gray-600 mb-1">Avg Class Attendance</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.avgClassAttendance}%</p>
                <p className="text-xs text-blue-600 mt-1">↑ 2.3% vs last month</p>
              </div>
              <div className="size-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="size-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="size-5" />
                  Today's Classes
                </CardTitle>
                <Badge variant="outline">Monday</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaySchedule.map((slot, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      slot.course === "Break"
                        ? "border-gray-200 bg-gray-50"
                        : "border-blue-100 bg-blue-50/40 hover:bg-blue-50 transition-colors cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-xs font-medium text-gray-500 w-24">{slot.time}</div>
                        <div>
                          <p className="font-medium text-gray-900">{slot.course}</p>
                          {slot.course !== "Break" && (
                            <p className="text-sm text-gray-500">{slot.room}</p>
                          )}
                        </div>
                      </div>
                      {slot.course !== "Break" && (
                        <Badge variant="outline" className="text-xs">Room {slot.room}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Course Enrollment */}
          <Card>
            <CardHeader>
              <CardTitle>My Courses — Enrollment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{course.name}</p>
                        <p className="text-sm text-gray-500">{course.id} · {course.credits} credits</p>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {course.enrolled}/{course.capacity}
                      </span>
                    </div>
                    <Progress value={(course.enrolled / course.capacity) * 100} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Low Attendance Alert */}
          {lowAttendance.length > 0 && (
            <Card className="border-orange-200 bg-orange-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <AlertCircle className="size-5" />
                  Attention Needed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-orange-600 mb-3">{lowAttendance.length} students below 85% attendance</p>
                <div className="space-y-2">
                  {lowAttendance.map(s => (
                    <div key={s.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{s.name}</span>
                      <Badge variant="destructive" className="text-xs">{s.attendance}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notices */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Notices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentNotices.map(notice => (
                  <div key={notice.id} className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                    <p className="font-medium text-sm text-gray-900 mb-1">{notice.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{notice.date}</span>
                      <Badge
                        variant={notice.priority === "high" ? "destructive" : notice.priority === "medium" ? "default" : "outline"}
                        className="text-xs"
                      >
                        {notice.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors group">
                  <Plus className="size-4 text-blue-600" />
                  <span className="font-medium text-sm text-gray-900">Post a Notice</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors group">
                  <ClipboardList className="size-4 text-blue-600" />
                  <span className="font-medium text-sm text-gray-900">Create Test</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors group">
                  <Users className="size-4 text-blue-600" />
                  <span className="font-medium text-sm text-gray-900">View Students</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors group">
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
