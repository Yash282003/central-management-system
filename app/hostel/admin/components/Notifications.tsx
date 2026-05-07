"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Plus, Trash2, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Notification {
  _id: string;
  title: string;
  message: string;
  priority: string;
  sentBy: string;
  createdAt: string;
}

const priorityColor = (p: string) => {
  if (p === "urgent") return "bg-red-100 text-red-700";
  if (p === "important") return "bg-amber-100 text-amber-700";
  return "bg-blue-100 text-blue-700";
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", priority: "normal" });
  const [sending, setSending] = useState(false);

  const fetchData = async () => {
    const res = await fetch("/api/hostel/admin/notifications");
    const data = await res.json();
    if (data.success) setNotifications(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const send = async () => {
    if (!form.title || !form.message) { toast.error("Title and message required"); return; }
    setSending(true);
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
    } else toast.error("Failed to send");
    setSending(false);
  };

  const del = async (id: string) => {
    await fetch(`/api/hostel/admin/notifications?id=${id}`, { method: "DELETE" });
    toast.success("Deleted");
    fetchData();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Notifications</h1>
          <p className="text-gray-500 text-sm">Send announcements to all hostel students</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl"><Plus className="size-4 mr-1" /> Send Notification</Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader><DialogTitle>Send Notification</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <Input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="rounded-xl" />
              <textarea placeholder="Message..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="w-full h-24 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 resize-none" />
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none">
                <option value="normal">Normal</option>
                <option value="important">Important</option>
                <option value="urgent">Urgent</option>
              </select>
              <Button onClick={send} disabled={sending} className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl">
                <Send className="size-4 mr-2" />{sending ? "Sending..." : "Send to All"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {loading ? (
        <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      ) : notifications.length === 0 ? (
        <div className="py-20 text-center"><Bell className="size-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No notifications sent yet</p></div>
      ) : (
        <div className="space-y-4">
          {notifications.map(n => (
            <Card key={n._id} className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{n.title}</p>
                      <Badge className={`text-xs capitalize ${priorityColor(n.priority)}`}>{n.priority}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-2">Sent by {n.sentBy} · {new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => del(n._id)} className="text-gray-300 hover:text-red-400 transition-colors">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
