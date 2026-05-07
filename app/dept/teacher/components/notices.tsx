"use client"

import { useState, useEffect } from "react";
import { Plus, Trash2, Search, AlertCircle, Info, Bell, AlertTriangle, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type Priority = "low" | "medium" | "high" | "urgent";

interface Notice {
  _id: string;
  title: string;
  content: string;
  priority: Priority;
  branch: string;
  createdAt: string;
  author?: string;
}

interface Teacher {
  _id: string;
  name: { first: string; middle?: string; last: string };
  department: string;
}

const priorityConfig: Record<Priority, { variant: "destructive" | "default" | "outline" | "secondary"; icon: React.ReactNode; label: string }> = {
  urgent: { variant: "destructive", icon: <Zap className="size-4 text-red-500 flex-shrink-0" />, label: "Urgent" },
  high: { variant: "destructive", icon: <AlertCircle className="size-4 text-red-500 flex-shrink-0" />, label: "High" },
  medium: { variant: "default", icon: <Info className="size-4 text-blue-500 flex-shrink-0" />, label: "Medium" },
  low: { variant: "outline", icon: <AlertTriangle className="size-4 text-gray-400 flex-shrink-0" />, label: "Low" },
};

const EMPTY_FORM = { title: "", content: "", priority: "medium" as Priority };

export default function TeacherNotices() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
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
        await fetchNotices(data.data.department);
      } catch {
        toast.error("Failed to load teacher information");
        setLoading(false);
      }
    }
    init();
  }, []);

  async function fetchNotices(branch: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/dept/notices?branch=${encodeURIComponent(branch)}`);
      if (!res.ok) throw new Error("Failed to fetch notices");
      const data = await res.json();
      setNotices(Array.isArray(data.data) ? data.data : []);
    } catch {
      toast.error("Failed to load notices");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!teacher) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/dept/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, branch: teacher.department, authorName: `${teacher.name.first} ${teacher.name.last}`, authorRole: "teacher" }),
      });
      if (!res.ok) throw new Error("Failed to create notice");
      const data = await res.json();
      setNotices(prev => [data.data ?? data, ...prev]);
      setShowModal(false);
      setForm(EMPTY_FORM);
      toast.success("Notice posted successfully");
    } catch {
      toast.error("Failed to post notice");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/dept/notices?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete notice");
      setNotices(prev => prev.filter(n => n._id !== id));
      toast.success("Notice deleted");
    } catch {
      toast.error("Failed to delete notice");
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = notices.filter(n => {
    const matchFilter = filter === "all" || n.priority === filter;
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Notices</h1>
          <p className="text-gray-600">Manage and post notices for students</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus className="size-4" />
          Post Notice
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notices..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 h-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "urgent", "high", "medium", "low"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Notice List */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="size-8 rounded-lg flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Bell className="size-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium text-gray-500">No notices found</p>
            <p className="text-sm mt-1">
              {filter !== "all" || search
                ? "Try changing your search or filter"
                : "Post your first notice to get started"}
            </p>
          </div>
        ) : (
          filtered.map(notice => {
            const config = priorityConfig[notice.priority] ?? priorityConfig.medium;
            return (
              <Card key={notice._id} className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        {config.icon}
                        <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                        <Badge variant={config.variant} className="text-xs capitalize">
                          {notice.priority}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">{notice.content}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {notice.author && <span>By {notice.author}</span>}
                        {notice.author && <span>•</span>}
                        <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="font-medium">{notice.branch}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(notice._id)}
                      disabled={deletingId === notice._id}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => { setShowModal(false); setForm(EMPTY_FORM); }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Post New Notice</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Notice title..."
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                  placeholder="Notice content..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={form.priority}
                  onChange={e => setForm(p => ({ ...p, priority: e.target.value as Priority }))}
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
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
                {submitting ? "Posting..." : "Post Notice"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
