"use client"
import { useState, useEffect } from "react";
import { BookOpen, Plus, Search, Trash2, BookOpenCheck } from "lucide-react";
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

const BRANCHES = ["CSE", "ECE", "EEE", "ME", "CE", "IT", "MCA", "MBA"];

interface Course {
  _id: string;
  name: string;
  code: string;
  credits: number;
  branch: string;
  semester: number;
  teacherName: string;
  description?: string;
}

const emptyForm = {
  name: "",
  code: "",
  credits: 3,
  branch: "",
  semester: 1,
  teacherName: "",
  description: "",
};

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [branchFilter, setBranchFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function fetchCourses(branch?: string) {
    setLoading(true);
    try {
      const url = branch && branch !== "all"
        ? `/api/dept/courses?branch=${encodeURIComponent(branch)}`
        : "/api/dept/courses";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch courses");
      const data = await res.json();
      setCourses(Array.isArray(data.data) ? data.data : []);
    } catch {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCourses(branchFilter);
  }, [branchFilter]);

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  async function handleAdd() {
    if (!form.name.trim() || !form.code.trim() || !form.branch) {
      toast.error("Name, code, and branch are required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/dept/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add course");
      toast.success("Course added successfully");
      setOpen(false);
      setForm(emptyForm);
      fetchCourses(branchFilter);
    } catch {
      toast.error("Failed to add course");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/dept/courses?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete course");
      toast.success("Course deleted");
      setCourses(prev => prev.filter(c => c._id !== id));
    } catch {
      toast.error("Failed to delete course");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Course Management</h1>
          <p className="text-gray-600">Manage department courses and curriculum</p>
        </div>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
          <Plus className="size-4" />
          Add Course
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))
        ) : (
          <>
            <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-5">
                <p className="text-xs font-medium text-blue-600 mb-1">Total Courses</p>
                <p className="text-3xl font-bold text-blue-700">{courses.length}</p>
                <p className="text-xs text-blue-500 mt-1">across all branches</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardContent className="p-5">
                <p className="text-xs font-medium text-emerald-600 mb-1">Total Credits</p>
                <p className="text-3xl font-bold text-emerald-700">{courses.reduce((a, c) => a + (c.credits || 0), 0)}</p>
                <p className="text-xs text-emerald-500 mt-1">credit hours</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-violet-50 to-purple-50">
              <CardContent className="p-5">
                <p className="text-xs font-medium text-violet-600 mb-1">Branches Covered</p>
                <p className="text-3xl font-bold text-violet-700">{new Set(courses.map(c => c.branch)).size}</p>
                <p className="text-xs text-violet-500 mt-1">departments</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search by name or code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 rounded-xl border-gray-200"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setBranchFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${branchFilter === "all" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
          >
            All Branches
          </button>
          {BRANCHES.map(b => (
            <button
              key={b}
              onClick={() => setBranchFilter(b)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${branchFilter === b ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="rounded-2xl border-0 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-600">Course</TableHead>
                <TableHead className="font-semibold text-gray-600">Code</TableHead>
                <TableHead className="font-semibold text-gray-600">Branch</TableHead>
                <TableHead className="font-semibold text-gray-600">Semester</TableHead>
                <TableHead className="font-semibold text-gray-600">Credits</TableHead>
                <TableHead className="font-semibold text-gray-600">Teacher</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center">
                    <BookOpenCheck className="size-10 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 font-medium">No courses found</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or add a new course</p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(course => (
                  <TableRow key={course._id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="size-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900 text-sm">{course.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">{course.code}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{course.branch}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">Sem {course.semester}</TableCell>
                    <TableCell className="text-sm text-gray-700">{course.credits} cr</TableCell>
                    <TableCell className="text-sm text-gray-600">{course.teacherName || "—"}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleDelete(course._id)}
                        disabled={deletingId === course._id}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
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

      {/* Add Course Dialog */}
      <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) setForm(emptyForm); }}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add New Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Name *</label>
              <Input
                placeholder="e.g. Advanced Algorithms"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Code *</label>
                <Input
                  placeholder="e.g. CS401"
                  value={form.code}
                  onChange={e => setForm(p => ({ ...p, code: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                <Input
                  type="number"
                  min={1}
                  max={6}
                  value={form.credits}
                  onChange={e => setForm(p => ({ ...p, credits: Number(e.target.value) }))}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
                <Select value={form.branch} onValueChange={v => setForm(p => ({ ...p, branch: v }))}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <Select value={String(form.semester)} onValueChange={v => setForm(p => ({ ...p, semester: Number(v) }))}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8].map(s => <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Name</label>
              <Input
                placeholder="e.g. Dr. Emily Carter"
                value={form.teacherName}
                onChange={e => setForm(p => ({ ...p, teacherName: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                placeholder="Brief course description..."
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleAdd} disabled={submitting} className="rounded-xl">
              {submitting ? "Adding..." : "Add Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
