"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Bell,
  MessageSquare,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BedDouble,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface RoomInfo {
  roomNo: string;
  block: string;
  type: string;
  capacity: number;
  occupants: string[];
}

interface Notification {
  title: string;
  message: string;
  priority: string;
  sentBy: string;
  createdAt: string;
}

interface Complaint {
  _id: string;
  category: string;
  description: string;
  status: string;
  createdAt: string;
}

interface Application {
  _id: string;
  roomType: string;
  reason: string;
  status: string;
  createdAt: string;
}

export default function HostelStudentDashboard() {
  const router = useRouter();

  const [room, setRoom] = useState<RoomInfo | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [roomRes, notifRes, compRes, appRes] = await Promise.allSettled([
          fetch("/api/hostel/student/room").then((r) => r.json()),
          fetch("/api/hostel/student/notifications").then((r) => r.json()),
          fetch("/api/hostel/student/complaints").then((r) => r.json()),
          fetch("/api/hostel/student/applications").then((r) => r.json()),
        ]);

        if (roomRes.status === "fulfilled") setRoom(roomRes.value);
        if (notifRes.status === "fulfilled") setNotifications(notifRes.value ?? []);
        if (compRes.status === "fulfilled") setComplaints(compRes.value ?? []);
        if (appRes.status === "fulfilled") setApplications(appRes.value ?? []);
      } catch {
        // silently handled per-promise above
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const activeComplaints = complaints.filter((c) => c.status !== "resolved").length;
  const pendingApplications = applications.filter((a) => a.status === "pending").length;
  const recentNotifications = notifications.slice(0, 3);

  const priorityColor = (priority: string) => {
    if (priority === "urgent") return "bg-red-100 text-red-700";
    if (priority === "important") return "bg-amber-100 text-amber-700";
    return "bg-green-100 text-green-700";
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Hostel Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Overview of your hostel status and recent activity
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Room Assigned */}
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Room Assigned</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {room ? room.roomNo : "—"}
                </p>
                {room && (
                  <p className="text-xs text-slate-500 mt-1">
                    Block {room.block} · {room.type}
                  </p>
                )}
              </div>
              <div className="size-12 bg-green-50 rounded-xl flex items-center justify-center">
                <BedDouble className="size-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Complaints */}
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Active Complaints</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {activeComplaints}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {activeComplaints === 0 ? "All clear" : "Awaiting resolution"}
                </p>
              </div>
              <div className="size-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <AlertTriangle className="size-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Applications */}
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Pending Applications</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {pendingApplications}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {pendingApplications === 0 ? "None pending" : "Under review"}
                </p>
              </div>
              <div className="size-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <FileText className="size-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Room Info Card */}
      {room ? (
        <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-green-700 to-green-600 text-white">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Home className="size-5" />
              Your Room Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-green-200 text-xs mb-1">Room No.</p>
                <p className="text-2xl font-bold">{room.roomNo}</p>
              </div>
              <div>
                <p className="text-green-200 text-xs mb-1">Block</p>
                <p className="font-semibold text-lg">{room.block}</p>
              </div>
              <div>
                <p className="text-green-200 text-xs mb-1">Room Type</p>
                <p className="font-semibold text-lg capitalize">{room.type}</p>
              </div>
              <div>
                <p className="text-green-200 text-xs mb-1">Occupants</p>
                <div className="flex items-center gap-1">
                  <Users className="size-4 text-green-200" />
                  <p className="font-semibold text-lg">
                    {room.occupants.length} / {room.capacity}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="py-12 text-center">
            <BedDouble className="size-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No room assigned yet</p>
            <p className="text-sm text-slate-400 mt-1">
              Contact the hostel office to get a room allotted.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          size="lg"
          className="h-auto py-4 justify-start bg-green-700 hover:bg-green-800 text-white rounded-xl"
          onClick={() => router.push("/hostel/student/complaints")}
        >
          <MessageSquare className="size-5 mr-3" />
          <div className="text-left">
            <p className="font-semibold">Raise a Complaint</p>
            <p className="text-xs opacity-80 mt-0.5">Report an issue or concern</p>
          </div>
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="h-auto py-4 justify-start rounded-xl border-green-200 hover:bg-green-50 text-green-800"
          onClick={() => router.push("/hostel/student/applications")}
        >
          <FileText className="size-5 mr-3" />
          <div className="text-left">
            <p className="font-semibold">Apply for Room</p>
            <p className="text-xs opacity-70 mt-0.5">Submit a room change request</p>
          </div>
        </Button>
      </div>

      {/* Recent Notifications */}
      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="size-5 text-green-600" />
            Recent Notifications
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-green-700"
            onClick={() => router.push("/hostel/student/notifications")}
          >
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {recentNotifications.length > 0 ? (
            <div className="space-y-3">
              {recentNotifications.map((n, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50"
                >
                  <div className="size-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="size-4 text-green-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-slate-900">
                        {n.title}
                      </p>
                      <Badge
                        className={`text-xs capitalize ${priorityColor(n.priority)}`}
                        variant="outline"
                      >
                        {n.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {n.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(n.createdAt).toLocaleDateString()} · {n.sentBy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <CheckCircle2 className="size-10 text-green-300 mx-auto mb-3" />
              <p className="text-slate-500">No notifications yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
