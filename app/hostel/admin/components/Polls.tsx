"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { BarChart3, Plus, ThumbsUp, ThumbsDown, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface PollOption {
  text: string;
  votes: string[];
}

interface Poll {
  _id: string;
  question: string;
  options: PollOption[];
  active: boolean;
  createdAt: string;
  closedAt?: string;
}

export default function AdminPolls() {
  const [question, setQuestion] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [polls, setPolls] = useState<Poll[]>([]);
  const [submitting, setSubmitting] = useState(false);

  async function loadPolls() {
    try {
      const res = await fetch("/api/hostel/admin/polls");
      const json = await res.json();
      if (json.success) setPolls(json.data ?? []);
    } catch {}
  }
  useEffect(() => { loadPolls(); }, []);

  const handleCreatePoll = async () => {
    if (!question.trim()) {
      toast.error("Please enter a poll question");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/hostel/admin/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim(), options: ["Yes", "No"] }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.message || "Failed to create poll");
      } else {
        toast.success("Poll created successfully");
        setQuestion("");
        setIsDialogOpen(false);
        loadPolls();
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClosePoll = async (id: string) => {
    try {
      const res = await fetch(`/api/hostel/admin/polls?id=${id}&action=toggle`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Poll closed");
        loadPolls();
      } else {
        toast.error(json.message || "Failed");
      }
    } catch { toast.error("Network error"); }
  };

  const filtered = polls.filter((p) => {
    if (statusFilter === "active") return p.active;
    if (statusFilter === "closed") return !p.active;
    return true;
  });

  const activeCount = polls.filter((p) => p.active).length;
  const totalVotes = polls.reduce(
    (s, p) => s + (p.options ?? []).reduce((ss, o) => ss + (o.votes?.length ?? 0), 0),
    0
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Polls</h1>
          <p className="text-gray-500 text-sm">Create and manage Yes/No polls for hostel students</p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2"
        >
          <Plus className="size-4" />
          Create Poll
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-emerald-600 mb-1">Active Polls</p>
            <p className="text-3xl font-bold text-emerald-700">{activeCount}</p>
            <p className="text-xs text-emerald-500 mt-1">currently running</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-blue-600 mb-1">Total Polls</p>
            <p className="text-3xl font-bold text-blue-700">{polls.length}</p>
            <p className="text-xs text-blue-500 mt-1">all time</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-violet-50 to-purple-50">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-violet-600 mb-1">Total Votes</p>
            <p className="text-3xl font-bold text-violet-700">{totalVotes.toLocaleString()}</p>
            <p className="text-xs text-violet-500 mt-1">across all polls</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "all", label: "All" },
          { key: "active", label: "Active" },
          { key: "closed", label: "Closed" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === key
                ? "bg-emerald-600 text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Polls List */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <BarChart3 className="size-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No polls found</p>
          <p className="text-gray-400 text-sm mt-1">Create a poll to gather student opinions</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((poll) => {
            const yesOpt = poll.options?.find((o) => o.text.toLowerCase() === "yes");
            const noOpt = poll.options?.find((o) => o.text.toLowerCase() === "no");
            const yesVotes = yesOpt?.votes?.length ?? 0;
            const noVotes = noOpt?.votes?.length ?? 0;
            const totalVotes = yesVotes + noVotes;
            const yesPercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;
            const noPercentage = totalVotes > 0 ? (noVotes / totalVotes) * 100 : 0;

            return (
              <Card
                key={poll._id}
                className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="size-9 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <BarChart3 className="size-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{poll.question}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Created: {new Date(poll.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={`text-xs border-0 flex-shrink-0 ${
                        poll.active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {poll.active ? "Active" : "Closed"}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                          <ThumbsUp className="size-3.5" />
                          Yes
                        </div>
                        <span className="text-sm text-gray-500">
                          {yesVotes} votes ({yesPercentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${yesPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-red-600">
                          <ThumbsDown className="size-3.5" />
                          No
                        </div>
                        <span className="text-sm text-gray-500">
                          {noVotes} votes ({noPercentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-400 rounded-full transition-all duration-500"
                          style={{ width: `${noPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold text-gray-900">{totalVotes}</span> total votes
                    </p>
                    {poll.active && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleClosePoll(poll._id)}
                        className="rounded-lg gap-1.5 text-xs"
                      >
                        <CheckCircle className="size-3.5" />
                        Close Poll
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={(o) => { setIsDialogOpen(o); if (!o) setQuestion(""); }}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Create New Poll</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium text-gray-700">Poll Question *</Label>
              <Input
                className="rounded-xl mt-1"
                placeholder="e.g., Special feast this weekend?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreatePoll()}
              />
              <p className="text-xs text-gray-400 mt-1">
                Students will be able to vote Yes or No
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleCreatePoll}
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
            >
              {submitting ? "Creating…" : "Create Poll"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
