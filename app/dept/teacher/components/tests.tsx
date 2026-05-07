"use client"

import { useState, useEffect } from "react";
import { Plus, ClipboardList, Clock, Trash2, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Test {
  _id: string;
  title: string;
  subject: string;
  date: string;
  duration: number;
  maxMarks: number;
  syllabus?: string;
  branch: string;
  createdAt: string;
}

interface Teacher {
  _id: string;
  name: { first: string; middle?: string; last: string };
  department: string;
}

const EMPTY_FORM = {
  title: "",
  subject: "",
  date: "",
  duration: 60,
  maxMarks: 100,
  syllabus: "",
};

function isUpcoming(dateStr: string) {
  return new Date(dateStr) >= new Date(new Date().toDateString());
}

export default function TeacherTests() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
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
        await fetchTests(data.data.department);
      } catch {
        toast.error("Failed to load teacher information");
        setLoading(false);
      }
    }
    init();
  }, []);

  async function fetchTests(branch: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/dept/tests?branch=${encodeURIComponent(branch)}`);
      if (!res.ok) throw new Error("Failed to fetch tests");
      const data = await res.json();
      setTests(Array.isArray(data.data) ? data.data : []);
    } catch {
      toast.error("Failed to load tests");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.subject.trim()) { toast.error("Subject is required"); return; }
    if (!form.date) { toast.error("Date is required"); return; }
    if (!teacher) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/dept/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, branch: teacher.department }),
      });
      if (!res.ok) throw new Error("Failed to create test");
      const data = await res.json();
      setTests(prev => [data.data, ...prev]);
      setShowModal(false);
      setForm(EMPTY_FORM);
      toast.success("Test scheduled successfully");
    } catch {
      toast.error("Failed to schedule test");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/dept/tests?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete test");
      setTests(prev => prev.filter(t => t._id !== id));
      toast.success("Test deleted");
    } catch {
      toast.error("Failed to delete test");
    } finally {
      setDeletingId(null);
    }
  }

  const upcoming = tests.filter(t => isUpcoming(t.date));
  const past = tests.filter(t => !isUpcoming(t.date));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Tests</h1>
          <p className="text-gray-600">Schedule and manage assessments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus className="size-4" />
          New Test
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <Skeleton className="size-10 rounded-xl" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="grid grid-cols-3 gap-2">
                  <Skeleton className="h-14 rounded-lg" />
                  <Skeleton className="h-14 rounded-lg" />
                  <Skeleton className="h-14 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tests.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <ClipboardList className="size-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium text-gray-500">No tests scheduled</p>
          <p className="text-sm mt-1">Create your first test to get started</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Upcoming ({upcoming.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcoming.map(test => (
                  <TestCard key={test._id} test={test} onDelete={handleDelete} deletingId={deletingId} />
                ))}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Past ({past.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {past.map(test => (
                  <TestCard key={test._id} test={test} onDelete={handleDelete} deletingId={deletingId} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Create Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => { setShowModal(false); setForm(EMPTY_FORM); }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Schedule New Test</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Data Structures Quiz 3"
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                  placeholder="e.g. Data Structures and Algorithms"
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    min={15}
                    step={15}
                    value={form.duration}
                    onChange={e => setForm(p => ({ ...p, duration: Number(e.target.value) }))}
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks</label>
                <input
                  type="number"
                  min={1}
                  value={form.maxMarks}
                  onChange={e => setForm(p => ({ ...p, maxMarks: Number(e.target.value) }))}
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Syllabus / Topics</label>
                <textarea
                  value={form.syllabus}
                  onChange={e => setForm(p => ({ ...p, syllabus: e.target.value }))}
                  placeholder="Topics covered in this test..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                <input
                  type="text"
                  value={teacher?.department ?? ""}
                  readOnly
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowModal(false); setForm(EMPTY_FORM); }}
                className="flex-1 h-10 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={submitting}
                className="flex-1 h-10 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {submitting ? "Scheduling..." : "Schedule Test"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TestCard({
  test,
  onDelete,
  deletingId,
}: {
  test: Test;
  onDelete: (id: string) => void;
  deletingId: string | null;
}) {
  const upcoming = isUpcoming(test.date);
  return (
    <Card className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="size-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <ClipboardList className="size-5 text-blue-600" />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={upcoming ? "default" : "outline"} className="text-xs">
              {upcoming ? (
                <span className="flex items-center gap-1"><Clock className="size-3" /> Upcoming</span>
              ) : (
                <span className="flex items-center gap-1"><BookOpen className="size-3" /> Completed</span>
              )}
            </Badge>
            <button
              onClick={() => onDelete(test._id)}
              disabled={deletingId === test._id}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">{test.title}</h3>
        <p className="text-sm text-gray-500 mb-4">{test.subject}</p>
        {test.syllabus && (
          <p className="text-xs text-gray-500 mb-4 line-clamp-2">{test.syllabus}</p>
        )}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-500">Date</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(test.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-500">Duration</p>
            <p className="text-sm font-medium text-gray-900">{test.duration} min</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-500">Marks</p>
            <p className="text-sm font-medium text-gray-900">{test.maxMarks}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
