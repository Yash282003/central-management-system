"use client";
import { useState, useEffect } from "react";
import { TrendingUp, Award, Filter, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface Grade {
  _id: string;
  courseName: string;
  courseCode: string;
  semester: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  gpa: number;
  credits: number;
}

const gradeColor = (g: string) => {
  if (["O", "A+"].includes(g)) return "bg-emerald-100 text-emerald-700";
  if (["A", "B+"].includes(g)) return "bg-blue-100 text-blue-700";
  if (g === "B") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

export default function StudentGrades() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [filterSemester, setFilterSemester] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await fetch("/api/student/me");
        const me = await meRes.json();
        if (!me.success) return;

        const res = await fetch(`/api/dept/grades?studentId=${me.data._id}`);
        const data = await res.json();
        if (data.success) setGrades(data.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const semesters = [...new Set(grades.map((g) => g.semester))].sort();
  const filtered = filterSemester === "all" ? grades : grades.filter((g) => g.semester === filterSemester);

  const totalCredits = filtered.reduce((s, g) => s + g.credits, 0);
  const totalPoints = filtered.reduce((s, g) => s + g.gpa * g.credits, 0);
  const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "—";

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Academic Performance</h1>
        <p className="text-gray-500 text-sm">Your grades and CGPA across all semesters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
        ) : (
          <>
            <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-5">
                <p className="text-xs font-medium text-blue-600 mb-1">CGPA</p>
                <p className="text-3xl font-bold text-blue-700">{cgpa}</p>
                <p className="text-xs text-blue-500 mt-1">out of 10.0</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardContent className="p-5">
                <p className="text-xs font-medium text-emerald-600 mb-1">Courses</p>
                <p className="text-3xl font-bold text-emerald-700">{filtered.length}</p>
                <p className="text-xs text-emerald-500 mt-1">total courses</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-violet-50 to-purple-50">
              <CardContent className="p-5">
                <p className="text-xs font-medium text-violet-600 mb-1">Credits</p>
                <p className="text-3xl font-bold text-violet-700">{totalCredits}</p>
                <p className="text-xs text-violet-500 mt-1">total credits earned</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 mb-5">
        <Filter className="size-4 text-gray-400" />
        <select
          value={filterSemester}
          onChange={(e) => setFilterSemester(e.target.value)}
          className="h-9 px-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">All Semesters</option>
          {semesters.map((s) => <option key={s} value={s}>Semester {s}</option>)}
        </select>
      </div>

      <Card className="rounded-2xl border-0 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <BookOpen className="size-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No grades recorded yet</p>
              <p className="text-gray-400 text-sm">Your teacher will enter grades after assessments</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100">
                  <TableHead>Course</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead className="text-center">Marks</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                  <TableHead className="text-center">GPA</TableHead>
                  <TableHead className="text-center">Credits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((g) => (
                  <TableRow key={g._id} className="border-gray-50 hover:bg-gray-50/50">
                    <TableCell className="font-medium text-gray-900">{g.courseName}</TableCell>
                    <TableCell className="text-gray-500 text-sm">{g.courseCode || "—"}</TableCell>
                    <TableCell className="text-gray-500 text-sm">Sem {g.semester}</TableCell>
                    <TableCell className="text-center text-sm">{g.marksObtained}/{g.maxMarks}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={`text-xs font-bold ${gradeColor(g.grade)}`}>{g.grade}</Badge>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-gray-900">{g.gpa}</TableCell>
                    <TableCell className="text-center text-gray-500">{g.credits}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
