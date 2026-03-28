"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle, Info, CheckCircle } from "lucide-react";

export default function StudentNotifications() {
  const warningNotifications = [
    {
      id: 1,
      title: "Important: Room Inspection",
      message: "Mandatory room inspection scheduled for March 20, 2026. Please ensure your room is clean and organized.",
      timestamp: "March 17, 2026 - 09:00 AM",
    },
    {
      id: 2,
      title: "Fee Payment Deadline",
      message: "Hostel fee payment deadline is March 25, 2026. Late payments will incur additional charges.",
      timestamp: "March 15, 2026 - 10:30 AM",
    },
  ];

  const regularNotifications = [
    {
      id: 3,
      title: "Mess Menu Updated",
      message: "New mess menu for the week has been uploaded. Check the Mess section for details.",
      timestamp: "March 17, 2026 - 08:00 AM",
      type: "info",
    },
    {
      id: 4,
      title: "Common Room Maintenance",
      message: "Common room will be under maintenance on March 19, 2026 from 2 PM to 5 PM.",
      timestamp: "March 16, 2026 - 03:15 PM",
      type: "info",
    },
    {
      id: 5,
      title: "Leave Application Approved",
      message: "Your leave application for March 22-24 has been approved by the warden.",
      timestamp: "March 15, 2026 - 11:00 AM",
      type: "success",
    },
    {
      id: 6,
      title: "New Hostel Guidelines",
      message: "Updated hostel guidelines have been published. Please review them in your dashboard.",
      timestamp: "March 14, 2026 - 04:30 PM",
      type: "info",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Notifications</h1>
        <p className="text-slate-600 mt-1">Stay updated with important announcements</p>
      </div>

      {/* Warning Notifications */}
      {warningNotifications.length > 0 && (
        <div>
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <h2 className="text-lg font-semibold text-red-600">Important Warnings</h2>
          </div>
          <div className="space-y-4">
            {warningNotifications.map((notification) => (
              <Card key={notification.id} className="border-red-200 bg-red-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-start">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-red-900">{notification.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-800 mb-3">{notification.message}</p>
                  <p className="text-xs text-red-600">{notification.timestamp}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Regular Notifications */}
      <div>
        <div className="flex items-center mb-4">
          <Bell className="w-5 h-5 text-slate-600 mr-2" />
          <h2 className="text-lg font-semibold text-slate-900">All Notifications</h2>
        </div>
        <div className="space-y-4">
          {regularNotifications.map((notification) => (
            <Card key={notification.id} className="border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-start">
                  {notification.type === "success" ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <span className="text-slate-900">{notification.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 mb-3">{notification.message}</p>
                <p className="text-xs text-slate-500">{notification.timestamp}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
