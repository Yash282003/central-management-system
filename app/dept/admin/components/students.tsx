"use client"
import { useState } from "react";
import { Search, GraduationCap, AlertCircle, ChevronLeft, ChevronRight, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { students } from "../../data/mockdata";

export default function AdminStudents() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [semFilter, setSemFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<typeof students[0] | null>(null);
  const perPage = 6;

  const filtered = students.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || s.status === filter;
    const matchSem = semFilter === "all" || String(s.semester) === semFilter;
    return matchSearch && matchFilter && matchSem;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Student Management</h1>
          <p className="text-gray-600">{students.length} students enrolled in the department</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
          <UserPlus className="size-4" />
          Add Student
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Students", value: students.length, icon: <GraduationCap className="size-5 text-blue-600" />, bg: "bg-blue-50" },
          { label: "Active", value: students.filter(s => s.status === "active").length, icon: <GraduationCap className="size-5 text-green-600" />, bg: "bg-green-50" },
          { label: "At Risk", value: students.filter(s => s.status === "warning").length, icon: <AlertCircle className="size-5 text-orange-600" />, bg: "bg-orange-50" },
          { label: "Avg CGPA", value: (students.reduce((a, s) => a + s.cgpa, 0) / students.length).toFixed(2), icon: <GraduationCap className="size-5 text-purple-600" />, bg: "bg-purple-50" },
        ].map(item => (
          <Card key={item.label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`size-10 ${item.bg} rounded-xl flex items-center justify-center`}>{item.icon}</div>
              <div>
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-xl font-semibold text-gray-900">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 h-10 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {[{ label: "All", value: "all" }, { label: "Active", value: "active" }, { label: "At Risk", value: "warning" }].map(f => (
            <button key={f.value} onClick={() => { setFilter(f.value); setPage(1); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f.value ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}>{f.label}</button>
          ))}
        </div>
        <select
          value={semFilter}
          onChange={e => { setSemFilter(e.target.value); setPage(1); }}
          className="h-10 px-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={String(s)}>Semester {s}</option>)}
        </select>
        <span className="text-sm text-gray-500 ml-auto">{filtered.length} results</span>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Semester</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">CGPA</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.map(student => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-9 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-700">
                        {student.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-mono">{student.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Sem {student.semester}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${student.cgpa >= 3.7 ? "text-green-600" : student.cgpa >= 3.0 ? "text-gray-900" : "text-orange-600"}`}>
                      {student.cgpa}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Progress value={student.attendance} className="h-1.5 w-20" />
                      <span className={`text-sm ${student.attendance < 85 ? "text-red-600 font-medium" : "text-gray-700"}`}>{student.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={student.status === "active" ? "default" : "destructive"} className="text-xs">{student.status}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => setSelected(student)} className="text-sm text-blue-600 hover:underline font-medium">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <span className="text-sm text-gray-500">Showing {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"><ChevronLeft className="size-4" /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
              <button key={pg} onClick={() => setPage(pg)} className={`size-9 rounded-lg text-sm font-medium transition-colors ${page === pg ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-700 hover:bg-gray-50"}`}>{pg}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"><ChevronRight className="size-4" /></button>
          </div>
        </div>
      </Card>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              <div className="size-16 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-blue-700">
                {selected.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selected.name}</h2>
                <p className="text-sm text-gray-500">{selected.id}</p>
                <Badge className="mt-1" variant={selected.status === "active" ? "default" : "destructive"}>{selected.status}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">CGPA</p>
                <p className="text-2xl font-bold text-gray-900">{selected.cgpa}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Attendance</p>
                <p className={`text-2xl font-bold ${selected.attendance < 85 ? "text-red-600" : "text-gray-900"}`}>{selected.attendance}%</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-900 font-medium">{selected.email}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Semester</span>
                <span className="text-gray-900 font-medium">{selected.semester}</span>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="w-full mt-6 h-10 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
