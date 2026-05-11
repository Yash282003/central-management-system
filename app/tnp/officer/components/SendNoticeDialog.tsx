"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL_BRANCHES = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"];
const STATUSES = ["UNPLACED", "PLACED", "INELIGIBLE"];
const PRIORITIES = ["low", "medium", "high", "urgent"];

type Company = {
  _id: string;
  company: string;
  role: string;
  eligibleBranches: string[];
  driveDate: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company | null;
};

export default function SendNoticeDialog({ open, onOpenChange, company }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("medium");
  const [branches, setBranches] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>(["UNPLACED"]);
  const [expiresAt, setExpiresAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Reset / prefill whenever a new company is selected
  useEffect(() => {
    if (!open) return;
    if (company) {
      setTitle(`${company.company} — ${company.role}`);
      setBranches(company.eligibleBranches ?? []);
      setExpiresAt(
        company.driveDate
          ? new Date(company.driveDate).toISOString().slice(0, 10)
          : ""
      );
    } else {
      setTitle("");
      setBranches([]);
      setExpiresAt("");
    }
    setContent("");
    setPriority("medium");
    setStatuses(["UNPLACED"]);
    setError("");
    setSuccess("");
  }, [open, company]);

  const toggleBranch = (b: string) =>
    setBranches((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );

  const toggleStatus = (s: string) =>
    setStatuses((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/tnp/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          priority,
          companyId: company?._id ?? null,
          targetBranches: branches.length ? branches : ["ALL"],
          targetStatus: statuses.length ? statuses : ["ALL"],
          authorName: "TnP Officer",
          expiresAt: expiresAt || null,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to send notice.");
      } else {
        setSuccess("Notice sent successfully.");
        setTimeout(() => onOpenChange(false), 800);
      }
    } catch (e: any) {
      setError(e?.message || "Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Send Notice {company ? `— ${company.company}` : ""}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notice title"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your message to students…"
              className="mt-1 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Priority</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="mt-1 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white text-black">
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p[0].toUpperCase() + p.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">
                Expires On (optional)
              </label>
              <Input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">
              Target Branches{" "}
              <span className="text-gray-400">(none = all)</span>
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {ALL_BRANCHES.map((b) => {
                const active = branches.includes(b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleBranch(b)}
                    className={`px-2.5 py-1 rounded-full text-xs border transition ${
                      active
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-indigo-300"
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">
              Target Status
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {STATUSES.map((s) => {
                const active = statuses.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleStatus(s)}
                    className={`px-2.5 py-1 rounded-full text-xs border transition ${
                      active
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-indigo-300"
                    }`}
                  >
                    {s[0] + s.slice(1).toLowerCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-xs text-green-700 bg-green-50 border border-green-100 rounded px-3 py-2">
              {success}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {submitting ? "Sending…" : "Send Notice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
