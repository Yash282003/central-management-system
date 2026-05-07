"use client";

import { useState, useEffect } from "react";
import { Upload, Download, BookOpen, Search, FileText, Trash2, Link } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Note {
  _id: string;
  title: string;
  subject: string;
  fileUrl: string;
  branch: string;
  downloads?: number;
  createdAt: string;
}

interface Teacher {
  _id: string;
  name: { first: string; middle?: string; last: string };
  department: string;
}

const EMPTY_FORM = { title: "", subject: "", fileUrl: "" };

export default function TeacherNotes() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/teacher/me");
        if (!res.ok) throw new Error("Failed to load teacher info");
        const data = await res.json();
        setTeacher(data.data);
        await fetchNotes(data.data.department);
      } catch {
        toast.error("Failed to load teacher information");
        setLoading(false);
      }
    }
    init();
  }, []);

  async function fetchNotes(branch: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/dept/notes?branch=${encodeURIComponent(branch)}`);
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      setNotes(Array.isArray(data.data) ? data.data : []);
    } catch {
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload() {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.subject.trim()) { toast.error("Subject is required"); return; }
    if (!form.fileUrl.trim()) { toast.error("File URL is required"); return; }
    if (!teacher) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/dept/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, branch: teacher.department }),
      });
      if (!res.ok) throw new Error("Failed to upload note");
      const data = await res.json();
      setNotes((prev) => [data.data, ...prev]);
      setShowModal(false);
      setForm(EMPTY_FORM);
      toast.success("Note uploaded successfully");
    } catch {
      toast.error("Failed to upload note");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/dept/notes?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete note");
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.subject.toLowerCase().includes(search.toLowerCase())
  );

  const totalDownloads = notes.reduce((acc, n) => acc + (n.downloads ?? 0), 0);
  const uniqueSubjects = new Set(notes.map((n) => n.subject)).size;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Notes Management</h1>
          <p className="text-gray-500 text-sm">Upload and manage course materials for your department</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="rounded-xl"
        >
          <Upload className="size-4 mr-2" />
          Upload Notes
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
        ) : (
          <>
            <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-5">
                <p className="text-xs font-medium text-blue-600 mb-1">Total Notes</p>
                <p className="text-3xl font-bold text-blue-700">{notes.length}</p>
                <p className="text-xs text-blue-500 mt-1">materials uploaded</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardContent className="p-5">
                <p className="text-xs font-medium text-emerald-600 mb-1">Total Downloads</p>
                <p className="text-3xl font-bold text-emerald-700">{totalDownloads}</p>
                <p className="text-xs text-emerald-500 mt-1">across all notes</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-violet-50 to-purple-50">
              <CardContent className="p-5">
                <p className="text-xs font-medium text-violet-600 mb-1">Subjects</p>
                <p className="text-3xl font-bold text-violet-700">{uniqueSubjects}</p>
                <p className="text-xs text-violet-500 mt-1">subjects covered</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by title or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 rounded-xl"
        />
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <Skeleton className="size-10 rounded-xl" />
                  <Skeleton className="size-7 rounded-lg" />
                </div>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="size-12 mx-auto mb-4 text-gray-300" />
          <p className="font-medium text-gray-500">No notes found</p>
          <p className="text-sm text-gray-400 mt-1">
            {search ? "Try a different search term" : "Upload your first note to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((note) => (
            <Card
              key={note._id}
              className="border-0 shadow-sm rounded-2xl hover:-translate-y-0.5 transition-all"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="size-10 bg-red-50 rounded-xl flex items-center justify-center">
                    <FileText className="size-5 text-red-500" />
                  </div>
                  <button
                    onClick={() => handleDelete(note._id)}
                    disabled={deletingId === note._id}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <h3 className="font-semibold text-gray-900 mb-1 text-sm leading-tight line-clamp-2">
                  {note.title}
                </h3>
                <p className="text-xs text-gray-500 mb-3">{note.subject}</p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{new Date(note.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">{note.branch}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Download className="size-3" />
                    <span>{note.downloads ?? 0} downloads</span>
                  </div>
                  {note.fileUrl && (
                    <a
                      href={note.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                    >
                      <Link className="size-3" />
                      Open
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => { setShowModal(false); setForm(EMPTY_FORM); }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Upload className="size-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Upload Notes</h2>
                <p className="text-xs text-gray-500">Add a new resource for your students</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="noteTitle">Title *</Label>
                <Input
                  id="noteTitle"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Week 5 — Sorting Algorithms"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="noteSubject">Subject *</Label>
                <Input
                  id="noteSubject"
                  value={form.subject}
                  onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                  placeholder="e.g. Data Structures and Algorithms"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="noteUrl">File URL *</Label>
                <Input
                  id="noteUrl"
                  type="url"
                  value={form.fileUrl}
                  onChange={(e) => setForm((p) => ({ ...p, fileUrl: e.target.value }))}
                  placeholder="https://drive.google.com/..."
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-500">Branch</Label>
                <Input
                  value={teacher?.department ?? ""}
                  readOnly
                  className="rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => { setShowModal(false); setForm(EMPTY_FORM); }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-xl"
                onClick={handleUpload}
                disabled={submitting}
              >
                {submitting ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
