"use client";

import { useEffect, useState } from "react";
import { Bell, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Notification {
  title: string;
  message: string;
  priority: string;
  sentBy: string;
  createdAt: string;
}

function PriorityBadge({ priority }: { priority: string }) {
  if (priority === "urgent") {
    return (
      <Badge className="bg-red-100 text-red-700 border-red-200 gap-1" variant="outline">
        <AlertCircle className="size-3" />
        Urgent
      </Badge>
    );
  }
  if (priority === "important") {
    return (
      <Badge className="bg-amber-100 text-amber-700 border-amber-200 gap-1" variant="outline">
        <AlertTriangle className="size-3" />
        Important
      </Badge>
    );
  }
  return (
    <Badge className="bg-green-100 text-green-700 border-green-200 gap-1" variant="outline">
      <Info className="size-3" />
      Normal
    </Badge>
  );
}

function priorityIconBg(priority: string) {
  if (priority === "urgent") return "bg-red-100";
  if (priority === "important") return "bg-amber-100";
  return "bg-green-100";
}

function priorityIconColor(priority: string) {
  if (priority === "urgent") return "text-red-600";
  if (priority === "important") return "text-amber-600";
  return "text-green-600";
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/hostel/student/notifications");
        const data = await res.json();
        setNotifications(Array.isArray(data.data) ? data.data : []);
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Notifications</h1>
        <p className="text-slate-500 mt-1">
          Announcements and alerts from hostel management
        </p>
      </div>

      {/* Count summary */}
      {notifications.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          <div className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">{notifications.length}</span>{" "}
            total notifications
          </div>
          {["urgent", "important", "normal"].map((p) => {
            const count = notifications.filter((n) => (n.priority || "normal") === p).length;
            if (!count) return null;
            return (
              <PriorityBadge key={p} priority={p} />
            );
          })}
        </div>
      )}

      {/* Notification list */}
      {notifications.length === 0 ? (
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="py-20 text-center">
            <Bell className="size-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No notifications yet</p>
            <p className="text-sm text-slate-400 mt-1">
              You'll see hostel announcements and alerts here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((n, idx) => {
            const priority = n.priority || "normal";
            return (
              <Card
                key={idx}
                className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`size-10 rounded-xl flex items-center justify-center flex-shrink-0 ${priorityIconBg(priority)}`}
                    >
                      <Bell className={`size-5 ${priorityIconColor(priority)}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <p className="font-semibold text-slate-900">{n.title}</p>
                        <PriorityBadge priority={priority} />
                      </div>

                      <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                        {n.message}
                      </p>

                      <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                        <span>
                          By{" "}
                          <span className="font-medium text-slate-500">
                            {n.sentBy}
                          </span>
                        </span>
                        <span>·</span>
                        <span>
                          {new Date(n.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span>·</span>
                        <span>
                          {new Date(n.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
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
