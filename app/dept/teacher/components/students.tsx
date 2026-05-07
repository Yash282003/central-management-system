"use client"

import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, GraduationCap, ClipboardCheck, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface Student {
  _id: string;
  name: { first: string; middle?: string; last: string };
  regdNo: string;
  branch: string;
  cgpa?: number;
  avgAttendance?: number;
  email?: string;
  semester?: number;
}

interface Teacher {
  _id: string;
  name: { first: string; middle?: string; last: string };
  department: string;
}

const EMPTY_GRADE = {
  courseName: "",
  courseCode: "",
  semester: "",
  marksObtained: "",
  maxMarks: "",
  credits: "",
};

const EMPTY_ATTENDANCE = {
  courseName: "",
  courseCode: "",
  totalClasses: "",
  attended: "",
};

export default function TeacherStudents() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  // Grade dialog
  const [gradeStudent, setGradeStudent] = useState<Student | null>(null);
  const [gradeForm, setGradeForm] = useState(EMPTY_GRADE);
  const [submittingGrade, setSubmittingGrade] = useState(false);

  // Attendance dialog
  const [attendanceStudent, setAttendanceStudent] = useState<Student | null>(null);
  const [attendanceForm, setAttendanceForm] = useState(EMPTY_ATTENDANCE);
  const [submittingAttendance, setSubmittingAttendance] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/teacher/me");
        if (!res.ok) throw new Error("Failed to load teacher info");
        const data = await res.json();
        setTeacher(data.data);
        await fetchStudents(data.data.department);
      } catch {
        toast.error("Failed to load teacher information");
        setLoading(false);
      }
    }
    init();
  }, []);

  async function fetchStudents(branch: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/dept/students?branch=${encodeURIComponent(branch)}`);
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data.students ?? data);
    } catch {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitGrade() {
    if (!gradeStudent) return;
    if (!gradeForm.courseName.trim()) { toast.error("Course name is required"); return; }
    if (!gradeForm.courseCode.trim()) { toast.error("Course code is required"); return; }
    if (!gradeForm.semester) { toast.error("Semester is required"); return; }
    if (!gradeForm.marksObtained || !gradeForm.maxMarks) { toast.error("Marks are required"); return; }
    if (!gradeForm.credits) { toast.error("Credits are required"); return; }

    setSubmittingGrade(true);
    try {
      const res = await fetch("/api/dept/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: gradeStudent._id,
          studentRegdNo: gradeStudent.regdNo,
          courseName: gradeForm.courseName,
          courseCode: gradeForm.courseCode,
          semester: Number(gradeForm.semester),
          marksObtained: Number(gradeForm.marksObtained),
          maxMarks: Number(gradeForm.maxMarks),
          credits: Number(gradeForm.credits),
        }),
      });
      if (!res.ok) throw new Error("Failed to submit grade");
      setGradeStudent(null);
      setGradeForm(EMPTY_GRADE);
      toast.success(`Grade entered for ${gradeStudent.name}`);
    } catch {
      toast.error("Failed to submit grade");
    } finally {
      setSubmittingGrade(false);
    }
  }

  async function handleSubmitAttendance() {
    if (!attendanceStudent) return;
    if (!attendanceForm.courseName.trim()) { toast.error("Course name is required"); return; }
    if (!attendanceForm.courseCode.trim()) { toast.error("Course code is required"); return; }
    if (!attendanceForm.totalClasses || !attendanceForm.attended) { toast.error("Class counts are required"); return; }

    setSubmittingAttendance(true);
    try {
      const res = await fetch("/api/dept/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: attendanceStudent._id,
          studentRegdNo: attendanceStudent.regdNo,
          courseName: attendanceForm.courseName,
          courseCode: attendanceForm.courseCode,
          totalClasses: Number(attendanceForm.totalClasses),
          attended: Number(attendanceForm.attended),
        }),
      });
      if (!res.ok) throw new Error("Failed to update attendance");
      setAttendanceStudent(null);
      setAttendanceForm(EMPTY_ATTENDANCE);
      toast.success(`Attendance updated for ${attendanceStudent.name}`);
    } catch {
      toast.error("Failed to update attendance");
    } finally {
      setSubmittingAttendance(false);
    }
  }

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.regdNo.toLowerCase().includes(search.toLowerCase()) ||
    (s.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  function initials(name: string) {
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Student Management</h1>
        <p className="text-gray-600">Monitor students, enter grades and update attendance</p>
      </div>

      {/* Search & count */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, reg no, email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 h-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-sm"
          />
        </div>
        {!loading && (
          <span className="text-sm text-gray-500 ml-auto flex items-center gap-1.5">
            <Users className="size-4" />
            {filtered.length} student{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reg No.</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">CGPA</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: perPage }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-9 rounded-full flex-shrink-0" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-36" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-8 w-40 ml-auto" /></td>
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-400">
                    <GraduationCap className="size-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium text-gray-500">No students found</p>
                    {search && <p className="text-sm mt-1">Try a different search term</p>}
                  </td>
                </tr>
              ) : (
                paginated.map(student => {
                  const attendance = student.avgAttendance ?? 0;
                  const cgpa = student.cgpa ?? 0;
                  const lowAttendance = attendance < 75;
                  return (
                    <tr key={student._id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-9 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0">
                            {initials(student.name)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{student.name}</p>
                            {student.email && (
                              <p className="text-xs text-gray-500">{student.email}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-mono">{student.regdNo}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="text-xs font-normal">
                          {student.branch}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-semibold ${cgpa < 6 ? "text-red-600" : cgpa < 8 ? "text-amber-600" : "text-green-600"}`}>
                          {cgpa > 0 ? cgpa.toFixed(2) : "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Progress value={attendance} className="h-1.5 w-20" />
                          <span className={`text-sm font-medium ${lowAttendance ? "text-red-600" : "text-gray-700"}`}>
                            {attendance > 0 ? `${attendance.toFixed(0)}%` : "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => { setGradeStudent(student); setGradeForm(EMPTY_GRADE); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <GraduationCap className="size-3.5" />
                            Enter Grade
                          </button>
                          <button
                            onClick={() => { setAttendanceStudent(student); setAttendanceForm(EMPTY_ATTENDANCE); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                          >
                            <ClipboardCheck className="size-3.5" />
                            Attendance
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              Showing {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="size-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={`size-9 rounded-lg text-sm font-medium transition-colors ${
                    page === pg ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pg}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Grade Dialog */}
      {gradeStudent && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => { setGradeStudent(null); setGradeForm(EMPTY_GRADE); }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <GraduationCap className="size-5 text-blue-700" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Enter Grade</h2>
                <p className="text-sm text-gray-500">{gradeStudent.name} · {gradeStudent.regdNo}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Name *</label>
                  <input
                    type="text"
                    value={gradeForm.courseName}
                    onChange={e => setGradeForm(p => ({ ...p, courseName: e.target.value }))}
                    placeholder="e.g. Data Structures"
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Code *</label>
                  <input
                    type="text"
                    value={gradeForm.courseCode}
                    onChange={e => setGradeForm(p => ({ ...p, courseCode: e.target.value }))}
                    placeholder="e.g. CS301"
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={gradeForm.semester}
                    onChange={e => setGradeForm(p => ({ ...p, semester: e.target.value }))}
                    placeholder="1–8"
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marks *</label>
                  <input
                    type="number"
                    min={0}
                    value={gradeForm.marksObtained}
                    onChange={e => setGradeForm(p => ({ ...p, marksObtained: e.target.value }))}
                    placeholder="Obtained"
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks *</label>
                  <input
                    type="number"
                    min={1}
                    value={gradeForm.maxMarks}
                    onChange={e => setGradeForm(p => ({ ...p, maxMarks: e.target.value }))}
                    placeholder="Total"
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credits *</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={gradeForm.credits}
                  onChange={e => setGradeForm(p => ({ ...p, credits: e.target.value }))}
                  placeholder="e.g. 3"
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setGradeStudent(null); setGradeForm(EMPTY_GRADE); }}
                className="flex-1 h-10 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitGrade}
                disabled={submittingGrade}
                className="flex-1 h-10 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {submittingGrade ? "Saving..." : "Save Grade"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Dialog */}
      {attendanceStudent && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => { setAttendanceStudent(null); setAttendanceForm(EMPTY_ATTENDANCE); }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <ClipboardCheck className="size-5 text-purple-700" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Update Attendance</h2>
                <p className="text-sm text-gray-500">{attendanceStudent.name} · {attendanceStudent.regdNo}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Name *</label>
                  <input
                    type="text"
                    value={attendanceForm.courseName}
                    onChange={e => setAttendanceForm(p => ({ ...p, courseName: e.target.value }))}
                    placeholder="e.g. Data Structures"
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Code *</label>
                  <input
                    type="text"
                    value={attendanceForm.courseCode}
                    onChange={e => setAttendanceForm(p => ({ ...p, courseCode: e.target.value }))}
                    placeholder="e.g. CS301"
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Classes *</label>
                  <input
                    type="number"
                    min={1}
                    value={attendanceForm.totalClasses}
                    onChange={e => setAttendanceForm(p => ({ ...p, totalClasses: e.target.value }))}
                    placeholder="e.g. 40"
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Classes Attended *</label>
                  <input
                    type="number"
                    min={0}
                    value={attendanceForm.attended}
                    onChange={e => setAttendanceForm(p => ({ ...p, attended: e.target.value }))}
                    placeholder="e.g. 36"
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              {attendanceForm.totalClasses && attendanceForm.attended && (
                <div className="bg-purple-50 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm text-purple-700 font-medium">Attendance %</span>
                  <span className="text-lg font-bold text-purple-700">
                    {Math.min(100, Math.round((Number(attendanceForm.attended) / Number(attendanceForm.totalClasses)) * 100))}%
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setAttendanceStudent(null); setAttendanceForm(EMPTY_ATTENDANCE); }}
                className="flex-1 h-10 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAttendance}
                disabled={submittingAttendance}
                className="flex-1 h-10 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-60"
              >
                {submittingAttendance ? "Saving..." : "Update Attendance"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
