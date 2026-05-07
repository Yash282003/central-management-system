"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Receipt, Plus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Fine {
  id: number;
  studentName: string;
  regNo: string;
  room: string;
  amount: number;
  reason: string;
  status: "Pending" | "Paid";
  appliedDate: string;
  paidDate?: string;
}

export default function AdminFines() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [applyTo, setApplyTo] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [target, setTarget] = useState("");
  const [filter, setFilter] = useState("all");

  const [fines, setFines] = useState<Fine[]>([
    {
      id: 1,
      studentName: "Rahul Sharma",
      regNo: "21BCE1234",
      room: "A-204",
      amount: 500,
      reason: "Late return from leave",
      status: "Pending",
      appliedDate: "March 15, 2026",
    },
    {
      id: 2,
      studentName: "Priya Singh",
      regNo: "21BCE1245",
      room: "B-305",
      amount: 300,
      reason: "Room cleanliness violation",
      status: "Paid",
      appliedDate: "March 12, 2026",
      paidDate: "March 14, 2026",
    },
    {
      id: 3,
      studentName: "Amit Patel",
      regNo: "21BCE1256",
      room: "C-102",
      amount: 1000,
      reason: "Damage to hostel property",
      status: "Pending",
      appliedDate: "March 10, 2026",
    },
  ]);

  const totalPending = fines
    .filter((f) => f.status === "Pending")
    .reduce((s, f) => s + f.amount, 0);
  const totalCollected = fines
    .filter((f) => f.status === "Paid")
    .reduce((s, f) => s + f.amount, 0);
  const pendingCount = fines.filter((f) => f.status === "Pending").length;

  const filtered = fines.filter((f) => {
    if (filter === "pending") return f.status === "Pending";
    if (filter === "paid") return f.status === "Paid";
    return true;
  });

  const resetForm = () => {
    setApplyTo("");
    setAmount("");
    setReason("");
    setTarget("");
  };

  const handleApplyFine = () => {
    if (!applyTo || !amount || !reason || !target) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success("Fine applied successfully");
    resetForm();
    setIsDialogOpen(false);
  };

  const handleMarkPaid = (id: number) => {
    setFines((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: "Paid", paidDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) } : f
      )
    );
    toast.success("Fine marked as paid");
  };

  const handleWaiveOff = (id: number) => {
    setFines((prev) => prev.filter((f) => f.id !== id));
    toast.success("Fine waived off");
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Fines Management</h1>
          <p className="text-gray-500 text-sm">Apply and manage student fines</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2">
              <Plus className="size-4" />
              Apply Fine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Apply Fine</DialogTitle>
              <DialogDescription className="text-gray-500">
                Apply fine to individual student, room, or floor
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label className="text-sm font-medium text-gray-700">Apply To *</Label>
                <Select value={applyTo} onValueChange={setApplyTo}>
                  <SelectTrigger className="rounded-xl mt-1">
                    <SelectValue placeholder="Select target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual Student</SelectItem>
                    <SelectItem value="room">Specific Room</SelectItem>
                    <SelectItem value="floor">Entire Floor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  {applyTo === "individual"
                    ? "Registration Number"
                    : applyTo === "room"
                    ? "Room Number"
                    : "Floor"}{" "}
                  *
                </Label>
                <Input
                  className="rounded-xl mt-1"
                  placeholder={
                    applyTo === "individual"
                      ? "e.g., 21BCE1234"
                      : applyTo === "room"
                      ? "e.g., A-204"
                      : "e.g., Floor A"
                  }
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Amount (₹) *</Label>
                <Input
                  className="rounded-xl mt-1"
                  type="number"
                  placeholder="e.g., 500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Reason *</Label>
                <Textarea
                  className="rounded-xl mt-1 resize-none"
                  placeholder="Enter reason for fine..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button
                onClick={handleApplyFine}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
              >
                Apply Fine
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-orange-600 mb-1">Total Pending</p>
            <p className="text-3xl font-bold text-orange-700">₹{totalPending.toLocaleString()}</p>
            <p className="text-xs text-orange-500 mt-1">{pendingCount} fines outstanding</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-emerald-600 mb-1">Total Collected</p>
            <p className="text-3xl font-bold text-emerald-700">₹{totalCollected.toLocaleString()}</p>
            <p className="text-xs text-emerald-500 mt-1">{fines.filter((f) => f.status === "Paid").length} fines paid</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-blue-600 mb-1">Total Fines</p>
            <p className="text-3xl font-bold text-blue-700">{fines.length}</p>
            <p className="text-xs text-blue-500 mt-1">all time</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "paid", label: "Paid" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === key
                ? "bg-emerald-600 text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Fines List */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <Receipt className="size-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No fines found</p>
          <p className="text-gray-400 text-sm mt-1">Apply a fine to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((fine) => (
            <Card
              key={fine.id}
              className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{fine.studentName}</p>
                      <Badge
                        className={`text-xs border-0 ${
                          fine.status === "Paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {fine.status}
                      </Badge>
                      <span className="text-sm text-gray-500 font-mono">{fine.regNo}</span>
                      <span className="text-xs text-gray-400">Room {fine.room}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{fine.reason}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>Applied: {fine.appliedDate}</span>
                      {fine.paidDate && (
                        <>
                          <span>·</span>
                          <span className="text-emerald-600">Paid: {fine.paidDate}</span>
                        </>
                      )}
                    </div>
                    {fine.status === "Pending" && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          onClick={() => handleMarkPaid(fine.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg gap-1.5"
                        >
                          <CheckCircle2 className="size-3.5" />
                          Mark as Paid
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWaiveOff(fine.id)}
                          className="rounded-lg"
                        >
                          Waive Off
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-gray-900">₹{fine.amount.toLocaleString()}</p>
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
