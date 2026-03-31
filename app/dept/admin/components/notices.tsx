"use client"
import { useState } from "react";
import { Plus, Bell, AlertCircle, Info, Pencil, Trash2, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notices } from "../../data/mockdata";

const priorityColor = {
  high: "destructive" as const,
  medium: "default" as const,
  low: "outline" as const,
};

export default function AdminNotices() {
  const [noticeList, setNoticeList] = useState(notices);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", priority: "medium" });

  const filtered = noticeList.filter(n => {
    const matchFilter = filter === "all" || n.priority === filter;
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleCreate = () => {
    if (!form.title.trim()) return;
    setNoticeList(prev => [{
      id: Date.now(),
      title: form.title,
      content: form.content,
      date: new Date().toISOString().split("T")[0],
      priority: form.priority as "high" | "medium" | "low",
      author: "Admin Office",
    }, ...prev]);
    setShowModal(false);
    setForm({ title: "", content: "", priority: "medium" });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Notice Management</h1>
          <p className="text-gray-600">Create and manage official department notices</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus className="size-4" />
          New Notice
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Notices", value: noticeList.length, color: "text-gray-900" },
          { label: "High Priority", value: noticeList.filter(n => n.priority === "high").length, color: "text-red-600" },
          { label: "This Week", value: noticeList.filter(n => new Date(n.date) > new Date(Date.now() - 7 * 86400000)).length, color: "text-blue-600" },
        ].map(item => (
          <Card key={item.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-sm text-gray-500 mt-1">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notices..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 h-10 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {["all", "high", "medium", "low"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Notices */}
      <div className="space-y-4">
        {filtered.map(notice => (
          <Card key={notice.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {notice.priority === "high" && <AlertCircle className="size-4 text-red-500 flex-shrink-0" />}
                    {notice.priority === "medium" && <Info className="size-4 text-blue-500 flex-shrink-0" />}
                    <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                    <Badge variant={priorityColor[notice.priority as keyof typeof priorityColor]} className="text-xs">{notice.priority}</Badge>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{notice.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>By {notice.author}</span>
                    <span>·</span>
                    <span>{notice.date}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Pencil className="size-4" />
                  </button>
                  <button
                    onClick={() => setNoticeList(prev => prev.filter(n => n.id !== notice.id))}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Bell className="size-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No notices found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Post New Notice</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Notice title..." className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={4} placeholder="Notice content..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreate} className="flex-1 h-10 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Post Notice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
