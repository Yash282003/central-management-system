"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Plus, Trash2, Send, AlertCircle, AlertTriangle, Info } from "lucide-react";
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

interface Notification {
  _id: string;
  title: string;
  message: string;
  priority: string;
  sentBy: string;
  createdAt: string;
}

const priorityConfig: Record<string, { label: string; badge: string; icon: React.ReactNode }> = {
  urgent: {
    label: "Urgent",
    badge: "bg-red-100 text-red-700",
    icon: <AlertCircle className="size-3" />,
  },
  important: {
    label: "Important",
    badge: "bg-orange-100 text-orange-700",
    icon: <AlertTriangle className="size-3" />,
  },
  normal: {
    label: "Normal",
    badge: "bg-blue-100 text-blue-700",
    icon: <Info className="size-3" />,
  },
};

function PriorityBadge({ priority }: { priority: string }) {
  const cfg = priorityConfig[priority] ?? priorityConfig.normal;
  return (
    <Badge className={`text-xs gap-1 capitalize border-0 ${cfg.badge}`}>
      {cfg.icon}
      {cfg.label}
    </Badge>
  );
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", priority: "normal" });
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/hostel/admin/notifications");
      const data = await res.json();
      if (data.success) setNotifications(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const send = async () => {
    if (!form.title || !form.message) {
      toast.error("Title and message required");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/hostel/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Notification sent");
        setForm({ title: "", message: "", priority: "normal" });
        setOpen(false);
        fetchData();
      } else {
        toast.error("Failed to send");
      }
    } finally {
      setSending(false);
    }
  };

  const del = async (id: string) => {
    setDeletingId(id);
    try {
      await fetch(`/api/hostel/admin/notifications?id=${id}`, { method: "DELETE" });
      toast.success("Notification deleted");
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Notifications</h1>
          <p className="text-gray-500 text-sm">Send announcements to all hostel students</p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2"
        >
          <Plus className="size-4" />
          Send Notification
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))
        ) : (
          <>
            <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardContent className="p-5">
                <p className="text-xs font-medium text-emerald-600 mb-1">Total Sent</p>
                <p className="text-3xl font-bold text-emerald-700">{notifications.length}</p>
                <p className="text-xs text-emerald-500 mt-1">notifications</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-red-50 to-rose-50">
              <CardContent className="p-5">
                <p className="text-xs font-medium text-red-600 mb-1">Urgent</p>
                <p className="text-3xl font-bold text-red-700">
                  {notifications.filter((n) => n.priority === "urgent").length}
                </p>
                <p className="text-xs text-red-500 mt-1">high priority</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-5">
                <p className="text-xs font-medium text-blue-600 mb-1">This Week</p>
                <p className="text-3xl font-bold text-blue-700">
                  {
                    notifications.filter(
                      (n) => new Date(n.createdAt).getTime() > Date.now() - 7 * 86400000
                    ).length
                  }
                </p>
                <p className="text-xs text-blue-500 mt-1">sent recently</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-20 text-center">
          <Bell className="size-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No notifications sent yet</p>
          <p className="text-gray-400 text-sm mt-1">Send your first notification to students</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <Card key={n._id} className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="size-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bell className="size-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-semibold text-gray-900">{n.title}</p>
                        <PriorityBadge priority={n.priority} />
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Sent by {n.sentBy} ·{" "}
                        {new Date(n.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => del(n._id)}
                    disabled={deletingId === n._id}
                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 disabled:opacity-40"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Send Dialog */}
      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setForm({ title: "", message: "", priority: "normal" }); }}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Send Notification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <Input
                placeholder="Notification title..."
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
              <textarea
                placeholder="Notification message..."
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <Select
                value={form.priority}
                onValueChange={(v) => setForm((f) => ({ ...f, priority: v }))}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={send}
              disabled={sending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2"
            >
              <Send className="size-4" />
              {sending ? "Sending..." : "Send to All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
