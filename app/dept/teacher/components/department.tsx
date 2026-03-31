"use client"
import { Building2, Users, BookOpen, Award, Globe, Phone, Mail, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { departments, facultyMembers, courses, publications } from "../../data/mockdata";

export default function TeacherDepartment() {
  const dept = departments[0];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Department Info</h1>
        <p className="text-gray-600">Computer Science & Engineering Department Overview</p>
      </div>

      {/* Hero Card */}
      <Card className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className="size-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Building2 className="size-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{dept.name}</h2>
              <p className="text-blue-100 mb-4">Department Code: {dept.code}</p>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-blue-200 text-sm">Head of Department</p>
                  <p className="font-semibold">{dept.head}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Total Students</p>
                  <p className="font-semibold">{dept.students}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Faculty Members</p>
                  <p className="font-semibold">{facultyMembers.length}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Faculty */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5" />
              Faculty Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {facultyMembers.map(f => (
                <div key={f.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="size-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-700">
                    {f.name.split(" ").filter(w => w !== "Dr.").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{f.name}</p>
                    <p className="text-xs text-gray-500">{f.designation} · {f.specialization}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{f.experience}y exp</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5" />
              Department Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {courses.map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.id} · Sem {c.semester} · {c.credits} credits</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{c.enrolled}</p>
                    <p className="text-xs text-gray-500">enrolled</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Publications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="size-5" />
            Department Publications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {publications.map(pub => (
              <div key={pub.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="size-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Award className="size-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{pub.title}</h4>
                  <p className="text-xs text-gray-500 mb-2">{pub.authors}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="font-medium text-blue-600">{pub.journal}</span>
                    <span>·</span>
                    <span>{pub.year}</span>
                    <span>·</span>
                    <span>{pub.citations} citations</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
