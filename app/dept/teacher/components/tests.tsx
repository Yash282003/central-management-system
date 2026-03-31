"use client"
import { useState } from "react";
import { Plus, ClipboardList, BarChart2, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { tests, polls, courses } from "../../data/mockdata";

export default function TeacherTests() {
  const [activeTab, setActiveTab] = useState<"tests" | "polls">("tests");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"test" | "poll">("test");

  const [testList, setTestList] = useState(tests);
  const [pollList, setPollList] = useState(polls);

  const [testForm, setTestForm] = useState({ title: "", course: "CS301", duration: "30 min", totalMarks: 20 });
  const [pollForm, setPollForm] = useState({ title: "", options: ["", ""] });

  const handleCreateTest = () => {
    if (!testForm.title.trim()) return;
    setTestList(prev => [{
      id: Date.now(),
      ...testForm,
      date: new Date().toISOString().split("T")[0],
      status: "upcoming" as const,
    }, ...prev]);
    setShowModal(false);
    setTestForm({ title: "", course: "CS301", duration: "30 min", totalMarks: 20 });
  };

  const handleCreatePoll = () => {
    if (!pollForm.title.trim()) return;
    setPollList(prev => [{
      id: Date.now(),
      title: pollForm.title,
      options: pollForm.options.filter(Boolean),
      votes: pollForm.options.filter(Boolean).map(() => 0),
      totalVotes: 0,
      status: "active" as const,
      endDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    }, ...prev]);
    setShowModal(false);
    setPollForm({ title: "", options: ["", ""] });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Tests & Polls</h1>
          <p className="text-gray-600">Create and manage assessments and polls</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setModalType("test"); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            <Plus className="size-4" />
            New Test
          </button>
          <button
            onClick={() => { setModalType("poll"); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
          >
            <Plus className="size-4" />
            New Poll
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {(["tests", "polls"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all capitalize ${
              activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab === "tests" ? "Tests" : "Polls"}
          </button>
        ))}
      </div>

      {/* Tests */}
      {activeTab === "tests" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testList.map(test => (
            <Card key={test.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="size-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <ClipboardList className="size-5 text-blue-600" />
                  </div>
                  <Badge variant={test.status === "upcoming" ? "default" : "outline"}>
                    {test.status === "upcoming" ? (
                      <span className="flex items-center gap-1"><Clock className="size-3" /> Upcoming</span>
                    ) : (
                      <span className="flex items-center gap-1"><CheckCircle className="size-3" /> Completed</span>
                    )}
                  </Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{test.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{test.course}</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm font-medium text-gray-900">{test.date}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-medium text-gray-900">{test.duration}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Marks</p>
                    <p className="text-sm font-medium text-gray-900">{test.totalMarks}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Polls */}
      {activeTab === "polls" && (
        <div className="space-y-6">
          {pollList.map(poll => (
            <Card key={poll.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{poll.title}</CardTitle>
                  <Badge variant={poll.status === "active" ? "default" : "outline"}>
                    {poll.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">Ends: {poll.endDate} · {poll.totalVotes} total votes</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {poll.options.map((opt, idx) => {
                    const pct = poll.totalVotes > 0 ? Math.round((poll.votes[idx] / poll.totalVotes) * 100) : 0;
                    return (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">{opt}</span>
                          <span className="text-sm font-medium text-gray-900">{pct}% ({poll.votes[idx]})</span>
                        </div>
                        <Progress value={pct} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {modalType === "test" ? "Create New Test" : "Create New Poll"}
            </h2>
            {modalType === "test" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Title *</label>
                  <input
                    type="text"
                    value={testForm.title}
                    onChange={e => setTestForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Data Structures Quiz 3"
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                    <select
                      value={testForm.course}
                      onChange={e => setTestForm(p => ({ ...p, course: e.target.value }))}
                      className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
                    >
                      {courses.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <select
                      value={testForm.duration}
                      onChange={e => setTestForm(p => ({ ...p, duration: e.target.value }))}
                      className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
                    >
                      {["15 min", "30 min", "45 min", "60 min", "90 min"].map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={testForm.totalMarks}
                    onChange={e => setTestForm(p => ({ ...p, totalMarks: Number(e.target.value) }))}
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Poll Question *</label>
                  <input
                    type="text"
                    value={pollForm.title}
                    onChange={e => setPollForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Enter poll question..."
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                  {pollForm.options.map((opt, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={e => setPollForm(p => ({ ...p, options: p.options.map((o, i) => i === idx ? e.target.value : o) }))}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => setPollForm(p => ({ ...p, options: [...p.options, ""] }))}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    + Add option
                  </button>
                </div>
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={modalType === "test" ? handleCreateTest : handleCreatePoll}
                className="flex-1 h-10 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Create {modalType === "test" ? "Test" : "Poll"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
