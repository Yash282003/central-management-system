"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, X, AlertTriangle, Info, Megaphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Notice = {
  _id: string;
  title: string;
  content: string;
  priority: "low" | "medium" | "high" | "urgent";
  companyName?: string | null;
  expiresAt?: string | null;
  createdAt: string;
};

const priorityStyles: Record<string, string> = {
  low: "bg-gray-100 text-gray-700 border-gray-200",
  medium: "bg-blue-100 text-blue-700 border-blue-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  urgent: "bg-red-100 text-red-700 border-red-200",
};

const priorityIcon = (p: string) => {
  if (p === "urgent" || p === "high")
    return <AlertTriangle className="w-4 h-4" />;
  if (p === "medium") return <Megaphone className="w-4 h-4" />;
  return <Info className="w-4 h-4" />;
};

type Props = {
  /** If true, hides the floating 10-second badge (use on the Notifications page). */
  hideBadge?: boolean;
};

export default function TnpNoticesPanel({ hideBadge = false }: Props) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [unseen, setUnseen] = useState<string[]>([]);
  const [showBadge, setShowBadge] = useState(false);
  const [loading, setLoading] = useState(true);
  const dismissed = useRef(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/student/tnp-notices", {
          credentials: "include",
        });
        const json = await res.json();
        if (cancelled) return;
        if (json?.success) {
          setNotices(json.data ?? []);
          setUnseen(json.unseenIds ?? []);
          if (!hideBadge && (json.unseenIds ?? []).length > 0) {
            setShowBadge(true);
          }
        }
      } catch {
        /* silent */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hideBadge]);

  // 10-second badge auto-dismiss + mark-as-seen
  useEffect(() => {
    if (!showBadge || unseen.length === 0) return;
    const timer = setTimeout(() => {
      if (dismissed.current) return;
      dismissed.current = true;
      setShowBadge(false);
      fetch("/api/student/tnp-notices/seen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ids: unseen }),
      }).catch(() => {});
    }, 10000);
    return () => clearTimeout(timer);
  }, [showBadge, unseen]);

  const dismissBadge = () => {
    if (dismissed.current) return;
    dismissed.current = true;
    setShowBadge(false);
    if (unseen.length > 0) {
      fetch("/api/student/tnp-notices/seen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ids: unseen }),
      }).catch(() => {});
    }
  };

  if (loading) return null;
  if (notices.length === 0) return null;

  const unseenSet = new Set(unseen);

  return (
    <>
      {/* Floating 10s badge */}
      {showBadge && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3 bg-indigo-600 text-white shadow-lg rounded-xl px-4 py-3 border border-indigo-500">
            <Bell className="w-5 h-5" />
            <div className="text-sm">
              <p className="font-semibold leading-tight">
                {unseen.length} new placement notice{unseen.length > 1 ? "s" : ""}
              </p>
              <p className="text-xs text-indigo-100">From your TnP officer</p>
            </div>
            <button
              onClick={dismissBadge}
              className="ml-2 text-indigo-100 hover:text-white"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Notices block */}
      <Card className="border-indigo-100">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Placement Notices
            </h3>
            <Badge className="ml-1 bg-indigo-100 text-indigo-700 border-0 text-xs">
              {notices.length}
            </Badge>
          </div>

          <div className="space-y-3">
            {notices.map((n) => {
              const isNew = unseenSet.has(n._id);
              return (
                <div
                  key={n._id}
                  className={`rounded-lg border p-4 transition ${
                    isNew
                      ? "bg-indigo-50/40 border-indigo-200"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 min-w-0">
                      <span className="text-indigo-600 mt-0.5">
                        {priorityIcon(n.priority)}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {n.title}
                        </p>
                        {n.companyName && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {n.companyName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isNew && (
                        <span className="text-[10px] uppercase tracking-wide bg-indigo-600 text-white px-1.5 py-0.5 rounded">
                          New
                        </span>
                      )}
                      <Badge
                        className={`text-[10px] border ${priorityStyles[n.priority]}`}
                      >
                        {n.priority}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                    {n.content}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span>
                      Posted{" "}
                      {new Date(n.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    {n.expiresAt && (
                      <span>
                        Expires{" "}
                        {new Date(n.expiresAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
