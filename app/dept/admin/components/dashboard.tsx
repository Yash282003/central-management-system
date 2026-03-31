"use client"
import { Users, BookOpen, GraduationCap, Award, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { statsData, timetable } from "../../data/mockdata";

export default function AdminDashboard() {
  const stats = statsData.admin;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Department overview and management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalStudents}</p>
              </div>
              <div className="size-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <GraduationCap className="size-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Faculty Members</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalFaculty}</p>
              </div>
              <div className="size-12 bg-green-50 rounded-xl flex items-center justify-center">
                <Users className="size-6 text-green-600" />
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
              </div>
              <div className="size-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <BookOpen className="size-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Department Ranking</p>
                <p className="text-2xl font-semibold text-gray-900">#{stats.departmentRanking}</p>
              </div>
              <div className="size-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <Award className="size-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Timetable */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5" />
            Weekly Timetable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold text-gray-900">
                    Day
                  </th>
                  {timetable[0].slots.map((slot, idx) => (
                    <th
                      key={idx}
                      className="border border-gray-200 p-3 text-left font-semibold text-gray-900 min-w-[180px]"
                    >
                      {slot.time}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timetable.map((day, dayIdx) => (
                  <tr key={dayIdx} className="hover:bg-gray-50">
                    <td className="border border-gray-200 p-3 font-medium text-gray-900">
                      {day.day}
                    </td>
                    {day.slots.map((slot, slotIdx) => (
                      <td
                        key={slotIdx}
                        className={`border border-gray-200 p-3 ${
                          slot.course === "Break" ? "bg-gray-50" : ""
                        }`}
                      >
                        {slot.course !== "Break" ? (
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{slot.course}</p>
                            <p className="text-xs text-gray-600 mt-1">{slot.instructor}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{slot.room}</p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 text-center">Break</p>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
