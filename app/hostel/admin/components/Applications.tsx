"use client"
import { useState } from "react";
import { FileText, Calendar, Home, LogOut, CheckCircle, XCircle, Eye } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function AdminApplications() {
  const leaveApplications = [
    {
      id: 1,
      studentName: "Rahul Sharma",
      regNo: "21BCE1234",
      room: "A-204",
      reason: "Family function - Sister's wedding",
      leaveDate: "March 22, 2026",
      returnDate: "March 24, 2026",
      destination: "Delhi",
      status: "Pending",
      submittedAt: "March 17, 2026",
    },
    {
      id: 2,
      studentName: "Priya Singh",
      regNo: "21BCE1245",
      room: "B-305",
      reason: "Medical emergency at home",
      leaveDate: "March 20, 2026",
      returnDate: "March 23, 2026",
      destination: "Mumbai",
      status: "Pending",
      submittedAt: "March 17, 2026",
    },
  ];

  const roomChangeApplications = [
    {
      id: 1,
      studentName: "Amit Patel",
      regNo: "21BCE1256",
      room: "C-102",
      reason: "AC not working frequently, maintenance issues",
      status: "Pending",
      submittedAt: "March 16, 2026",
    },
  ];

  const withdrawalApplications = [
    {
      id: 1,
      studentName: "Suresh Kumar",
      regNo: "21BCE1267",
      room: "D-201",
      reason: "Moving to off-campus accommodation",
      details: "Family shifting to nearby area, will stay with them",
      status: "Pending",
      submittedAt: "March 15, 2026",
    },
  ];

  const handleAccept = (type: string, id: number) => {
    toast.success(`${type} application approved`);
  };

  const handleReject = (type: string, id: number) => {
    toast.success(`${type} application rejected`);
  };

  const handleReview = (type: string, id: number) => {
    toast.info(`Reviewing ${type} application`);
  };

  const ApplicationCard = ({ application, type }: any) => (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{application.studentName}</CardTitle>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-600">
              <span>{application.regNo}</span>
              <span>Room: {application.room}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Submitted: {application.submittedAt}</p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full ${
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
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-900 mb-1">Reason:</p>
          <p className="text-sm text-slate-700">{application.reason}</p>
        </div>

        {type === "leave" && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-600">Leave Date</p>
              <p className="font-medium text-slate-900">{application.leaveDate}</p>
            </div>
            <div>
              <p className="text-slate-600">Return Date</p>
              <p className="font-medium text-slate-900">{application.returnDate}</p>
            </div>
            <div>
              <p className="text-slate-600">Destination</p>
              <p className="font-medium text-slate-900">{application.destination}</p>
            </div>
          </div>
        )}

        {type === "withdrawal" && application.details && (
          <div>
            <p className="text-sm font-medium text-slate-900 mb-1">Additional Details:</p>
            <p className="text-sm text-slate-700">{application.details}</p>
          </div>
        )}

        {application.status === "Pending" && (
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              onClick={() => handleAccept(type, application.id)}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Accept
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleReject(type, application.id)}
              className="flex-1 text-red-600 hover:text-red-700"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleReview(type, application.id)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Review
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Application Management</h1>
        <p className="text-slate-600 mt-1">Review and process student applications</p>
      </div>

      <Tabs defaultValue="leave" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="leave">
            <Calendar className="w-4 h-4 mr-2" />
            Leave ({leaveApplications.length})
          </TabsTrigger>
          <TabsTrigger value="room-change">
            <Home className="w-4 h-4 mr-2" />
            Room Change ({roomChangeApplications.length})
          </TabsTrigger>
          <TabsTrigger value="withdrawal">
            <LogOut className="w-4 h-4 mr-2" />
            Withdrawal ({withdrawalApplications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leave" className="mt-6 space-y-4">
          {leaveApplications.map((application) => (
            <ApplicationCard key={application.id} application={application} type="leave" />
          ))}
          {leaveApplications.length === 0 && (
            <Card className="border-slate-200">
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600">No leave applications</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="room-change" className="mt-6 space-y-4">
          {roomChangeApplications.map((application) => (
            <ApplicationCard key={application.id} application={application} type="room change" />
          ))}
          {roomChangeApplications.length === 0 && (
            <Card className="border-slate-200">
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600">No room change applications</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="withdrawal" className="mt-6 space-y-4">
          {withdrawalApplications.map((application) => (
            <ApplicationCard key={application.id} application={application} type="withdrawal" />
          ))}
          {withdrawalApplications.length === 0 && (
            <Card className="border-slate-200">
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600">No withdrawal applications</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
