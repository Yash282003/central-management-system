"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Reply, CheckCircle, Trash2, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

export default function AdminComplaints() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<number | null>(null);

  const complaints = [
    {
      id: 1,
      studentName: "Rahul Sharma",
      regNo: "21BCE1234",
      room: "A-204",
      title: "AC not working",
      category: "Room Utilities",
      description: "The air conditioner in my room has stopped working since yesterday. It's getting really hot and uncomfortable.",
      status: "Pending",
      submittedAt: "March 17, 2026 - 10:30 AM",
      image: null,
    },
    {
      id: 2,
      studentName: "Priya Singh",
      regNo: "21BCE1245",
      room: "B-305",
      title: "Poor food quality in mess",
      category: "Mess",
      description: "The food quality has been consistently poor for the past week. Multiple students have complained about this.",
      status: "In Progress",
      submittedAt: "March 17, 2026 - 09:15 AM",
      image: null,
    },
    {
      id: 3,
      studentName: "Amit Patel",
      regNo: "21BCE1256",
      room: "C-102",
      title: "Water leakage",
      category: "Room Utilities",
      description: "There is severe water leakage from the bathroom ceiling. The issue needs immediate attention.",
      status: "Pending",
      submittedAt: "March 16, 2026 - 04:20 PM",
      image: null,
    },
  ];

  const handleReply = () => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }
    toast.success("Reply sent to student");
    setReplyText("");
    setSelectedComplaint(null);
  };

  const handleResolve = (id: number) => {
    toast.success("Complaint marked as resolved");
  };

  const handleDelete = (id: number) => {
    toast.success("Complaint deleted");
  };

  const handleEscalate = (id: number) => {
    toast.success("Complaint escalated to higher authority");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Complaint Management</h1>
        <p className="text-slate-600 mt-1">Review and respond to student complaints</p>
      </div>

      <div className="space-y-4">
        {complaints.map((complaint) => (
          <Card key={complaint.id} className="border-slate-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    {complaint.title}
                    <span className={`text-xs px-2.5 py-1 rounded-full ${
                      complaint.status === "Resolved" 
                        ? "bg-green-100 text-green-700" 
                        : complaint.status === "In Progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {complaint.status}
                    </span>
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                    <span>{complaint.studentName} ({complaint.regNo})</span>
                    <span>Room: {complaint.room}</span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-xs">{complaint.category}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{complaint.submittedAt}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedId(expandedId === complaint.id ? null : complaint.id)}
                >
                  {expandedId === complaint.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            
            {expandedId === complaint.id && (
              <CardContent className="pt-0 space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-700">{complaint.description}</p>
                  {complaint.image && (
                    <div className="mt-3">
                      <img src={complaint.image} alt="Complaint" className="max-w-sm rounded-lg" />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setSelectedComplaint(complaint.id)}>
                        <Reply className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reply to Complaint</DialogTitle>
                        <DialogDescription>
                          Send a message to {complaint.studentName}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <Textarea
                          placeholder="Type your reply here..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <Button onClick={handleReply} className="flex-1">
                            Send Reply
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setSelectedComplaint(null);
                              setReplyText("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleResolve(complaint.id)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Resolved
                  </Button>

                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEscalate(complaint.id)}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Escalate
                  </Button>

                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDelete(complaint.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {complaints.length === 0 && (
          <Card className="border-slate-200">
            <CardContent className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600">No complaints to review</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
