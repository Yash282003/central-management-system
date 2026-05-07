"use client"
import { useState, useEffect } from "react";
import { Plus, Bell, AlertCircle, Info, Trash2, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const BRANCHES = ["CSE", "ECE", "EEE", "ME", "CE", "IT", "MCA", "MBA"];

interface Notice {
  _id: string;
  title: string;
  content: string;
  priority: "high" | "medium" | "low";
  authorName: string;
  authorRole: string;
  branch: string;
  createdAt?: string;
}

const priorityStyle: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-blue-100 text-blue-700",
  low: "bg-gray-100 text-gray-600",
};

const emptyForm = {
  title: "",
  content: "",
  priority: "medium",
  branch: "",
};

export default function AdminNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    async function init() {
      try {
        const meRes = await fetch("/api/admin/me");
        if (meRes.ok) {
          const meData = await meRes.json();
          const admin = meData.data ?? meData.admin;
          if (admin?.name) {
            if (typeof admin.name === "object") {
              setAdminName([admin.name.first, admin.name.last].filter(Boolean).join(" ") || "Admin");
            } else {
              setAdminName(admin.name);
            }
          }
        }
      } catch {}
      fetchNotices();
    }
    init();
  }, []);

  async function fetchNotices() {
    setLoading(true);
    try {
      const res = await fetch("/api/dept/notices");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setNotices(Array.isArray(data.data) ? data.data : []);
    } catch {
      toast.error("Failed to load notices");
    } finally {
      setLoading(false);
    }
  }

  const filtered = notices.filter(n => {
    const matchFilter = filter === "all" || n.priority === filter;
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  async function handlePost() {
    if (!form.title.trim() || !form.branch) {
      toast.error("Title and branch are required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/dept/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          authorName: adminName,
          authorRole: "admin",
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Notice posted successfully");
      setOpen(false);
      setForm(emptyForm);
      fetchNotices();
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
      if (!res.ok) throw new Error();
      toast.success("Notice deleted");
      setNotices(prev => prev.filter(n => n._id !== id));
    } catch {
      toast.error("Failed to delete notice");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Notice Management</h1>
          <p className="text-gray-600">Create and manage official department notices</p>
        </div>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
          <Plus className="size-4" />
          Post Notice
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))
        ) : (
          <>
            <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-5">
                <p className="text-xs font-medium text-blue-600 mb-1">Total Notices</p>
                <p className="text-3xl font-bold text-blue-700">{notices.length}</p>
                <p className="text-xs text-blue-500 mt-1">all notices</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-red-50 to-rose-50">
              <CardContent className="p-5">
                <p className="text-xs font-medium text-red-600 mb-1">High Priority</p>
                <p className="text-3xl font-bold text-red-700">{notices.filter(n => n.priority === "high").length}</p>
                <p className="text-xs text-red-500 mt-1">urgent notices</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardContent className="p-5">
                <p className="text-xs font-medium text-emerald-600 mb-1">This Week</p>
                <p className="text-3xl font-bold text-emerald-700">{notices.filter(n => new Date(n.createdAt || "").getTime() > Date.now() - 7 * 86400000).length}</p>
                <p className="text-xs text-emerald-500 mt-1">recent notices</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search notices..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
        <div className="flex gap-2">
          {["all", "high", "medium", "low"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Notices */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-6">
                <Skeleton className="h-5 w-2/3 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="size-12 mx-auto mb-4 text-gray-300" />
            <p className="font-medium text-gray-500">No notices found</p>
            <p className="text-gray-400 text-sm mt-1">Post a notice to get started</p>
          </div>
        ) : (
          filtered.map(notice => (
            <Card key={notice._id} className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {notice.priority === "high" && <AlertCircle className="size-4 text-red-500 flex-shrink-0" />}
                      {notice.priority === "medium" && <Info className="size-4 text-blue-500 flex-shrink-0" />}
                      <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                      <Badge className={`text-xs capitalize border-0 ${priorityStyle[notice.priority] ?? "bg-gray-100 text-gray-600"}`}>{notice.priority}</Badge>
                      {notice.branch && <Badge variant="outline" className="text-xs">{notice.branch}</Badge>}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">{notice.content}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>By {notice.authorName}</span>
                      {notice.createdAt && (
                        <>
                          <span>·</span>
                          <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(notice._id)}
                    disabled={deletingId === notice._id}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 disabled:opacity-40"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Post Notice Dialog */}
      <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) setForm(emptyForm); }}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Post New Notice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <Input
                placeholder="Notice title..."
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                placeholder="Notice content..."
                value={form.content}
                onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <Select value={form.priority} onValueChange={v => setForm(p => ({ ...p, priority: v }))}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
                <Select value={form.branch} onValueChange={v => setForm(p => ({ ...p, branch: v }))}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-xs text-gray-500">Posting as: <span className="font-medium text-gray-700">{adminName}</span> (Admin)</p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handlePost} disabled={submitting} className="rounded-xl">
              {submitting ? "Posting..." : "Post Notice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
