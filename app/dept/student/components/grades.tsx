"use client"
import { useState } from "react";
import { TrendingUp, Award, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { studentGrades, currentUser } from "../../data/mockdata";

export default function StudentGrades() {
  const [filterSemester, setFilterSemester] = useState<string>("all");
  const user = currentUser.student;

  const filteredGrades = studentGrades.filter((grade) => {
    return filterSemester === "all" || grade.semester.toString() === filterSemester;
  });

  const totalCredits = filteredGrades.reduce((sum, grade) => sum + grade.credits, 0);
  const totalGradePoints = filteredGrades.reduce(
    (sum, grade) => sum + grade.gpa * grade.credits,
    0
  );
  const calculatedCGPA = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : "0.00";

  const getGradeBadgeVariant = (grade: string) => {
    if (grade.startsWith("A")) return "default";
    if (grade.startsWith("B")) return "outline";
    return "secondary";
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Academic Performance</h1>
        <p className="text-gray-600">Track your grades and GPA across semesters</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current CGPA</p>
                <p className="text-3xl font-semibold text-gray-900">{user.cgpa}</p>
              </div>
              <div className="size-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="size-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">Out of 4.00 scale</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Credits</p>
                <p className="text-3xl font-semibold text-gray-900">{totalCredits}</p>
              </div>
              <div className="size-12 bg-green-50 rounded-xl flex items-center justify-center">
                <Award className="size-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">Credits completed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Semester CGPA</p>
                <p className="text-3xl font-semibold text-gray-900">{calculatedCGPA}</p>
              </div>
              <div className="size-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="size-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">Based on selected courses</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Course Grades</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-gray-600" />
              <select
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value)}
                className="h-9 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-sm"
              >
                <option value="all">All Semesters</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Course Code</TableHead>
                  <TableHead className="font-semibold">Course Name</TableHead>
                  <TableHead className="font-semibold text-center">Credits</TableHead>
                  <TableHead className="font-semibold text-center">Grade</TableHead>
                  <TableHead className="font-semibold text-center">Grade Points</TableHead>
                  <TableHead className="font-semibold text-center">Semester</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGrades.map((grade) => (
                  <TableRow key={grade.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{grade.code}</TableCell>
                    <TableCell>{grade.course}</TableCell>
                    <TableCell className="text-center">{grade.credits}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getGradeBadgeVariant(grade.grade)}>
                        {grade.grade}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {grade.gpa.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">Sem {grade.semester}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredGrades.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No grades found for the selected semester.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
