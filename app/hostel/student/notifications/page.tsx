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

const priorityConfig: Record<string, { label: string; badge: string; iconBg: string; iconColor: string; icon: React.ElementType }> = {
  urgent: {
    label: "Urgent",
    badge: "bg-red-100 text-red-700",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    icon: AlertCircle,
  },
  important: {
    label: "Important",
    badge: "bg-orange-100 text-orange-700",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    icon: AlertTriangle,
  },
  normal: {
    label: "Normal",
    badge: "bg-emerald-100 text-emerald-700",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    icon: Info,
  },
};

function PriorityBadge({ priority }: { priority: string }) {
  const cfg = priorityConfig[priority] ?? priorityConfig.normal;
  const Icon = cfg.icon;
  return (
    <Badge className={`text-xs gap-1 border-0 ${cfg.badge}`}>
      <Icon className="size-3" />
      {cfg.label}
    </Badge>
  );
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
      <div className="p-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Notifications</h1>
        <p className="text-gray-500 text-sm">Announcements and alerts from hostel management</p>
      </div>

      {/* Summary badges */}
      {notifications.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap mb-6">
          <span className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{notifications.length}</span> total
          </span>
          {["urgent", "important", "normal"].map((p) => {
            const count = notifications.filter((n) => (n.priority || "normal") === p).length;
            if (!count) return null;
            return (
              <span key={p} className={`text-xs px-2.5 py-1 rounded-full font-medium ${priorityConfig[p].badge}`}>
                {count} {priorityConfig[p].label}
              </span>
            );
          })}
        </div>
      )}

      {notifications.length === 0 ? (
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="py-20 text-center">
            <Bell className="size-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No notifications yet</p>
            <p className="text-sm text-gray-400 mt-1">
              You'll see hostel announcements and alerts here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((n, idx) => {
            const priority = n.priority || "normal";
            const cfg = priorityConfig[priority] ?? priorityConfig.normal;
            const Icon = cfg.icon;
            return (
              <Card
                key={idx}
                className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`size-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.iconBg}`}>
                      <Icon className={`size-5 ${cfg.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap mb-1.5">
                        <p className="font-semibold text-gray-900">{n.title}</p>
                        <PriorityBadge priority={priority} />
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{n.message}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                        <span>
                          By <span className="font-medium text-gray-500">{n.sentBy}</span>
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
