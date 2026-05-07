"use client";
import { useState } from "react";
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

interface Poll {
  id: number;
  question: string;
  yesVotes: number;
  noVotes: number;
  totalVotes: number;
  status: "Active" | "Closed";
  createdAt: string;
}

export default function AdminPolls() {
  const [question, setQuestion] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const [polls, setPolls] = useState<Poll[]>([
    { id: 1, question: "Special feast this weekend?", yesVotes: 187, noVotes: 45, totalVotes: 232, status: "Active", createdAt: "March 17, 2026" },
    { id: 2, question: "Prefer non-veg menu twice a week?", yesVotes: 156, noVotes: 89, totalVotes: 245, status: "Active", createdAt: "March 15, 2026" },
    { id: 3, question: "Extend library hours till 2 AM?", yesVotes: 198, noVotes: 34, totalVotes: 232, status: "Closed", createdAt: "March 10, 2026" },
  ]);

  const handleCreatePoll = () => {
    if (!question.trim()) {
      toast.error("Please enter a poll question");
      return;
    }
    const newPoll: Poll = {
      id: Date.now(),
      question,
      yesVotes: 0,
      noVotes: 0,
      totalVotes: 0,
      status: "Active",
      createdAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
    };
    setPolls((prev) => [newPoll, ...prev]);
    setQuestion("");
    setIsDialogOpen(false);
    toast.success("Poll created successfully");
  };

  const handleClosePoll = (id: number) => {
    setPolls((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Closed" } : p)));
    toast.success("Poll closed");
  };

  const filtered = polls.filter((p) => {
    if (statusFilter === "active") return p.status === "Active";
    if (statusFilter === "closed") return p.status === "Closed";
    return true;
  });

  const activeCount = polls.filter((p) => p.status === "Active").length;
  const totalVotes = polls.reduce((s, p) => s + p.totalVotes, 0);

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
            const yesPercentage = poll.totalVotes > 0 ? (poll.yesVotes / poll.totalVotes) * 100 : 0;
            const noPercentage = poll.totalVotes > 0 ? (poll.noVotes / poll.totalVotes) * 100 : 0;
            const isActive = poll.status === "Active";

            return (
              <Card
                key={poll.id}
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
                        <p className="text-xs text-gray-400 mt-0.5">Created: {poll.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge
                        className={`text-xs border-0 ${
                          isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {poll.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {/* Yes */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                          <ThumbsUp className="size-3.5" />
                          Yes
                        </div>
                        <span className="text-sm text-gray-500">
                          {poll.yesVotes} votes ({yesPercentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${yesPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* No */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-red-600">
                          <ThumbsDown className="size-3.5" />
                          No
                        </div>
                        <span className="text-sm text-gray-500">
                          {poll.noVotes} votes ({noPercentage.toFixed(1)}%)
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
                      <span className="font-semibold text-gray-900">{poll.totalVotes}</span> total votes
                    </p>
                    {isActive && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleClosePoll(poll.id)}
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

      {/* Create Poll Dialog */}
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
            >
              Create Poll
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
