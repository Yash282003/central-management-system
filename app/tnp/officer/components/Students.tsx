"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchTnpStudents } from "@/services/student/fetchTnpStudents";

/* ─── Types ─────────────────────────────────────────────────────────────── */
type StudentName = { first: string; middle?: string; last: string };
type Student = {
  _id: string;
  name: StudentName;
  regdNo: string;
  branch: string;
  cgpa: number;
  status: "PLACED" | "UNPLACED" | "INELIGIBLE";
  companyName?: string;
  package?: number;
  email?: string;
  mobile?: string;
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/* ─── Constants ─────────────────────────────────────────────────────────── */
const BRANCHES = ["ALL", "CSE", "IT", "ECE", "CIVIL", "EE", "EEE", "MECH"];
const STATUSES = ["ALL", "PLACED", "UNPLACED", "INELIGIBLE"];
const PAGE_SIZE = 10;
const DEBOUNCE_MS = 400;

const statusConfig: Record<string, { label: string; cls: string }> = {
  PLACED:     { label: "Placed",     cls: "bg-green-100 text-green-700 border-green-200" },
  UNPLACED:   { label: "Unplaced",   cls: "bg-orange-100 text-orange-700 border-orange-200" },
  INELIGIBLE: { label: "Ineligible", cls: "bg-red-100 text-red-700 border-red-200" },
};

/* ─── Skeleton row ──────────────────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
        </td>
      ))}
    </tr>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────── */
export default function OfficerStudents() {
  const [students, setStudents]     = useState<Student[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  // Filters
  const [rawSearch, setRawSearch]   = useState("");
  const [search, setSearch]         = useState("");
  const [branch, setBranch]         = useState("ALL");
  const [status, setStatus]         = useState("ALL");
  const [page, setPage]             = useState(1);

  /* Debounce search input */
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(rawSearch);
      setPage(1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [rawSearch]);

  /* Reset page on filter change */
  useEffect(() => { setPage(1); }, [branch, status]);

  /* Fetch data */
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchTnpStudents({ search, branch, status, page, limit: PAGE_SIZE });
      if (res?.success) {
        setStudents(res.data ?? []);
        setPagination(res.pagination ?? null);
      } else {
        setError(res?.message ?? "Failed to load students.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, branch, status, page]);

  useEffect(() => { load(); }, [load]);

  /* Derived stats (from full filter, not just current page — from pagination) */
  const total    = pagination?.total ?? 0;
  const placed   = students.filter((s) => s.status === "PLACED").length;
  const unplaced = students.filter((s) => s.status === "UNPLACED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Student Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage student profiles and placement status
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm">
          + Add Student
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Students", value: pagination?.total ?? 0, color: "text-indigo-600", bg: "bg-indigo-50", icon: <Users className="w-5 h-5 text-indigo-500" /> },
          { label: "Placed",         value: students.filter(s => s.status === "PLACED").length,   color: "text-green-600",  bg: "bg-green-50",  icon: <CheckCircle2 className="w-5 h-5 text-green-500" /> },
          { label: "Unplaced",       value: students.filter(s => s.status === "UNPLACED").length, color: "text-orange-600", bg: "bg-orange-50", icon: <XCircle className="w-5 h-5 text-orange-500" /> },
        ].map(({ label, value, color, bg, icon }) => (
          <Card key={label} className={`${bg} border-0 shadow-none`}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
              <div>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid sm:grid-cols-4 gap-3">
            {/* Search */}
            <div className="sm:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <Input
                id="student-search"
                type="search"
                placeholder="Search by name or registration number..."
                className="pl-9 text-sm"
                value={rawSearch}
                onChange={(e) => setRawSearch(e.target.value)}
              />
            </div>

            {/* Branch filter */}
            <Select value={branch} onValueChange={(v) => { setBranch(v); }}>
              <SelectTrigger id="branch-filter" className="text-sm">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                {BRANCHES.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b === "ALL" ? "All Branches" : b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status filter */}
            <Select value={status} onValueChange={(v) => { setStatus(v); }}>
              <SelectTrigger id="status-filter" className="text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "ALL" ? "All Statuses" : s.charAt(0) + s.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Name", "Reg No", "Branch", "CGPA", "Status", "Company", "Package", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {/* Loading skeleton */}
                {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

                {/* Error state */}
                {!loading && error && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-red-500 text-sm">
                      {error}
                    </td>
                  </tr>
                )}

                {/* Empty state */}
                {!loading && !error && students.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <Users className="w-10 h-10" />
                        <p className="font-medium text-gray-500">No students found</p>
                        <p className="text-xs">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Data rows */}
                {!loading && !error && students.map((student) => {
                  const fullName = [student.name?.first, student.name?.last].filter(Boolean).join(" ");
                  const sc = statusConfig[student.status] ?? statusConfig.UNPLACED;
                  const pkg = student.package && student.package > 0
                    ? `${student.package} LPA`
                    : "-";
                  const company = student.companyName?.trim() || "-";

                  return (
                    <tr
                      key={student._id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      {/* Name */}
                      <td className="px-4 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                        {fullName || "—"}
                      </td>

                      {/* Reg No */}
                      <td className="px-4 py-3.5 text-gray-500 font-mono text-xs whitespace-nowrap">
                        {student.regdNo}
                      </td>

                      {/* Branch */}
                      <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                        {student.branch}
                      </td>

                      {/* CGPA */}
                      <td className="px-4 py-3.5 font-semibold text-gray-800 whitespace-nowrap">
                        {student.cgpa?.toFixed(2) ?? "—"}
                      </td>

                      {/* Status badge */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <Badge className={`text-[11px] px-2 py-0.5 border font-medium ${sc.cls}`}>
                          {sc.label}
                        </Badge>
                      </td>

                      {/* Company */}
                      <td className="px-4 py-3.5 text-gray-700 whitespace-nowrap">
                        {company === "-"
                          ? <span className="text-gray-300">—</span>
                          : company}
                      </td>

                      {/* Package */}
                      <td className={`px-4 py-3.5 font-medium whitespace-nowrap ${pkg === "-" ? "text-gray-300" : "text-green-600"}`}>
                        {pkg === "-" ? "—" : pkg}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
                              id={`actions-${student._id}`}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white text-black w-44">
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4 text-indigo-500" />
                              View Student
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Pencil className="mr-2 h-4 w-4 text-blue-500" />
                              Edit Student
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Student
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && !loading && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-700">
                  {(pagination.page - 1) * pagination.limit + 1}–
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{" "}
                of <span className="font-medium text-gray-700">{pagination.total}</span> students
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((p) =>
                    p === 1 ||
                    p === pagination.totalPages ||
                    Math.abs(p - page) <= 1
                  )
                  .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "…" ? (
                      <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-xs">…</span>
                    ) : (
                      <Button
                        key={p}
                        variant={p === page ? "default" : "outline"}
                        size="sm"
                        className={`h-8 w-8 p-0 text-xs ${p === page ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700" : ""}`}
                        onClick={() => setPage(p as number)}
                      >
                        {p}
                      </Button>
                    )
                  )}

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2"
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}