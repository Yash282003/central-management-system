"use client";

import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Hash,
  Loader2,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Student {
  _id: string;
  regdNo: string;
  branch: string;
  mobile: string;
  email: string;
  dob: string;
  profileUrl: string;
  address: string;
  name: {
    first: string;
    middle: string;
    last: string;
  };
}

export default function StudentProfile() {
  const [user, setUser] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/student/me");
        const json = await res.json();
        const data: Student = json?.data ?? json;
        if (data) {
          setUser(data);
          setFirstName(data.name?.first ?? "");
          setLastName(data.name?.last ?? "");
          setMobile(data.mobile ?? "");
          setAddress(data.address ?? "");
        }
      } catch {
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const res = await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: { first: firstName, last: lastName },
          mobile,
          address,
        }),
      });

      if (!res.ok) throw new Error("Save failed");

      setUser((prev) =>
        prev
          ? {
              ...prev,
              name: { ...prev.name, first: firstName, last: lastName },
              mobile,
              address,
            }
          : prev
      );
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-4 w-64 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <Skeleton className="h-72 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center text-slate-500">
        Unable to load profile. Please refresh.
      </div>
    );
  }

  const fullName =
    `${user.name.first} ${user.name.middle ?? ""} ${user.name.last}`.replace(
      /\s+/g,
      " "
    ).trim();

  const initials =
    `${user.name.first?.charAt(0) ?? ""}${user.name.last?.charAt(0) ?? ""}`.toUpperCase();

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">My Profile</h1>
        <p className="text-gray-500">
          Manage your personal information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── LEFT COLUMN ── */}
        <div className="space-y-6">
          {/* Avatar + name card */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="size-24 mb-4">
                  <AvatarFallback className="bg-blue-600 text-white text-2xl font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {fullName}
                </h3>

                <p className="text-sm text-gray-500 mb-2">{user.regdNo}</p>

                <Badge variant="outline" className="mb-4 text-blue-700 border-blue-200 bg-blue-50">
                  Student
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Non-editable academic info */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Academic Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="size-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Branch</p>
                  <p className="font-medium text-gray-900">{user.branch}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="size-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Hash className="size-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Registration No.</p>
                  <p className="font-medium text-gray-900">{user.regdNo}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="size-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="size-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date of Birth</p>
                  <p className="font-medium text-gray-900">
                    {user.dob
                      ? new Date(user.dob).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="size-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="size-5 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-gray-900 truncate">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="lg:col-span-2">
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Edit Personal Information</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Fields marked with * can be updated. Other fields are managed by admin.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-5">
                {/* Editable: name */}
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

                {/* Non-editable: email */}
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5 text-gray-500">
                    <Lock className="size-3.5" />
                    Email
                  </Label>
                  <Input
                    value={user.email}
                    disabled
                    className="rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                {/* Editable: mobile */}
                <div className="space-y-1.5">
                  <Label htmlFor="mobile" className="flex items-center gap-1">
                    <Phone className="size-3.5" />
                    Mobile *
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Mobile number"
                    className="rounded-xl"
                  />
                </div>

                {/* Editable: address */}
                <div className="space-y-1.5">
                  <Label htmlFor="address" className="flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    Address *
                  </Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Residential address"
                    className="rounded-xl"
                  />
                </div>

                {/* Non-editable: regd + branch */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1.5 text-gray-500">
                      <Lock className="size-3.5" />
                      Registration No.
                    </Label>
                    <Input
                      value={user.regdNo}
                      disabled
                      className="rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1.5 text-gray-500">
                      <Lock className="size-3.5" />
                      Branch
                    </Label>
                    <Input
                      value={user.branch}
                      disabled
                      className="rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl px-6"
                  >
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
