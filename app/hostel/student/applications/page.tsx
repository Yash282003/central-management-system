"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Application {
  _id: string;
  roomType: string;
  reason: string;
  status: string;
  createdAt: string;
}

const ROOM_TYPES = [
  { value: "single", label: "Single Room" },
  { value: "double", label: "Double Sharing" },
  { value: "triple", label: "Triple Sharing" },
];

function StatusBadge({ status }: { status: string }) {
  if (status === "approved") {
    return (
      <Badge className="bg-green-100 text-green-700 border-green-200 gap-1" variant="outline">
        <CheckCircle2 className="size-3" />
        Approved
      </Badge>
    );
  }
  if (status === "rejected") {
    return (
      <Badge className="bg-red-100 text-red-700 border-red-200 gap-1" variant="outline">
        <XCircle className="size-3" />
        Rejected
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-100 text-amber-700 border-amber-200 gap-1" variant="outline">
      <Clock className="size-3" />
      Pending
    </Badge>
  );
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [roomType, setRoomType] = useState("");
  const [reason, setReason] = useState("");

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/hostel/student/applications");
      const data = await res.json();
      setApplications(Array.isArray(data.data) ? data.data : []);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomType) {
      toast.error("Please select a room type");
      return;
    }
    if (!reason.trim()) {
      toast.error("Please provide a reason for your application");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/hostel/student/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomType, reason }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      toast.success("Application submitted successfully");
      setRoomType("");
      setReason("");
      setDialogOpen(false);
      fetchApplications();
    } catch {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const pending = applications.filter((a) => a.status === "pending");
  const decided = applications.filter(
    (a) => a.status === "approved" || a.status === "rejected"
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-36 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Applications</h1>
          <p className="text-slate-500 mt-1">
            Apply for room changes and track request status
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-700 hover:bg-green-800 text-white rounded-xl">
              <Plus className="size-4 mr-2" />
              Apply for Room
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-white/95 backdrop-blur-md">
            <DialogHeader>
              <DialogTitle>Room Change Application</DialogTitle>
              <DialogDescription>
                Select your preferred room type and provide a reason.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type *</Label>
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger id="roomType" className="rounded-xl">
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md z-50">
                    {ROOM_TYPES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason *</Label>
                <Textarea
                  id="reason"
                  placeholder="Explain why you need this room type..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="rounded-xl resize-none"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-green-700 hover:bg-green-800 text-white rounded-xl"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      {applications.length > 0 && (
        <div className="flex gap-4 flex-wrap text-sm text-slate-500">
          <span>
            <span className="font-semibold text-amber-700">{pending.length}</span> pending
          </span>
          <span>·</span>
          <span>
            <span className="font-semibold text-green-700">
              {applications.filter((a) => a.status === "approved").length}
            </span>{" "}
            approved
          </span>
          <span>·</span>
          <span>
            <span className="font-semibold text-red-600">
              {applications.filter((a) => a.status === "rejected").length}
            </span>{" "}
            rejected
          </span>
        </div>
      )}

      {/* Pending */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Pending Review
          </h2>
          {pending.map((a) => (
            <Card key={a._id} className="rounded-2xl border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900 capitalize">
                      {ROOM_TYPES.find((r) => r.value === a.roomType)?.label ?? a.roomType}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="size-3" />
                      Applied on{" "}
                      {new Date(a.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 leading-relaxed">{a.reason}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Decided */}
      {decided.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Decided
          </h2>
          {decided.map((a) => (
            <Card
              key={a._id}
              className="rounded-2xl border-0 shadow-sm opacity-75 hover:opacity-100 transition-opacity"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900 capitalize">
                      {ROOM_TYPES.find((r) => r.value === a.roomType)?.label ?? a.roomType}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="size-3" />
                      {new Date(a.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 leading-relaxed">{a.reason}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty */}
      {applications.length === 0 && (
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="py-20 text-center">
            <FileText className="size-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No applications yet</p>
            <p className="text-sm text-slate-400 mt-1">
              Use the button above to apply for a room change.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
