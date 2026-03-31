"use client"
import { Building, Users, Award, BookOpen, Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { departments, facultyMembers, courses } from "../../data/mockdata";

export default function StudentDepartment() {
  const department = departments[0]; // Computer Science
  const deptCourses = courses.slice(0, 5);
  const deptFaculty = facultyMembers.slice(0, 4);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Department Information</h1>
        <p className="text-gray-600">
          Overview of the {department.name} department
        </p>
      </div>

      {/* Department Overview */}
      <Card className="mb-6">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className="size-20 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Building className="size-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {department.name}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>Department Code: {department.code}</span>
                <span>•</span>
                <span>Head: {department.head}</span>
              </div>
              <div className="grid grid-cols-3 gap-6 mt-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="size-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Students</p>
                      <p className="text-2xl font-semibold text-gray-900">{department.students}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BookOpen className="size-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Active Courses</p>
                      <p className="text-2xl font-semibold text-gray-900">{deptCourses.length}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Award className="size-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Faculty Members</p>
                      <p className="text-2xl font-semibold text-gray-900">{deptFaculty.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faculty Members */}
        <Card>
          <CardHeader>
            <CardTitle>Faculty Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deptFaculty.map((faculty) => (
                <div
                  key={faculty.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="size-12">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {faculty.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{faculty.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{faculty.designation}</p>
                      <Badge variant="outline" className="text-xs mb-2">
                        {faculty.specialization}
                      </Badge>
                      <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                        <div className="flex items-center gap-1">
                          <Mail className="size-3" />
                          {faculty.email}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Experience: {faculty.experience} years
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Courses Offered */}
        <Card>
          <CardHeader>
            <CardTitle>Courses Offered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deptCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{course.name}</h4>
                      <p className="text-sm text-gray-600">{course.id}</p>
                    </div>
                    <Badge variant="outline">{course.credits} Credits</Badge>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Instructor: {course.instructor}</span>
                    <span className="text-xs text-gray-500">
                      {course.enrolled}/{course.capacity} enrolled
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="size-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-medium text-gray-900">cs.dept@university.edu</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone</p>
                <p className="font-medium text-gray-900">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="size-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Location</p>
                <p className="font-medium text-gray-900">Building A, Floor 3</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
