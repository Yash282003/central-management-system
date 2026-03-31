"use client"
import { useState } from "react";
import { Upload, Download, BookOpen, Search, FileText, Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notes, courses } from "../../data/mockdata";

export default function TeacherNotes() {
  const [noteList, setNoteList] = useState(notes);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", course: "CS301" });

  const filtered = noteList.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || n.course === filter;
    return matchSearch && matchFilter;
  });

  const handleUpload = () => {
    if (!form.title.trim()) return;
    setNoteList(prev => [
      {
        id: Date.now(),
        title: form.title,
        course: form.course,
        uploadDate: new Date().toISOString().split("T")[0],
        type: "PDF",
        size: "1.0 MB",
        downloads: 0,
      },
      ...prev
    ]);
    setShowModal(false);
    setForm({ title: "", course: "CS301" });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Notes Management</h1>
          <p className="text-gray-600">Upload and manage course materials</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Upload className="size-4" />
          Upload Notes
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 h-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "all" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
          >
            All Courses
          </button>
          {courses.map(c => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === c.id ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
            >
              {c.id}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <FileText className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Notes</p>
              <p className="text-xl font-semibold text-gray-900">{noteList.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 bg-green-50 rounded-xl flex items-center justify-center">
              <Download className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Downloads</p>
              <p className="text-xl font-semibold text-gray-900">{noteList.reduce((acc, n) => acc + n.downloads, 0)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <BookOpen className="size-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Courses Covered</p>
              <p className="text-xl font-semibold text-gray-900">{new Set(noteList.map(n => n.course)).size}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(note => (
          <Card key={note.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="size-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <FileText className="size-5 text-red-500" />
                </div>
                <button
                  onClick={() => setNoteList(prev => prev.filter(n => n.id !== note.id))}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm leading-tight">{note.title}</h3>
              <p className="text-xs text-gray-500 mb-3">{note.course}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>{note.uploadDate}</span>
                <span>{note.size}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Download className="size-3" />
                  <span>{note.downloads} downloads</span>
                </div>
                <Badge variant="outline" className="text-xs">{note.type}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Notes</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Week 5 — Sorting Algorithms"
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <select
                  value={form.course}
                  onChange={e => setForm(p => ({ ...p, course: e.target.value }))}
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
                >
                  {courses.map(c => <option key={c.id} value={c.id}>{c.id} — {c.name}</option>)}
                </select>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="size-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Click or drag file to upload</p>
                <p className="text-xs text-gray-400 mt-1">PDF, PPTX, DOCX up to 50MB</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleUpload} className="flex-1 h-10 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
