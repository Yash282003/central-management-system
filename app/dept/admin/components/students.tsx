"use client"
import { useState, useEffect } from "react";
import { Search, GraduationCap, Trash2, UserX } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface Student {
  _id: string;
  name: { first: string; middle?: string; last: string };
  regdNo: string;
  branch: string;
  email: string;
  mobile?: string;
  semester?: number;
}

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchStudents() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/manage-students");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setStudents(Array.isArray(data.data) ? data.data : []);
    } catch {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  const fullName = (s: Student) => `${s.name?.first ?? ""} ${s.name?.last ?? ""}`.trim();

  const filtered = students.filter(s =>
    fullName(s).toLowerCase().includes(search.toLowerCase()) ||
    s.regdNo?.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/manage-students?id=${confirmDelete._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success(`${fullName(confirmDelete)} has been removed`);
      setStudents(prev => prev.filter(s => s._id !== confirmDelete._id));
      setConfirmDelete(null);
    } catch {
      toast.error("Failed to delete student");
    } finally {
      setDeleting(false);
    }
  }

  const initials = (s: Student) =>
    `${s.name?.first?.[0] ?? ""}${s.name?.last?.[0] ?? ""}`.toUpperCase() || "??";

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Student Management</h1>
          <p className="text-gray-600">
            {loading ? "Loading students..." : `${students.length} students enrolled`}
          </p>
        </div>
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
            { label: "Total Students", value: students.length, icon: <GraduationCap className="size-5 text-blue-600" />, bg: "bg-blue-50" },
            { label: "Branches", value: new Set(students.map(s => s.branch)).size, icon: <GraduationCap className="size-5 text-green-600" />, bg: "bg-green-50" },
            { label: "Search Results", value: filtered.length, icon: <Search className="size-5 text-purple-600" />, bg: "bg-purple-50" },
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
            placeholder="Search by name or registration no..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
        {search && (
          <span className="text-sm text-gray-500">{filtered.length} results</span>
        )}
      </div>

      {/* Table */}
      <Card className="rounded-2xl border-0 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-600">Student</TableHead>
                <TableHead className="font-semibold text-gray-600">Regd. No</TableHead>
                <TableHead className="font-semibold text-gray-600">Branch</TableHead>
                <TableHead className="font-semibold text-gray-600">Email</TableHead>
                <TableHead className="font-semibold text-gray-600">Mobile</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
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
                    <p className="text-gray-500 font-medium">No students found</p>
                    {search && <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(student => (
                  <TableRow key={student._id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-9 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-700 flex-shrink-0">
                          {initials(student)}
                        </div>
                        <span className="font-medium text-gray-900 text-sm">{fullName(student)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-mono text-gray-700">{student.regdNo}</TableCell>
                    <TableCell>
                      {student.branch ? (
                        <Badge variant="secondary" className="text-xs">{student.branch}</Badge>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{student.email}</TableCell>
                    <TableCell className="text-sm text-gray-600">{student.mobile || "—"}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => setConfirmDelete(student)}
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

      {/* Confirm Delete Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={o => { if (!o) setConfirmDelete(null); }}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Remove Student</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to remove <span className="font-semibold text-gray-900">{confirmDelete ? fullName(confirmDelete) : ""}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="outline" onClick={() => setConfirmDelete(null)} className="rounded-xl">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting} className="rounded-xl">
              {deleting ? "Removing..." : "Remove Student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
