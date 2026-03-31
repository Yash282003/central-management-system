"use client"
import { useState } from "react";
import { Clock, Calendar, CheckCircle, Trophy, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tests, polls } from "../../data/mockdata";

export default function StudentTests() {
  const [selectedPoll, setSelectedPoll] = useState<number | null>(null);

  const upcomingTests = tests.filter((t) => t.status === "upcoming");
  const completedTests = tests.filter((t) => t.status === "completed");
  const activePolls = polls.filter((p) => p.status === "active");
  const closedPolls = polls.filter((p) => p.status === "closed");

  const handleVote = (pollId: number, optionIndex: number) => {
    setSelectedPoll(pollId);
    // In a real app, this would update the vote
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Tests & Polls</h1>
        <p className="text-gray-600">
          View upcoming assessments and participate in class polls
        </p>
      </div>

      <Tabs defaultValue="tests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tests">Tests & Quizzes</TabsTrigger>
          <TabsTrigger value="polls">Polls & Surveys</TabsTrigger>
        </TabsList>

        {/* Tests Tab */}
        <TabsContent value="tests" className="space-y-6">
          {/* Upcoming Tests */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tests</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {upcomingTests.map((test) => (
                <Card key={test.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{test.title}</h3>
                        <p className="text-sm text-gray-600">{test.course}</p>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Upcoming
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Calendar className="size-4" />
                        <span>
                          {new Date(test.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Clock className="size-4" />
                        <span>Duration: {test.duration}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Trophy className="size-4" />
                        <span>Total Marks: {test.totalMarks}</span>
                      </div>
                    </div>

                    <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Completed Tests */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Completed Tests</h2>
            <div className="space-y-4">
              {completedTests.map((test) => {
                const percentage = test.obtained
                  ? (test.obtained / test.totalMarks) * 100
                  : 0;
                return (
                  <Card key={test.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="size-5 text-green-600" />
                            <div>
                              <h3 className="font-semibold text-gray-900">{test.title}</h3>
                              <p className="text-sm text-gray-600">{test.course}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-semibold text-gray-900">
                            {test.obtained}/{test.totalMarks}
                          </p>
                          <p className="text-sm text-gray-600">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm text-gray-600">
                          Completed on{" "}
                          {new Date(test.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <Badge
                          variant={percentage >= 80 ? "default" : percentage >= 60 ? "outline" : "destructive"}
                          className={percentage >= 80 ? "bg-green-600" : ""}
                        >
                          {percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : "Needs Improvement"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Polls Tab */}
        <TabsContent value="polls" className="space-y-6">
          {/* Active Polls */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Polls</h2>
            <div className="space-y-4">
              {activePolls.map((poll) => (
                <Card key={poll.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{poll.title}</CardTitle>
                      <Badge variant="default" className="bg-green-600">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Ends on{" "}
                      {new Date(poll.endDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {poll.options.map((option, idx) => {
                        const votePercentage = (poll.votes[idx] / poll.totalVotes) * 100;
                        const isSelected = selectedPoll === poll.id;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleVote(poll.id, idx)}
                            className="w-full text-left"
                            disabled={isSelected}
                          >
                            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50/30 transition-all">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900">{option}</span>
                                <span className="text-sm text-gray-600">
                                  {votePercentage.toFixed(1)}%
                                </span>
                              </div>
                              <Progress value={votePercentage} className="h-2" />
                              <p className="text-xs text-gray-600 mt-1">
                                {poll.votes[idx]} votes
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BarChart3 className="size-4" />
                        <span>{poll.totalVotes} total votes</span>
                      </div>
                      {selectedPoll === poll.id && (
                        <Badge variant="default" className="bg-blue-600">
                          Vote Submitted
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Closed Polls */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Closed Polls</h2>
            <div className="space-y-4">
              {closedPolls.map((poll) => (
                <Card key={poll.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{poll.title}</CardTitle>
                      <Badge variant="outline">Closed</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {poll.options.map((option, idx) => {
                        const votePercentage = (poll.votes[idx] / poll.totalVotes) * 100;
                        return (
                          <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">{option}</span>
                              <span className="text-sm text-gray-600">
                                {votePercentage.toFixed(1)}%
                              </span>
                            </div>
                            <Progress value={votePercentage} className="h-2" />
                            <p className="text-xs text-gray-600 mt-1">{poll.votes[idx]} votes</p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
