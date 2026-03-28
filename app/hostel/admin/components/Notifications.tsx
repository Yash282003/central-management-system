"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Send } from "lucide-react";
import { toast } from "sonner";

export default function AdminNotifications() {
  const [recipient, setRecipient] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [regNo, setRegNo] = useState("");

  const handleSend = () => {
    if (!recipient || !title || !message) {
      toast.error("Please fill all required fields");
      return;
    }

    if (recipient === "room" && !room) {
      toast.error("Please specify room number");
      return;
    }

    if (recipient === "individual" && !regNo) {
      toast.error("Please enter registration number");
      return;
    }

    toast.success("Notification sent successfully");
    resetForm();
  };

  const resetForm = () => {
    setRecipient("");
    setTitle("");
    setMessage("");
    setRoom("");
    setRegNo("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Send Notifications</h1>
        <p className="text-slate-600 mt-1">Broadcast messages to students</p>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2 text-slate-600" />
            Create Notification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Send To *</Label>
            <Select value={recipient} onValueChange={setRecipient}>
              <SelectTrigger id="recipient">
                <SelectValue placeholder="Select recipient type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="room">Specific Room</SelectItem>
                <SelectItem value="individual">Individual Student</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {recipient === "room" && (
            <div className="space-y-2">
              <Label htmlFor="room">Room Number *</Label>
              <Input
                id="room"
                placeholder="e.g., A-204"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              />
            </div>
          )}

          {recipient === "individual" && (
            <div className="space-y-2">
              <Label htmlFor="regNo">Registration Number *</Label>
              <Input
                id="regNo"
                placeholder="e.g., 21BCE1234"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Notification title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              placeholder="Enter your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSend} className="flex-1 md:flex-none">
              <Send className="w-4 h-4 mr-2" />
              Send Notification
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { title: "Room Inspection Notice", recipients: "All Students", time: "2 hours ago" },
              { title: "Mess Menu Updated", recipients: "All Students", time: "1 day ago" },
              { title: "Fee Payment Reminder", recipients: "Room A-204", time: "2 days ago" },
            ].map((notification, index) => (
              <div key={index} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                  <p className="text-xs text-slate-500 mt-1">To: {notification.recipients}</p>
                </div>
                <p className="text-xs text-slate-500">{notification.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
