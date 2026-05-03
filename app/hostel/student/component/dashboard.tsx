"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Bell, AlertTriangle, MessageSquare, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
const router = useRouter();

const [studentInfo, setStudentInfo] = useState<any>(null);

useEffect(() => {
  const fetchStudent = async () => {
    try {
      const res = await fetch("/api/student/hostel"); 
      const data = await res.json();
      setStudentInfo(data);
      console.log(data)
    } catch (error) {
      console.error("Failed to fetch student", error);
    }
  };

  fetchStudent();
}, []);

  const recentNotifications = [
    { id: 1, title: "Room Inspection Tomorrow", time: "2 hours ago", type: "info" },
    { id: 2, title: "Mess Menu Updated", time: "5 hours ago", type: "info" },
  ];

  const activeComplaints = [
    { id: 1, title: "AC not working", status: "In Progress", category: "Room Utilities" },
    { id: 2, title: "Water leakage in bathroom", status: "Pending", category: "Room Utilities" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Welcome Back!, {studentInfo?.name}!</h1>
        <p className="text-slate-600 mt-1">Here's what's happening with your hostel today</p>
      </div>

      {/* Student Info Card */}
      <Card className="border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Home className="w-5 h-5 mr-2" />
            Your Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-slate-300 text-sm">Registration No.</p>
              <p className="font-semibold mt-1">{studentInfo?.regd}</p>
            </div>
            <div>
              <p className="text-slate-300 text-sm">Hostel</p>
              <p className="font-semibold mt-1">{studentInfo?.hostel}</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-slate-300 text-sm">Room Number</p>
              <p className="font-semibold mt-1 text-xl">{studentInfo?.room}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
        onClick={() => router.push("/hostel/student/complaints")}
          size="lg" 
          className="h-auto py-4 justify-start"
        >
          <MessageSquare className="w-5 h-5 mr-3" />
          <div className="text-left">
            <div className="font-semibold">Raise a Complaint</div>
            <div className="text-xs opacity-90">Report an issue or concern</div>
          </div>
        </Button>
        
        <Button 
          onClick={() => router.push("/hostel/student/applications")}
          size="lg" 
          variant="outline"
          className="h-auto py-4 justify-start border-slate-300"
        >
          <FileText className="w-5 h-5 mr-3" />
          <div className="text-left">
            <div className="font-semibold">Apply for Leave</div>
            <div className="text-xs opacity-70">Submit leave application</div>
          </div>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notifications */}
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg flex items-center">
              <Bell className="w-5 h-5 mr-2 text-slate-600" />
              Recent Notifications
            </CardTitle>
            <Button variant="ghost" size="sm" 
            onClick={() => router.push("/hostel/student/notifications")}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {recentNotifications.length > 0 ? (
              <div className="space-y-3">
                {recentNotifications.map((notification) => (
                  <div key={notification.id} className="flex items-start p-3 bg-slate-50 rounded-lg">
                    <Bell className="w-4 h-4 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">No notifications</p>
            )}
          </CardContent>
        </Card>

        {/* Active Complaints */}
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-slate-600" />
              Active Complaints
            </CardTitle>
            <Button variant="ghost" size="sm" 
             onClick={() => router.push("/hostel/student/complaints")}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {activeComplaints.length > 0 ? (
              <div className="space-y-3">
                {activeComplaints.map((complaint) => (
                  <div key={complaint.id} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{complaint.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{complaint.category}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        complaint.status === "In Progress" 
                          ? "bg-blue-100 text-blue-700" 
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">No active complaints</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
