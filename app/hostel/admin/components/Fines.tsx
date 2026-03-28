"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DollarSign, Plus } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminFines() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [applyTo, setApplyTo] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [target, setTarget] = useState("");

  const fines = [
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
  ];

  const handleApplyFine = () => {
    if (!applyTo || !amount || !reason || !target) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success("Fine applied successfully");
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setApplyTo("");
    setAmount("");
    setReason("");
    setTarget("");
  };

  const handleMarkPaid = (id: number) => {
    toast.success("Fine marked as paid");
  };

  const handleWaiveOff = (id: number) => {
    toast.success("Fine waived off");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Fines Management</h1>
          <p className="text-slate-600 mt-1">Apply and manage student fines</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Apply Fine
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apply Fine</DialogTitle>
              <DialogDescription>
                Apply fine to individual student, room, or floor
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="applyTo">Apply To *</Label>
                <Select value={applyTo} onValueChange={setApplyTo}>
                  <SelectTrigger id="applyTo">
                    <SelectValue placeholder="Select target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual Student</SelectItem>
                    <SelectItem value="room">Specific Room</SelectItem>
                    <SelectItem value="floor">Entire Floor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target">
                  {applyTo === "individual" ? "Registration Number" : applyTo === "room" ? "Room Number" : "Floor"} *
                </Label>
                <Input
                  id="target"
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

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="e.g., 500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason *</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter reason for fine..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleApplyFine} className="flex-1">
                  Apply Fine
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">Total Pending</p>
              <p className="text-3xl font-semibold text-yellow-600">₹1,500</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">Total Collected</p>
              <p className="text-3xl font-semibold text-green-600">₹8,300</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">This Month</p>
              <p className="text-3xl font-semibold text-slate-900">₹2,800</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fines List */}
      <div className="space-y-4">
        {fines.map((fine) => (
          <Card key={fine.id} className="border-slate-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{fine.studentName}</CardTitle>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-600">
                    <span>{fine.regNo}</span>
                    <span>Room: {fine.room}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-slate-900">₹{fine.amount}</p>
                  <span className={`text-xs px-2.5 py-1 rounded-full inline-block mt-1 ${
                    fine.status === "Paid" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {fine.status}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 mb-3">{fine.reason}</p>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span>Applied: {fine.appliedDate}</span>
                {fine.paidDate && <span>Paid: {fine.paidDate}</span>}
              </div>
              {fine.status === "Pending" && (
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleMarkPaid(fine.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Mark as Paid
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleWaiveOff(fine.id)}
                  >
                    Waive Off
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
