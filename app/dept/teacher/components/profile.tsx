"use client"
import { useState, useEffect } from "react";
import { User, Mail, Phone, Award, BookOpen, Pencil, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Teacher {
  _id: string;
  name: { first: string; middle?: string; last: string };
  email: string;
  mobile?: string;
  employeeId?: string;
  department: string;
  designation?: string;
}

export default function TeacherProfile() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    designation: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/teacher/me");
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        const t: Teacher = data.data;
        setTeacher(t);
        setDraft({
          firstName: t.name?.first ?? "",
          lastName: t.name?.last ?? "",
          mobile: t.mobile ?? "",
          designation: t.designation ?? "",
        });
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    if (!draft.firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/teacher/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: draft.firstName,
          lastName: draft.lastName,
          mobile: draft.mobile,
          designation: draft.designation,
        }),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      const data = await res.json();
      const updated: Teacher = data.data ?? data.teacher ?? data;
      setTeacher(updated);
      setDraft({
        firstName: updated.name?.first ?? draft.firstName,
        lastName: updated.name?.last ?? draft.lastName,
        mobile: updated.mobile ?? draft.mobile,
        designation: updated.designation ?? draft.designation,
      });
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  function startEdit() {
    if (!teacher) return;
    setDraft({
      firstName: teacher.name?.first ?? "",
      lastName: teacher.name?.last ?? "",
      mobile: teacher.mobile ?? "",
      designation: teacher.designation ?? "",
    });
    setEditing(true);
  }

  const fullName = teacher
    ? `${teacher.name?.first ?? ""} ${teacher.name?.last ?? ""}`.trim()
    : "";

  const initials = teacher
    ? `${teacher.name?.first?.[0] ?? ""}${teacher.name?.last?.[0] ?? ""}`.toUpperCase()
    : "??";

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <div className="lg:col-span-2">
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="p-8 text-center text-gray-500">
        <User className="size-12 mx-auto mb-3 opacity-30" />
        <p>Could not load profile. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">My Profile</h1>
        <p className="text-gray-600">Manage your professional profile</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Avatar + Quick Info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="size-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
                {initials}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{fullName || "—"}</h2>
              <p className="text-sm text-blue-600 font-medium mb-2">{teacher.designation || "Teacher"}</p>
              <Badge variant="outline">{teacher.department}</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="size-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700 break-all">{teacher.email}</span>
              </div>
              {teacher.mobile && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="size-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700">{teacher.mobile}</span>
                </div>
              )}
              {teacher.employeeId && (
                <div className="flex items-center gap-3 text-sm">
                  <User className="size-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700 font-mono">{teacher.employeeId}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right — Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                {!editing ? (
                  <button
                    onClick={startEdit}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
                    >
                      <Check className="size-3.5" />
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <X className="size-3.5" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                {/* Editable fields */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">First Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={draft.firstName}
                      onChange={e => setDraft(p => ({ ...p, firstName: e.target.value }))}
                      className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 text-sm py-2">{teacher.name?.first || "—"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Last Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={draft.lastName}
                      onChange={e => setDraft(p => ({ ...p, lastName: e.target.value }))}
                      className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 text-sm py-2">{teacher.name?.last || "—"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Mobile</label>
                  {editing ? (
                    <input
                      type="text"
                      value={draft.mobile}
                      onChange={e => setDraft(p => ({ ...p, mobile: e.target.value }))}
                      placeholder="e.g. 9876543210"
                      className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 text-sm py-2">{teacher.mobile || "—"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Designation</label>
                  {editing ? (
                    <input
                      type="text"
                      value={draft.designation}
                      onChange={e => setDraft(p => ({ ...p, designation: e.target.value }))}
                      placeholder="e.g. Associate Professor"
                      className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 text-sm py-2">{teacher.designation || "—"}</p>
                  )}
                </div>

                {/* Read-only fields */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email Address</label>
                  <p className="text-gray-900 text-sm py-2">{teacher.email}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Employee ID</label>
                  <p className="text-gray-900 text-sm py-2 font-mono">{teacher.employeeId || "—"}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Department</label>
                  <p className="text-gray-900 text-sm py-2">{teacher.department}</p>
                </div>
              </div>
              {editing && (
                <p className="text-xs text-gray-400 mt-4">Email, Employee ID, and Department are read-only.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
