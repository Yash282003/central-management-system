"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Vote, CheckCircle2, Lock } from "lucide-react";

type Poll = {
  _id: string;
  question: string;
  active: boolean;
  createdBy?: string;
  createdAt: string;
  options: { text: string; count: number }[];
  total: number;
  votedIndex: number;
};

export default function StudentHostelPolls() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/hostel/student/polls", { credentials: "include" });
      const json = await res.json();
      if (json.success) setPolls(json.data ?? []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function vote(pollId: string, optionIndex: number) {
    setVoting(pollId);
    try {
      const res = await fetch("/api/hostel/student/polls/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ pollId, optionIndex }),
      });
      if (res.ok) await load();
    } finally {
      setVoting(null);
    }
  }

  const active = polls.filter((p) => p.active);
  const closed = polls.filter((p) => !p.active);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Hostel Polls</h1>
        <p className="text-slate-500 text-sm mt-1">Cast your vote on hostel matters</p>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {!loading && polls.length === 0 && (
        <Card className="border-slate-200">
          <CardContent className="py-14 text-center text-slate-400">
            <Vote className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No polls right now</p>
            <p className="text-xs mt-1">The hostel admin hasn&apos;t opened any polls yet.</p>
          </CardContent>
        </Card>
      )}

      {!loading && active.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">Active</h2>
          <div className="space-y-3">
            {active.map((p) => <PollCard key={p._id} poll={p} onVote={vote} disabled={voting === p._id} />)}
          </div>
        </div>
      )}

      {!loading && closed.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3 mt-6">Closed</h2>
          <div className="space-y-3">
            {closed.map((p) => <PollCard key={p._id} poll={p} onVote={vote} disabled />)}
          </div>
        </div>
      )}
    </div>
  );
}

function PollCard({ poll, onVote, disabled }: { poll: Poll; onVote: (id: string, idx: number) => void; disabled: boolean }) {
  const hasVoted = poll.votedIndex >= 0;
  const showResults = hasVoted || !poll.active;

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base leading-snug">{poll.question}</CardTitle>
          {poll.active
            ? <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 flex-shrink-0">Open</Badge>
            : <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 flex-shrink-0 inline-flex items-center gap-1"><Lock className="w-3 h-3" />Closed</Badge>}
        </div>
        <p className="text-xs text-slate-400">
          {poll.total} {poll.total === 1 ? "vote" : "votes"}
          {poll.createdBy && ` · by ${poll.createdBy}`}
        </p>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {poll.options.map((opt, idx) => {
          const pct = poll.total > 0 ? Math.round((opt.count / poll.total) * 100) : 0;
          const isMyVote = idx === poll.votedIndex;
          if (showResults) {
            return (
              <div key={idx} className="relative">
                <div className="relative z-10 px-4 py-2.5 flex items-center justify-between text-sm">
                  <span className={`font-medium ${isMyVote ? "text-indigo-700" : "text-slate-700"}`}>
                    {opt.text}
                    {isMyVote && <CheckCircle2 className="inline w-3.5 h-3.5 ml-1.5 text-indigo-600" />}
                  </span>
                  <span className="text-slate-500 text-xs">{pct}%</span>
                </div>
                <div
                  className={`absolute inset-0 rounded-lg ${isMyVote ? "bg-indigo-100" : "bg-slate-100"}`}
                  style={{ width: `${Math.max(pct, 4)}%` }}
                />
              </div>
            );
          }
          return (
            <Button
              key={idx}
              variant="outline"
              className="w-full justify-start font-normal text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700"
              onClick={() => onVote(poll._id, idx)}
              disabled={disabled}
            >
              {opt.text}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
