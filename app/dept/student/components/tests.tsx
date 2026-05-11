"use client";
import { useState, useEffect } from "react";
import { Clock, Calendar, CheckCircle, Trophy, ClipboardList, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface Test {
  _id: string;
  title: string;
  subject: string;
  date: string;
  duration?: number;
  maxMarks: number;
  obtainedMarks?: number;
}

interface Poll {
  _id: string;
  question: string;
  options: string[];
  votes: number[];
  totalVotes: number;
  status: "active" | "closed";
  endDate?: string;
}

export default function StudentTests() {
  const [tests, setTests] = useState<Test[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedPolls, setVotedPolls] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch("/api/student/me");
        const me = await meRes.json();
        if (!me.success) return;
        const branch = me.data?.branch;

        const [testRes, pollRes] = await Promise.allSettled([
          fetch(`/api/dept/tests?branch=${encodeURIComponent(branch ?? "")}`),
          fetch(`/api/dept/polls?branch=${encodeURIComponent(branch ?? "")}`),
        ]);

        if (testRes.status === "fulfilled" && testRes.value.ok) {
          const d = await testRes.value.json();
          if (d.success) setTests(Array.isArray(d.data) ? d.data : []);
        }
        if (pollRes.status === "fulfilled" && pollRes.value.ok) {
          const d = await pollRes.value.json();
          if (d.success) setPolls(Array.isArray(d.data) ? d.data : []);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const now = new Date();
  const upcoming = tests.filter((t) => new Date(t.date) > now);
  const past = tests.filter((t) => new Date(t.date) <= now);
  const activePolls = polls.filter((p) => p.status === "active");
  const closedPolls = polls.filter((p) => p.status === "closed");

  async function handleVote(pollId: string, optionIndex: number) {
    setVotedPolls((prev) => new Set([...prev, pollId]));
    try {
      await fetch(`/api/dept/polls/${pollId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ optionIndex }),
      });
    } catch {}
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Tests & Polls</h1>
        <p className="text-gray-500 text-sm">View upcoming assessments and participate in class polls</p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="bg-white border border-gray-100 shadow-sm rounded-xl p-1">
          <TabsTrigger value="upcoming" className="rounded-lg text-sm">
            Upcoming
            {upcoming.length > 0 && (
              <Badge className="ml-2 bg-blue-100 text-blue-700 text-xs border-0">{upcoming.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="past" className="rounded-lg text-sm">Past</TabsTrigger>
          <TabsTrigger value="polls" className="rounded-lg text-sm">
            Polls
            {activePolls.length > 0 && (
              <Badge className="ml-2 bg-green-100 text-green-700 text-xs border-0">{activePolls.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Upcoming Tab */}
        <TabsContent value="upcoming" className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}
            </div>
          ) : upcoming.length === 0 ? (
            <div className="py-20 text-center">
              <Calendar className="size-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No upcoming tests</p>
              <p className="text-gray-400 text-sm">You&apos;re all clear for now</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {upcoming.map((test) => (
                <Card key={test._id} className="rounded-2xl border-0 shadow-sm hover:-translate-y-0.5 transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-0.5 text-sm">{test.title}</h3>
                        <p className="text-xs text-gray-500">{test.subject}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700 border-0 text-xs flex-shrink-0 ml-3">
                        Upcoming
                      </Badge>
                    </div>

                    <div className="space-y-2 mt-4">
                      <div className="flex items-center gap-2.5 text-xs text-gray-600">
                        <Calendar className="size-3.5 text-gray-400" />
                        <span>
                          {new Date(test.date).toLocaleDateString("en-IN", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      {test.duration && (
                        <div className="flex items-center gap-2.5 text-xs text-gray-600">
                          <Clock className="size-3.5 text-gray-400" />
                          <span>{test.duration} min</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2.5 text-xs text-gray-600">
                        <Trophy className="size-3.5 text-gray-400" />
                        <span>{test.maxMarks} marks</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Past Tab */}
        <TabsContent value="past" className="space-y-3">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
            </div>
          ) : past.length === 0 ? (
            <div className="py-20 text-center">
              <CheckCircle className="size-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No completed tests yet</p>
              <p className="text-gray-400 text-sm">Results will appear here after exams</p>
            </div>
          ) : (
            past.map((test) => {
              const obtained = test.obtainedMarks ?? 0;
              const pct = test.maxMarks > 0 ? (obtained / test.maxMarks) * 100 : 0;
              const resultColor =
                pct >= 80 ? "bg-emerald-100 text-emerald-700" :
                pct >= 60 ? "bg-blue-100 text-blue-700" :
                "bg-red-100 text-red-700";
              const resultLabel = pct >= 80 ? "Excellent" : pct >= 60 ? "Good" : "Needs Work";

              return (
                <Card key={test._id} className="rounded-2xl border-0 shadow-sm hover:-translate-y-0.5 transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="size-8 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="size-4 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{test.title}</h3>
                          <p className="text-xs text-gray-500">{test.subject}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <p className="text-xl font-bold text-gray-900">{obtained}/{test.maxMarks}</p>
                        <Badge className={`text-xs border-0 ${resultColor}`}>{resultLabel}</Badge>
                      </div>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(test.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      {" · "}{pct.toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* Polls Tab */}
        <TabsContent value="polls" className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
            </div>
          ) : polls.length === 0 ? (
            <div className="py-20 text-center">
              <BarChart3 className="size-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No polls yet</p>
              <p className="text-gray-400 text-sm">Your department hasn&apos;t posted any polls</p>
            </div>
          ) : (
            <>
              {activePolls.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Active Polls</h2>
                  {activePolls.map((poll) => {
                    const hasVoted = votedPolls.has(poll._id);
                    return (
                      <Card key={poll._id} className="rounded-2xl border-0 shadow-sm">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-semibold text-gray-900">{poll.question}</CardTitle>
                            <Badge className="bg-green-100 text-green-700 border-0 text-xs">Active</Badge>
                          </div>
                          {poll.endDate && (
                            <p className="text-xs text-gray-400 mt-1">
                              Ends {new Date(poll.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </p>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-2.5">
                          {poll.options.map((option, idx) => {
                            const votePct = poll.totalVotes > 0 ? (poll.votes[idx] / poll.totalVotes) * 100 : 0;
                            return (
                              <button
                                key={idx}
                                disabled={hasVoted}
                                onClick={() => handleVote(poll._id, idx)}
                                className="w-full text-left p-3 border border-gray-100 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all disabled:cursor-default"
                              >
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-sm text-gray-800 font-medium">{option}</span>
                                  <span className="text-xs text-gray-500">{votePct.toFixed(1)}%</span>
                                </div>
                                <Progress value={votePct} className="h-1.5" />
                              </button>
                            );
                          })}
                          <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5"><BarChart3 className="size-3.5" />{poll.totalVotes} votes</span>
                            {hasVoted && <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">Voted</Badge>}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {closedPolls.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Closed Polls</h2>
                  {closedPolls.map((poll) => (
                    <Card key={poll._id} className="rounded-2xl border-0 shadow-sm opacity-70">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-semibold text-gray-900">{poll.question}</CardTitle>
                          <Badge variant="outline" className="text-xs">Closed</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {poll.options.map((option, idx) => {
                          const votePct = poll.totalVotes > 0 ? (poll.votes[idx] / poll.totalVotes) * 100 : 0;
                          return (
                            <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm text-gray-700">{option}</span>
                                <span className="text-xs text-gray-500">{votePct.toFixed(1)}%</span>
                              </div>
                              <Progress value={votePct} className="h-1.5" />
                            </div>
                          );
                        })}
                        <p className="text-xs text-gray-400 pt-1">{poll.totalVotes} total votes</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
