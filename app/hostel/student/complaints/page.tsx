"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  MessageSquare,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface Complaint {
  _id: string;
  category: string;
  description: string;
  status: string;
  createdAt: string;
}

const CATEGORIES = [
  { value: "maintenance", label: "Maintenance" },
  { value: "food", label: "Food / Mess" },
  { value: "cleanliness", label: "Cleanliness" },
  { value: "security", label: "Security" },
  { value: "other", label: "Other" },
];

function StatusBadge({ status }: { status: string }) {
  if (status === "resolved") {
    return (
      <Badge className="bg-green-100 text-green-700 border-green-200" variant="outline">
        Resolved
      </Badge>
    );
  }
  if (status === "in-progress") {
    return (
      <Badge className="bg-blue-100 text-blue-700 border-blue-200" variant="outline">
        In Progress
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-100 text-amber-700 border-amber-200" variant="outline">
      Open
    </Badge>
  );
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/hostel/student/complaints");
      const data = await res.json();
      setComplaints(Array.isArray(data.data) ? data.data : []);
    } catch {
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/hostel/student/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, description }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      toast.success("Complaint filed successfully");
      setCategory("");
      setDescription("");
      setDialogOpen(false);
      fetchComplaints();
    } catch {
      toast.error("Failed to submit complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const open = complaints.filter(
    (c) => c.status === "open" || c.status === "in-progress"
  );
  const resolved = complaints.filter((c) => c.status === "resolved");

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
        {[1, 2, 3].map((i) => (
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
          <h1 className="text-2xl font-semibold text-slate-900">Complaints</h1>
          <p className="text-slate-500 mt-1">
            File and track your hostel complaints
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-700 hover:bg-green-800 text-white rounded-xl">
              <Plus className="size-4 mr-2" />
              File Complaint
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-white/95 backdrop-blur-md">
            <DialogHeader>
              <DialogTitle>File a Complaint</DialogTitle>
              <DialogDescription>
                Describe your issue and we'll look into it promptly.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="rounded-xl">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md z-50">
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                    "Submit Complaint"
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
      {complaints.length > 0 && (
        <div className="flex gap-4 flex-wrap text-sm text-slate-500">
          <span>
            <span className="font-semibold text-amber-700">{open.length}</span> open
          </span>
          <span>·</span>
          <span>
            <span className="font-semibold text-green-700">{resolved.length}</span> resolved
          </span>
        </div>
      )}

      {/* Open / In-Progress */}
      {open.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
            <AlertCircle className="size-4 text-amber-500" />
            Active Complaints
          </h2>
          {open.map((c) => (
            <Card key={c._id} className="rounded-2xl border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900 capitalize">{c.category}</p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="size-3" />
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {c.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Resolved */}
      {resolved.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
            <CheckCircle2 className="size-4 text-green-500" />
            Resolved
          </h2>
          {resolved.map((c) => (
            <Card
              key={c._id}
              className="rounded-2xl border-0 shadow-sm opacity-70 hover:opacity-100 transition-opacity"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900 capitalize">{c.category}</p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="size-3" />
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {c.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {complaints.length === 0 && (
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="py-20 text-center">
            <MessageSquare className="size-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No complaints filed yet</p>
            <p className="text-sm text-slate-400 mt-1">
              Use the button above to report any issue.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
