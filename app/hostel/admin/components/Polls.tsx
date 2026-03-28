"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart3, Plus, ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";

export default function AdminPolls() {
  const [question, setQuestion] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const polls = [
    {
      id: 1,
      question: "Special feast this weekend?",
      yesVotes: 187,
      noVotes: 45,
      totalVotes: 232,
      status: "Active",
      createdAt: "March 17, 2026",
    },
    {
      id: 2,
      question: "Prefer non-veg menu twice a week?",
      yesVotes: 156,
      noVotes: 89,
      totalVotes: 245,
      status: "Active",
      createdAt: "March 15, 2026",
    },
    {
      id: 3,
      question: "Extend library hours till 2 AM?",
      yesVotes: 198,
      noVotes: 34,
      totalVotes: 232,
      status: "Closed",
      createdAt: "March 10, 2026",
    },
  ];

  const handleCreatePoll = () => {
    if (!question.trim()) {
      toast.error("Please enter a poll question");
      return;
    }
    toast.success("Poll created successfully");
    setQuestion("");
    setIsDialogOpen(false);
  };

  const handleClosePoll = (id: number) => {
    toast.success("Poll closed");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Polls</h1>
          <p className="text-slate-600 mt-1">Create and manage Yes/No polls for students</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Poll
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Poll</DialogTitle>
              <DialogDescription>
                Ask a yes/no question to all students
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="question">Poll Question *</Label>
                <Input
                  id="question"
                  placeholder="e.g., Special feast this weekend?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreatePoll} className="flex-1">
                  Create Poll
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {polls.map((poll) => {
          const yesPercentage = (poll.yesVotes / poll.totalVotes) * 100;
          const noPercentage = (poll.noVotes / poll.totalVotes) * 100;

          return (
            <Card key={poll.id} className="border-slate-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      {poll.question}
                      <span className={`text-xs px-2.5 py-1 rounded-full ${
                        poll.status === "Active" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-slate-100 text-slate-700"
                      }`}>
                        {poll.status}
                      </span>
                    </CardTitle>
                    <p className="text-xs text-slate-500 mt-1">Created: {poll.createdAt}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {/* Yes Vote */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center text-sm font-medium text-green-700">
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Yes
                      </div>
                      <span className="text-sm text-slate-600">
                        {poll.yesVotes} votes ({yesPercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all"
                        style={{ width: `${yesPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* No Vote */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center text-sm font-medium text-red-700">
                        <ThumbsDown className="w-4 h-4 mr-2" />
                        No
                      </div>
                      <span className="text-sm text-slate-600">
                        {poll.noVotes} votes ({noPercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div
                        className="bg-red-500 h-3 rounded-full transition-all"
                        style={{ width: `${noPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <p className="text-sm text-slate-600">Total Votes: {poll.totalVotes}</p>
                  {poll.status === "Active" && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleClosePoll(poll.id)}
                    >
                      Close Poll
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {polls.length === 0 && (
          <Card className="border-slate-200">
            <CardContent className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600">No polls created yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
