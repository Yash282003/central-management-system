"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Briefcase,
  Calendar,
  DollarSign,
  MessageSquare,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

interface Worker {
  id: number;
  name: string;
  role: string;
  phone: string;
  salary: number;
  joinDate: string;
  status: string;
}

const ROLE_COLORS: Record<string, string> = {
  Cook: "bg-orange-100 text-orange-700",
  Cleaner: "bg-blue-100 text-blue-700",
  "Security Guard": "bg-indigo-100 text-indigo-700",
  Electrician: "bg-violet-100 text-violet-700",
  Plumber: "bg-teal-100 text-teal-700",
  Default: "bg-gray-100 text-gray-700",
};

function roleColor(role: string) {
  return ROLE_COLORS[role] ?? ROLE_COLORS.Default;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AdminWorkers() {
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", role: "", phone: "", salary: "", joinDate: "" });

  const [workers, setWorkers] = useState<Worker[]>([
    { id: 1, name: "Ramesh Kumar", role: "Cook", phone: "+91 98765 00001", salary: 18000, joinDate: "Jan 2024", status: "Active" },
    { id: 2, name: "Sunil Yadav", role: "Cleaner", phone: "+91 98765 00002", salary: 12000, joinDate: "Mar 2024", status: "Active" },
    { id: 3, name: "Vijay Singh", role: "Security Guard", phone: "+91 98765 00003", salary: 15000, joinDate: "Feb 2024", status: "Active" },
    { id: 4, name: "Rajesh Patel", role: "Electrician", phone: "+91 98765 00004", salary: 16000, joinDate: "Jan 2024", status: "Active" },
  ]);

  const attendance = [
    { id: 1, name: "Ramesh Kumar", role: "Cook", date: "March 17, 2026", status: "Present" },
    { id: 2, name: "Sunil Yadav", role: "Cleaner", date: "March 17, 2026", status: "Present" },
    { id: 3, name: "Vijay Singh", role: "Security Guard", date: "March 17, 2026", status: "Present" },
    { id: 4, name: "Rajesh Patel", role: "Electrician", date: "March 17, 2026", status: "Absent" },
  ];

  const payments = [
    { id: 1, name: "Ramesh Kumar", month: "February 2026", amount: 18000, status: "Paid", date: "March 1, 2026" },
    { id: 2, name: "Sunil Yadav", month: "February 2026", amount: 12000, status: "Paid", date: "March 1, 2026" },
    { id: 3, name: "Vijay Singh", month: "February 2026", amount: 15000, status: "Pending", date: "-" },
    { id: 4, name: "Rajesh Patel", month: "February 2026", amount: 16000, status: "Pending", date: "-" },
  ];

  const complaints = [
    { id: 1, worker: "Ramesh Kumar", complaint: "Delayed in preparing breakfast", date: "March 15, 2026", status: "Resolved" },
    { id: 2, worker: "Sunil Yadav", complaint: "Not cleaning common areas properly", date: "March 12, 2026", status: "In Progress" },
  ];

  const handleAdd = () => {
    if (!form.name.trim() || !form.role || !form.phone.trim()) {
      toast.error("Name, role, and phone are required");
      return;
    }
    const newWorker: Worker = {
      id: Date.now(),
      name: form.name,
      role: form.role,
      phone: form.phone,
      salary: Number(form.salary) || 0,
      joinDate: form.joinDate || new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      status: "Active",
    };
    setWorkers((prev) => [...prev, newWorker]);
    setForm({ name: "", role: "", phone: "", salary: "", joinDate: "" });
    setAddOpen(false);
    toast.success("Worker added successfully");
  };

  const handleDelete = (id: number) => {
    setWorkers((prev) => prev.filter((w) => w.id !== id));
    setDeleteId(null);
    toast.success("Worker removed");
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Workers Management</h1>
          <p className="text-gray-500 text-sm">Manage staff, attendance, payments, and issues</p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2"
        >
          <Plus className="size-4" />
          Add Worker
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-emerald-600 mb-1">Total Workers</p>
            <p className="text-3xl font-bold text-emerald-700">{workers.length}</p>
            <p className="text-xs text-emerald-500 mt-1">active staff</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-blue-600 mb-1">Present Today</p>
            <p className="text-3xl font-bold text-blue-700">
              {attendance.filter((a) => a.status === "Present").length}
            </p>
            <p className="text-xs text-blue-500 mt-1">of {attendance.length} workers</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-orange-600 mb-1">Payments Pending</p>
            <p className="text-3xl font-bold text-orange-700">
              {payments.filter((p) => p.status === "Pending").length}
            </p>
            <p className="text-xs text-orange-500 mt-1">this month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workers" className="w-full">
        <TabsList className="rounded-xl bg-gray-100 p-1 mb-6">
          <TabsTrigger value="workers" className="rounded-lg gap-2">
            <Briefcase className="size-4" />
            Workers
          </TabsTrigger>
          <TabsTrigger value="attendance" className="rounded-lg gap-2">
            <Calendar className="size-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="payments" className="rounded-lg gap-2">
            <DollarSign className="size-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="complaints" className="rounded-lg gap-2">
            <MessageSquare className="size-4" />
            Complaints
          </TabsTrigger>
        </TabsList>

        {/* Workers Grid */}
        <TabsContent value="workers">
          {workers.length === 0 ? (
            <div className="py-20 text-center">
              <Users className="size-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No workers added yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {workers.map((worker) => (
                <Card key={worker.id} className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="size-11 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                          {getInitials(worker.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 leading-tight">{worker.name}</p>
                          <Badge className={`text-xs border-0 mt-0.5 ${roleColor(worker.role)}`}>
                            {worker.role}
                          </Badge>
                        </div>
                      </div>
                      <button
                        onClick={() => setDeleteId(worker.id)}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center justify-between text-gray-600">
                        <span className="text-gray-400">Phone</span>
                        <a href={`tel:${worker.phone}`} className="font-medium hover:text-emerald-600">
                          {worker.phone}
                        </a>
                      </div>
                      <div className="flex items-center justify-between text-gray-600">
                        <span className="text-gray-400">Salary</span>
                        <span className="font-medium">₹{worker.salary.toLocaleString()}/mo</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-600">
                        <span className="text-gray-400">Joined</span>
                        <span className="font-medium">{worker.joinDate}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
                        {worker.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Attendance */}
        <TabsContent value="attendance">
          <Card className="rounded-2xl border-0 shadow-sm">
            <div className="px-5 pt-5 pb-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Today's Attendance</h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-600">Name</TableHead>
                    <TableHead className="font-semibold text-gray-600">Role</TableHead>
                    <TableHead className="font-semibold text-gray-600">Date</TableHead>
                    <TableHead className="font-semibold text-gray-600">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((record) => (
                    <TableRow key={record.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium text-gray-900">{record.name}</TableCell>
                      <TableCell>
                        <Badge className={`text-xs border-0 ${roleColor(record.role)}`}>{record.role}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">{record.date}</TableCell>
                      <TableCell>
                        <Badge
                          className={`text-xs border-0 ${
                            record.status === "Present"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Payments */}
        <TabsContent value="payments">
          <Card className="rounded-2xl border-0 shadow-sm">
            <div className="px-5 pt-5 pb-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Payment Status</h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-600">Name</TableHead>
                    <TableHead className="font-semibold text-gray-600">Month</TableHead>
                    <TableHead className="font-semibold text-gray-600">Amount</TableHead>
                    <TableHead className="font-semibold text-gray-600">Status</TableHead>
                    <TableHead className="font-semibold text-gray-600">Payment Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium text-gray-900">{payment.name}</TableCell>
                      <TableCell className="text-gray-600">{payment.month}</TableCell>
                      <TableCell className="font-semibold text-gray-900">₹{payment.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          className={`text-xs border-0 ${
                            payment.status === "Paid"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">{payment.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Complaints */}
        <TabsContent value="complaints">
          {complaints.length === 0 ? (
            <div className="py-20 text-center">
              <MessageSquare className="size-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No complaints filed</p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <Card key={complaint.id} className="rounded-2xl border-0 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-gray-900">{complaint.worker}</p>
                          <Badge
                            className={`text-xs border-0 ${
                              complaint.status === "Resolved"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {complaint.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{complaint.complaint}</p>
                        <p className="text-xs text-gray-400">{complaint.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Worker Dialog */}
      <Dialog open={addOpen} onOpenChange={(o) => { setAddOpen(o); if (!o) setForm({ name: "", role: "", phone: "", salary: "", joinDate: "" }); }}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add New Worker</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium text-gray-700">Full Name *</Label>
              <Input
                className="rounded-xl mt-1"
                placeholder="e.g., Ramesh Kumar"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Role *</Label>
              <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}>
                <SelectTrigger className="rounded-xl mt-1">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {["Cook", "Cleaner", "Security Guard", "Electrician", "Plumber", "Other"].map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Phone *</Label>
              <Input
                className="rounded-xl mt-1"
                placeholder="+91 98765 00000"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium text-gray-700">Salary (₹/mo)</Label>
                <Input
                  className="rounded-xl mt-1"
                  type="number"
                  placeholder="0"
                  value={form.salary}
                  onChange={(e) => setForm((f) => ({ ...f, salary: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Join Date</Label>
                <Input
                  className="rounded-xl mt-1"
                  placeholder="Jan 2024"
                  value={form.joinDate}
                  onChange={(e) => setForm((f) => ({ ...f, joinDate: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAddOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
            >
              Add Worker
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Remove Worker</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 text-sm">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-gray-900">
              {workers.find((w) => w.id === deleteId)?.name}
            </span>
            ? This action cannot be undone.
          </p>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && handleDelete(deleteId)}
              className="rounded-xl"
            >
              Remove Worker
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
