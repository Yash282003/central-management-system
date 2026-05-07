"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Application {
  _id: string;
  studentName: string;
  studentRegdNo: string;
  roomType: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const statusColor = (s: string) => {
  if (s === "pending") return "bg-amber-100 text-amber-700";
  if (s === "approved") return "bg-emerald-100 text-emerald-700";
  return "bg-red-100 text-red-700";
};

export default function AdminApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const res = await fetch("/api/hostel/admin/applications");
    const data = await res.json();
    if (data.success) setApplications(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/hostel/admin/applications?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) { toast.success(`Application ${status}`); fetchData(); }
    else toast.error("Failed to update");
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Room Applications</h1>
        <p className="text-gray-500 text-sm">Review and manage student room requests</p>
      </div>
      {loading ? (
        <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
      ) : applications.length === 0 ? (
        <div className="py-20 text-center"><FileText className="size-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No applications yet</p></div>
      ) : (
        <div className="space-y-4">
          {applications.map(a => (
            <Card key={a._id} className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{a.studentName}</p>
                      <span className="text-xs text-gray-400">{a.studentRegdNo}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1 capitalize">Room type: <strong>{a.roomType}</strong></p>
                    {a.reason && <p className="text-sm text-gray-500">{a.reason}</p>}
                    <p className="text-xs text-gray-400 mt-2">{new Date(a.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`capitalize text-xs ${statusColor(a.status)}`}>{a.status}</Badge>
                    {a.status === "pending" && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateStatus(a._id, "approved")} className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs rounded-xl">
                          <CheckCircle className="size-3 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateStatus(a._id, "rejected")} className="border-red-200 text-red-600 hover:bg-red-50 h-8 text-xs rounded-xl">
                          <XCircle className="size-3 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
