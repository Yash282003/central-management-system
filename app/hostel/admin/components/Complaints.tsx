"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Complaint {
  _id: string;
  studentName: string;
  studentRegdNo: string;
  category: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
  createdAt: string;
}

const statusColor = (s: string) => {
  if (s === "open") return "bg-red-100 text-red-700";
  if (s === "in-progress") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
};

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const res = await fetch("/api/hostel/admin/complaints");
    const data = await res.json();
    if (data.success) setComplaints(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/hostel/admin/complaints?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) { toast.success("Status updated"); fetchData(); }
    else toast.error("Failed to update");
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Complaints</h1>
        <p className="text-gray-500 text-sm">Manage and resolve student complaints</p>
      </div>
      {loading ? (
        <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
      ) : complaints.length === 0 ? (
        <div className="py-20 text-center"><MessageSquare className="size-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No complaints filed</p></div>
      ) : (
        <div className="space-y-4">
          {complaints.map(c => (
            <Card key={c._id} className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{c.studentName}</p>
                      <span className="text-xs text-gray-400">{c.studentRegdNo}</span>
                    </div>
                    <p className="text-xs font-medium text-blue-600 capitalize mb-1">{c.category}</p>
                    <p className="text-sm text-gray-600">{c.description}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(c.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`capitalize text-xs ${statusColor(c.status)}`}>{c.status}</Badge>
                    <select value={c.status} onChange={(e) => updateStatus(c._id, e.target.value)}
                      className="h-8 px-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none">
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
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
