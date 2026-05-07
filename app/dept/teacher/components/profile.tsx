"use client";
import { useState, useEffect } from "react";
import { User, Mail, Phone, Loader2, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [designation, setDesignation] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/teacher/me");
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        const t: Teacher = data.data;
        setTeacher(t);
        setFirstName(t.name?.first ?? "");
        setLastName(t.name?.last ?? "");
        setMobile(t.mobile ?? "");
        setDesignation(t.designation ?? "");
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/teacher/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, mobile, designation }),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      const data = await res.json();
      const updated: Teacher = data.data ?? data.teacher ?? data;
      setTeacher(updated);
      setFirstName(updated.name?.first ?? firstName);
      setLastName(updated.name?.last ?? lastName);
      setMobile(updated.mobile ?? mobile);
      setDesignation(updated.designation ?? designation);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  const fullName = teacher
    ? `${teacher.name?.first ?? ""} ${teacher.name?.last ?? ""}`.trim()
    : "";

  const initials = teacher
    ? `${teacher.name?.first?.[0] ?? ""}${teacher.name?.last?.[0] ?? ""}`.toUpperCase()
    : "??";

  if (loading) {
    return (
      <div className="p-8">
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-4 w-64 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <div className="lg:col-span-2">
            <Skeleton className="h-80 rounded-2xl" />
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
        <p className="text-gray-500 text-sm">Manage your professional profile</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Avatar + Quick Info */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="size-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
                {initials}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{fullName || "—"}</h2>
              <p className="text-sm text-blue-600 font-medium mb-3">{teacher.designation || "Teacher"}</p>
              <Badge className="bg-blue-100 text-blue-700 border-0">{teacher.department}</Badge>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="size-8 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="size-4 text-orange-500" />
                </div>
                <span className="text-gray-700 break-all text-xs">{teacher.email}</span>
              </div>
              {teacher.mobile && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="size-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="size-4 text-green-500" />
                  </div>
                  <span className="text-gray-700 text-xs">{teacher.mobile}</span>
                </div>
              )}
              {teacher.employeeId && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="size-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="size-4 text-blue-500" />
                  </div>
                  <span className="text-gray-700 font-mono text-xs">{teacher.employeeId}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right — Edit Form */}
        <div className="lg:col-span-2">
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Edit Personal Information</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Update your name, mobile, and designation below.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="mobile" className="flex items-center gap-1.5">
                    <Phone className="size-3.5" />
                    Mobile
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Associate Professor"
                    className="rounded-xl"
                  />
                </div>

                {/* Read-only fields */}
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5 text-gray-500">
                    <Lock className="size-3.5" />
                    Email Address
                  </Label>
                  <Input
                    value={teacher.email}
                    disabled
                    className="rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1.5 text-gray-500">
                      <Lock className="size-3.5" />
                      Employee ID
                    </Label>
                    <Input
                      value={teacher.employeeId ?? "—"}
                      disabled
                      className="rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1.5 text-gray-500">
                      <Lock className="size-3.5" />
                      Department
                    </Label>
                    <Input
                      value={teacher.department}
                      disabled
                      className="rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={saving} className="rounded-xl px-6">
                    {saving ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
