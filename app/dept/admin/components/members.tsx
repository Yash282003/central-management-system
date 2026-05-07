"use client"
import { useState, useEffect } from "react";
import { Search, Plus, Trash2, Users, UserX, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

const DESIGNATIONS = ["Professor", "Associate Professor", "Assistant Professor", "Lecturer"];
const DEPARTMENTS = ["CSE", "ECE", "EEE", "ME", "CE", "IT", "MCA", "MBA"];

interface Teacher {
  _id: string;
  name?: { first?: string; middle?: string; last?: string } | string;
  firstName?: string;
  lastName?: string;
  employeeId: string;
  department: string;
  email: string;
  designation?: string;
  mobile?: string;
}

function teacherName(t: Teacher) {
  if (t.name && typeof t.name === "object") {
    return [t.name.first, t.name.last].filter(Boolean).join(" ") || "—";
  }
  if (typeof t.name === "string" && t.name) return t.name;
  return [t.firstName, t.lastName].filter(Boolean).join(" ") || "—";
}

const emptyForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  mobile: "",
  employeeId: "",
  department: "",
  designation: "",
  password: "",
};

export default function AdminMembers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Teacher | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function fetchTeachers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/manage-teachers");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTeachers(Array.isArray(data.data) ? data.data : []);
    } catch {
      toast.error("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTeachers();
  }, []);

  const filtered = teachers.filter(t => {
    const name = teacherName(t).toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || t.employeeId?.toLowerCase().includes(q) || t.department?.toLowerCase().includes(q);
  });

  async function handleAdd() {
    if (!form.firstName.trim() || !form.email.trim() || !form.employeeId.trim() || !form.department || !form.password.trim()) {
      toast.error("First name, email, employee ID, department, and password are required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/teacher/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to add teacher");
      }
      toast.success("Teacher added successfully");
      setOpen(false);
      setForm(emptyForm);
      fetchTeachers();
    } catch (e: any) {
      toast.error(e.message || "Failed to add teacher");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/manage-teachers?id=${confirmDelete._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success(`${teacherName(confirmDelete)} has been removed`);
      setTeachers(prev => prev.filter(t => t._id !== confirmDelete._id));
      setConfirmDelete(null);
    } catch {
      toast.error("Failed to delete teacher");
    } finally {
      setDeleting(false);
    }
  }

  const initials = (t: Teacher) =>
    teacherName(t).split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "??";

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Faculty Management</h1>
          <p className="text-gray-600">
            {loading ? "Loading faculty..." : `${teachers.length} faculty members`}
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
          <Plus className="size-4" />
          Add Teacher
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <Skeleton className="size-10 rounded-xl flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-20 mb-2" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          [
            { label: "Total Faculty", value: teachers.length, icon: <Users className="size-5 text-blue-600" />, bg: "bg-blue-50" },
            { label: "Departments", value: new Set(teachers.map(t => t.department)).size, icon: <Users className="size-5 text-green-600" />, bg: "bg-green-50" },
            { label: "Professors", value: teachers.filter(t => t.designation === "Professor").length, icon: <Users className="size-5 text-purple-600" />, bg: "bg-purple-50" },
          ].map(item => (
            <Card key={item.label} className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`size-10 ${item.bg} rounded-xl flex items-center justify-center`}>{item.icon}</div>
                <div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-xl font-semibold text-gray-900">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search by name, ID, or department..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
        {search && <span className="text-sm text-gray-500">{filtered.length} results</span>}
      </div>

      {/* Table */}
      <Card className="rounded-2xl border-0 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-600">Teacher</TableHead>
                <TableHead className="font-semibold text-gray-600">Employee ID</TableHead>
                <TableHead className="font-semibold text-gray-600">Department</TableHead>
                <TableHead className="font-semibold text-gray-600">Designation</TableHead>
                <TableHead className="font-semibold text-gray-600">Email</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-9 rounded-full flex-shrink-0" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </TableCell>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>
                    ))}
                    <TableCell><Skeleton className="h-8 w-8 rounded-lg" /></TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-center">
                    <UserX className="size-10 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 font-medium">No teachers found</p>
                    {search && <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(teacher => (
                  <TableRow key={teacher._id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
                          {initials(teacher)}
                        </div>
                        <span className="font-medium text-gray-900 text-sm">{teacherName(teacher)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-mono text-gray-700">{teacher.employeeId}</TableCell>
                    <TableCell>
                      {teacher.department ? (
                        <Badge variant="secondary" className="text-xs">{teacher.department}</Badge>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{teacher.designation || "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Mail className="size-3.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate max-w-[180px]">{teacher.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => setConfirmDelete(teacher)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add Teacher Dialog */}
      <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) setForm(emptyForm); }}>
        <DialogContent className="max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add New Teacher</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <Input
                  placeholder="John"
                  value={form.firstName}
                  onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                <Input
                  placeholder="A."
                  value={form.middleName}
                  onChange={e => setForm(p => ({ ...p, middleName: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <Input
                placeholder="Doe"
                value={form.lastName}
                onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <Input
                  type="email"
                  placeholder="john@university.edu"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <Input
                  placeholder="9876543210"
                  value={form.mobile}
                  onChange={e => setForm(p => ({ ...p, mobile: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                <Input
                  placeholder="EMP001"
                  value={form.employeeId}
                  onChange={e => setForm(p => ({ ...p, employeeId: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <Select value={form.department} onValueChange={v => setForm(p => ({ ...p, department: v }))}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select dept" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
              <Select value={form.designation} onValueChange={v => setForm(p => ({ ...p, designation: v }))}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select designation" />
                </SelectTrigger>
                <SelectContent>
                  {DESIGNATIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <Input
                type="password"
                placeholder="Set a secure password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleAdd} disabled={submitting} className="rounded-xl">
              {submitting ? "Adding..." : "Add Teacher"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={o => { if (!o) setConfirmDelete(null); }}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Remove Teacher</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to remove <span className="font-semibold text-gray-900">{confirmDelete ? teacherName(confirmDelete) : ""}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="outline" onClick={() => setConfirmDelete(null)} className="rounded-xl">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting} className="rounded-xl">
              {deleting ? "Removing..." : "Remove Teacher"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
