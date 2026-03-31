"use client"
import { useState } from "react";
import { BookOpen, Plus, Search, Pencil, Trash2, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { courses } from "../../data/mockdata";

export default function AdminCourses() {
  const [courseList, setCourseList] = useState(courses);
  const [search, setSearch] = useState("");
  const [semFilter, setSemFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const semesters = [...new Set(courses.map(c => c.semester))].sort();

  const filtered = courseList.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchSem = semFilter === "all" || String(c.semester) === semFilter;
    return matchSearch && matchSem;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Course Management</h1>
          <p className="text-gray-600">Manage department courses and curriculum</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus className="size-4" />
          Add Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Courses", value: courseList.length },
          { label: "Total Credits", value: courseList.reduce((a, c) => a + c.credits, 0) },
          { label: "Total Enrolled", value: courseList.reduce((a, c) => a + c.enrolled, 0) },
          { label: "Total Capacity", value: courseList.reduce((a, c) => a + c.capacity, 0) },
        ].map(item => (
          <Card key={item.label}>
            <CardContent className="p-5 text-center">
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-sm text-gray-500 mt-1">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 h-10 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSemFilter("all")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${semFilter === "all" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}>All Semesters</button>
          {semesters.map(s => (
            <button key={s} onClick={() => setSemFilter(String(s))} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${semFilter === String(s) ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}>Sem {s}</button>
          ))}
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(course => {
          const fillPct = Math.round((course.enrolled / course.capacity) * 100);
          return (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="size-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <BookOpen className="size-5 text-blue-600" />
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => setCourseList(prev => prev.filter(c => c.id !== course.id))}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{course.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="text-xs">{course.id}</Badge>
                  <Badge variant="outline" className="text-xs">Sem {course.semester}</Badge>
                  <Badge variant="outline" className="text-xs">{course.credits} cr</Badge>
                </div>
                <p className="text-sm text-gray-500 mb-3">{course.instructor}</p>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Users className="size-3" />
                      <span>Enrollment</span>
                    </div>
                    <span className="text-xs font-medium text-gray-900">{course.enrolled}/{course.capacity}</span>
                  </div>
                  <Progress value={fillPct} className="h-1.5" />
                  <p className="text-xs text-gray-400 mt-1">{fillPct}% filled</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Course</h2>
            <div className="space-y-4">
              {[
                { label: "Course Name", placeholder: "e.g. Advanced Algorithms" },
                { label: "Course Code", placeholder: "e.g. CS401" },
                { label: "Instructor", placeholder: "e.g. Dr. Emily Carter" },
              ].map(field => (
                <div key={field.label}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input type="text" placeholder={field.placeholder} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
              ))}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                  <input type="number" defaultValue={3} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <select className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500">
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input type="number" defaultValue={100} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Add Course</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
