"use client";
import { useState, useEffect } from "react";
import { Send, Bell, CheckCircle2, AlertCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BRANCHES = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"];
const STATUSES = ["UNPLACED", "PLACED", "INELIGIBLE"];
const PRIORITIES = ["low", "medium", "high"];

type Notice = {
  _id: string;
  title: string;
  content: string;
  priority: string;
  targetBranches: string[];
  targetStatus: string[];
  companyName?: string;
  expiresAt: string | null;
  createdAt: string;
};

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${
        selected
          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
          : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
      }`}
    >
      {label}
    </button>
  );
}

const priorityStyles: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-red-100 text-red-700",
};

export default function OfficerNotifications() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    priority: "medium",
    allBranches: true,
    branches: [] as string[],
    allStatus: true,
    statuses: [] as string[],
    expiresAt: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loadingNotices, setLoadingNotices] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  async function fetchNotices() {
    setLoadingNotices(true);
    try {
      const res = await fetch("/api/tnp/notices");
      const json = await res.json();
      if (json.success) setNotices(json.data ?? []);
    } finally {
      setLoadingNotices(false);
    }
  }

  function toggleBranch(b: string) {
    setForm((prev) => ({
      ...prev,
      allBranches: false,
      branches: prev.branches.includes(b)
        ? prev.branches.filter((x) => x !== b)
        : [...prev.branches, b],
    }));
  }

  function toggleStatus(s: string) {
    setForm((prev) => ({
      ...prev,
      allStatus: false,
      statuses: prev.statuses.includes(s)
        ? prev.statuses.filter((x) => x !== s)
        : [...prev.statuses, s],
    }));
  }

  async function handleSend() {
    setResult(null);
    if (!form.title.trim() || !form.content.trim()) {
      setResult({ ok: false, msg: "Title and message are required." });
      return;
    }
    if (!form.allBranches && form.branches.length === 0) {
      setResult({ ok: false, msg: "Select at least one branch." });
      return;
    }
    if (!form.allStatus && form.statuses.length === 0) {
      setResult({ ok: false, msg: "Select at least one student status." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/tnp/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          content: form.content.trim(),
          priority: form.priority,
          authorName: "TnP Officer",
          targetBranches: form.allBranches ? ["ALL"] : form.branches,
          targetStatus: form.allStatus ? ["ALL"] : form.statuses,
          expiresAt: form.expiresAt || null,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setResult({ ok: false, msg: json.message || "Failed to send." });
      } else {
        setResult({ ok: true, msg: "Announcement sent to students!" });
        setForm({
          title: "",
          content: "",
          priority: "medium",
          allBranches: true,
          branches: [],
          allStatus: true,
          statuses: [],
          expiresAt: "",
        });
        fetchNotices();
      }
    } catch {
      setResult({ ok: false, msg: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Notifications & Announcements</h1>
        <p className="text-gray-600 mt-1">Send announcements directly to students</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Compose Form */}
        <Card className="border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="w-4 h-4 text-indigo-600" />
              Send Announcement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600">Title *</label>
              <Input
                className="mt-1"
                placeholder="e.g. Amazon Drive — Registration Open"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">Message *</label>
              <Textarea
                className="mt-1"
                placeholder="Write the announcement details..."
                rows={4}
                value={form.content}
                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-2">Priority</label>
              <div className="flex gap-2">
                {PRIORITIES.map((p) => (
                  <Chip
                    key={p}
                    label={p.charAt(0).toUpperCase() + p.slice(1)}
                    selected={form.priority === p}
                    onClick={() => setForm((prev) => ({ ...prev, priority: p }))}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-2">Target Branches</label>
              <div className="flex flex-wrap gap-2">
                <Chip
                  label="All Branches"
                  selected={form.allBranches}
                  onClick={() => setForm((p) => ({ ...p, allBranches: true, branches: [] }))}
                />
                {BRANCHES.map((b) => (
                  <Chip
                    key={b}
                    label={b}
                    selected={!form.allBranches && form.branches.includes(b)}
                    onClick={() => toggleBranch(b)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-2">Target Students</label>
              <div className="flex flex-wrap gap-2">
                <Chip
                  label="All Students"
                  selected={form.allStatus}
                  onClick={() => setForm((p) => ({ ...p, allStatus: true, statuses: [] }))}
                />
                {STATUSES.map((s) => (
                  <Chip
                    key={s}
                    label={s.charAt(0) + s.slice(1).toLowerCase()}
                    selected={!form.allStatus && form.statuses.includes(s)}
                    onClick={() => toggleStatus(s)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">Expiry Date (optional)</label>
              <Input
                className="mt-1"
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm((p) => ({ ...p, expiresAt: e.target.value }))}
              />
            </div>

            {result && (
              <div
                className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2.5 border ${
                  result.ok
                    ? "bg-green-50 border-green-100 text-green-700"
                    : "bg-red-50 border-red-100 text-red-600"
                }`}
              >
                {result.ok ? (
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                )}
                {result.msg}
              </div>
            )}

            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleSend}
              disabled={submitting}
            >
              <Send className="w-4 h-4 mr-2" />
              {submitting ? "Sending…" : "Send Announcement"}
            </Button>
          </CardContent>
        </Card>

        {/* Sent History */}
        <Card className="border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <CardTitle className="text-base">Sent Notices</CardTitle>
              {!loadingNotices && (
                <Badge className="ml-auto bg-indigo-50 text-indigo-600 border border-indigo-100 font-medium">
                  {notices.length}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loadingNotices && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            )}

            {!loadingNotices && notices.length === 0 && (
              <div className="py-14 text-center text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">No announcements yet</p>
                <p className="text-xs mt-1">Send one using the form on the left.</p>
              </div>
            )}

            {!loadingNotices && notices.length > 0 && (
              <div className="space-y-2 max-h-[540px] overflow-y-auto pr-0.5">
                {notices.map((n) => {
                  const isExpanded = expandedId === n._id;
                  const expired = n.expiresAt && new Date(n.expiresAt) < new Date();
                  return (
                    <div
                      key={n._id}
                      className="border border-gray-100 rounded-lg hover:border-indigo-200 transition-colors"
                    >
                      <button
                        type="button"
                        className="w-full text-left p-3"
                        onClick={() => setExpandedId(isExpanded ? null : n._id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-medium text-gray-900 text-sm truncate">{n.title}</p>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                  priorityStyles[n.priority] ?? priorityStyles.medium
                                }`}
                              >
                                {n.priority}
                              </span>
                              {expired && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-500">
                                  expired
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {(n.targetBranches ?? []).map((b) => (
                                <span
                                  key={b}
                                  className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-medium"
                                >
                                  {b}
                                </span>
                              ))}
                              {(n.targetStatus ?? []).map((s) => (
                                <span
                                  key={s}
                                  className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium"
                                >
                                  {s.toLowerCase()}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <p className="text-[10px] text-gray-400">
                              {new Date(n.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })}
                            </p>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-3 pb-3 border-t border-gray-100 mt-0 pt-2">
                          <p className="text-xs text-gray-600 leading-relaxed">{n.content}</p>
                          {n.expiresAt && (
                            <p className="text-[10px] text-gray-400 mt-1.5">
                              Expires:{" "}
                              {new Date(n.expiresAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
