"use client"
import { useState } from "react";
import { FileText, Calendar, Home, LogOut as LogOutIcon, Clock, Bell, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function StudentApplications() {
  const [activeTab, setActiveTab] = useState("leave");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Leave application state
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveDate, setLeaveDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [leaveTime, setLeaveTime] = useState("");
  const [destination, setDestination] = useState("");
  
  // Room change state
  const [roomChangeReason, setRoomChangeReason] = useState("");
  
  // Withdrawal state
  const [withdrawalReason, setWithdrawalReason] = useState("");
  const [withdrawalDetails, setWithdrawalDetails] = useState("");
  const [confirmationText, setConfirmationText] = useState("");
  const studentName = "Rahul Sharma";
  const hostelName = "Ganga Hostel";
  const requiredConfirmation = `I, ${studentName}, want to withdraw from ${hostelName}`;

  const myApplications = [
    {
      id: 1,
      type: "Leave",
      reason: "Family function",
      submittedAt: "March 15, 2026",
      status: "Approved",
      dates: "March 22-24, 2026",
    },
    {
      id: 2,
      type: "Room Change",
      reason: "AC not working frequently",
      submittedAt: "March 10, 2026",
      status: "Pending",
    },
  ];

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason || !leaveDate || !returnDate || !destination) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success("Leave application submitted successfully");
    resetLeaveForm();
    setIsDialogOpen(false);
  };

  const handleRoomChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomChangeReason) {
      toast.error("Please provide a reason");
      return;
    }
    toast.success("Room change application submitted successfully");
    setRoomChangeReason("");
    setIsDialogOpen(false);
  };

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawalReason || !withdrawalDetails) {
      toast.error("Please fill all required fields");
      return;
    }
    if (confirmationText !== requiredConfirmation) {
      toast.error("Confirmation text doesn't match");
      return;
    }
    toast.success("Withdrawal application submitted successfully");
    resetWithdrawalForm();
    setIsDialogOpen(false);
  };

  const resetLeaveForm = () => {
    setLeaveReason("");
    setLeaveDate("");
    setReturnDate("");
    setLeaveTime("");
    setDestination("");
  };

  const resetWithdrawalForm = () => {
    setWithdrawalReason("");
    setWithdrawalDetails("");
    setConfirmationText("");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Applications</h1>
          <p className="text-slate-600 mt-1">Submit and manage your applications</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="leave">
            <Calendar className="w-4 h-4 mr-2" />
            Leave
          </TabsTrigger>
          <TabsTrigger value="room-change">
            <Home className="w-4 h-4 mr-2" />
            Room Change
          </TabsTrigger>
          <TabsTrigger value="withdrawal">
            <LogOutIcon className="w-4 h-4 mr-2" />
            Withdrawal
          </TabsTrigger>
          <TabsTrigger value="my-applications">
            <FileText className="w-4 h-4 mr-2" />
            My Applications
          </TabsTrigger>
        </TabsList>

        {/* Leave Application */}
        <TabsContent value="leave" className="mt-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-slate-600" />
                Leave Application
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLeaveSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="leave-reason">Reason *</Label>
                  <Textarea
                    id="leave-reason"
                    placeholder="Enter reason for leave..."
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="leave-date">Leave Date *</Label>
                    <Input
                      id="leave-date"
                      type="date"
                      value={leaveDate}
                      onChange={(e) => setLeaveDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="return-date">Return Date *</Label>
                    <Input
                      id="return-date"
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="leave-time">Time (Optional)</Label>
                    <Input
                      id="leave-time"
                      type="time"
                      value={leaveTime}
                      onChange={(e) => setLeaveTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination *</Label>
                    <Input
                      id="destination"
                      type="text"
                      placeholder="e.g., Delhi"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  Submit Leave Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Room Change Application */}
        <TabsContent value="room-change" className="mt-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="w-5 h-5 mr-2 text-slate-600" />
                Room Change Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRoomChangeSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="room-reason">Reason for Room Change *</Label>
                  <Textarea
                    id="room-reason"
                    placeholder="Explain why you want to change your room..."
                    value={roomChangeReason}
                    onChange={(e) => setRoomChangeReason(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  Submit Room Change Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hostel Withdrawal */}
        <TabsContent value="withdrawal" className="mt-6">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-900">
                <LogOutIcon className="w-5 h-5 mr-2" />
                Hostel Withdrawal Application
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
                <div className="p-3 bg-red-100 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    ⚠️ This is a permanent action. Please ensure you want to withdraw from the hostel.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="withdrawal-reason">Reason *</Label>
                  <Textarea
                    id="withdrawal-reason"
                    placeholder="Enter reason for withdrawal..."
                    value={withdrawalReason}
                    onChange={(e) => setWithdrawalReason(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="withdrawal-details">Additional Details *</Label>
                  <Textarea
                    id="withdrawal-details"
                    placeholder="Provide any additional information..."
                    value={withdrawalDetails}
                    onChange={(e) => setWithdrawalDetails(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmation">Confirmation *</Label>
                  <p className="text-sm text-slate-600 mb-2">
                    Type the following to confirm: <span className="font-medium">"{requiredConfirmation}"</span>
                  </p>
                  <Input
                    id="confirmation"
                    type="text"
                    placeholder="Type confirmation text..."
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="destructive"
                  className="w-full md:w-auto"
                  disabled={confirmationText !== requiredConfirmation}
                >
                  Submit Withdrawal Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Applications */}
        <TabsContent value="my-applications" className="mt-6">
          <div className="space-y-4">
            {myApplications.length > 0 ? (
              myApplications.map((application) => (
                <Card key={application.id} className="border-slate-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{application.type} Application</CardTitle>
                        <p className="text-sm text-slate-600 mt-1">{application.reason}</p>
                        {application.dates && (
                          <p className="text-sm text-slate-500 mt-1">Dates: {application.dates}</p>
                        )}
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 ${
                        application.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : application.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {application.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                        Submitted: {application.submittedAt}
                      </div>
                      {application.status === "Pending" && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toast.info("Reminder sent to admin")}
                          >
                            <Bell className="w-3.5 h-3.5 mr-1.5" />
                            Reminder
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toast.success("Application withdrawn")}
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Withdraw
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-slate-200">
                <CardContent className="text-center py-12">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600">No applications submitted yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
