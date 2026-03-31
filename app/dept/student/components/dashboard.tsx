"use client"
import { Calendar, BookOpen, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { currentUser, statsData, notices, timetable, attendance } from "../../data/mockdata";

export default function StudentDashboard() {
  const user = currentUser.student;
  const stats = statsData.student;
  const todaySchedule = timetable[0].slots; // Monday for demo
  const recentNotices = notices.slice(0, 3);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your courses today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Courses</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalCourses}</p>
              </div>
              <div className="size-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <BookOpen className="size-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current CGPA</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.currentCGPA}</p>
              </div>
              <div className="size-12 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="size-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Attendance</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.averageAttendance}%</p>
              </div>
              <div className="size-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Calendar className="size-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Upcoming Tests</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.upcomingTests}</p>
              </div>
              <div className="size-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <Clock className="size-6 text-orange-600" />
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
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaySchedule.map((slot, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      slot.course === "Break"
                        ? "border-gray-200 bg-gray-50"
                        : "border-blue-200 bg-blue-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Clock className="size-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">
                            {slot.time}
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="font-medium text-gray-900">{slot.course}</p>
                          {slot.course !== "Break" && (
                            <p className="text-sm text-gray-600 mt-0.5">
                              {slot.instructor} • {slot.room}
                            </p>
                          )}
                        </div>
                      </div>
                      {slot.course !== "Break" && (
                        <Badge variant="outline">In-person</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Attendance Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendance.slice(0, 3).map((course) => (
                  <div key={course.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{course.course}</p>
                        <p className="text-sm text-gray-600">{course.code}</p>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {course.attended}/{course.total} ({course.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={course.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Important Notices */}
          <Card>
            <CardHeader>
              <CardTitle>Important Notices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      {notice.priority === "high" && (
                        <AlertCircle className="size-4 text-red-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                          {notice.title}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {notice.content}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{notice.date}</span>
                      <Badge
                        variant={
                          notice.priority === "high"
                            ? "destructive"
                            : notice.priority === "medium"
                            ? "default"
                            : "outline"
                        }
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
                <button className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <p className="font-medium text-sm text-gray-900">View All Grades</p>
                </button>
                <button className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <p className="font-medium text-sm text-gray-900">Check Attendance</p>
                </button>
                <button className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <p className="font-medium text-sm text-gray-900">Take Practice Test</p>
                </button>
                <button className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <p className="font-medium text-sm text-gray-900">View Full Timetable</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
