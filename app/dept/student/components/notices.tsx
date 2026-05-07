"use client";
import { useState, useEffect } from "react";
import { Bell, Search, Filter, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface Notice {
  _id: string;
  title: string;
  content: string;
  priority: "low" | "medium" | "high" | "urgent";
  authorName: string;
  authorRole: string;
  branch: string;
  createdAt: string;
}

const priorityConfig = {
  urgent: { label: "Urgent", color: "bg-red-100 text-red-700" },
  high: { label: "High", color: "bg-orange-100 text-orange-700" },
  medium: { label: "Medium", color: "bg-blue-100 text-blue-700" },
  low: { label: "Low", color: "bg-gray-100 text-gray-600" },
};

export default function StudentNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await fetch("/api/student/me");
        const me = await meRes.json();
        const branch = me.data?.branch || "";

        const res = await fetch(`/api/dept/notices?branch=${branch}`);
        const data = await res.json();
        if (data.success) setNotices(data.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = notices.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = filterPriority === "all" || n.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Notices</h1>
        <p className="text-gray-500 text-sm">Stay updated with department announcements</p>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notices..." className="pl-10 rounded-xl border-gray-200" />
        </div>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="h-10 px-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20">
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <Bell className="size-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No notices found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((n) => {
            const cfg = priorityConfig[n.priority] || priorityConfig.medium;
            return (
              <Card key={n._id} className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</Badge>
                        {n.branch !== "ALL" && <Badge variant="outline" className="text-xs">{n.branch}</Badge>}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{n.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{n.content}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">By {n.authorName} ({n.authorRole})</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
