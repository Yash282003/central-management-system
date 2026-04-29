"use client";

import { Mail, Phone, MapPin, Calendar, Award, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getDetails } from "@/services/student/me/getDetails";

// ✅ Type for API response
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

  useEffect(() => {
    const loadData = async () => {
      const res = await getDetails();
      console.log(res);

      if (res?.success) {
        setUser(res.data);
      }
    };
    loadData();
  }, []);

  // ✅ Loading state
  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  const fullName = `${user.name.first} ${user.name.middle} ${user.name.last}`.trim();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">
          Manage your personal information and settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="size-24 mb-4">
                  <AvatarFallback className="bg-blue-600 text-white text-2xl">
                    {user.name.first?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {fullName}
                </h3>

                <p className="text-sm text-gray-600 mb-1">
                  {user.regdNo}
                </p>

                <Badge variant="outline" className="mb-4">
                  Student
                </Badge>

                <Button variant="outline" className="w-full mb-2">
                  Change Photo
                </Button>

                <Button
                  variant="ghost"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remove Photo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Academic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Academic Info</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <BookOpen className="size-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Department</p>
                  <p className="font-medium text-gray-900">
                    {user.branch}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="size-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Calendar className="size-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Date of Birth</p>
                  <p className="font-medium text-gray-900">
                    {user.dob.split("T")[0]}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>

            <CardContent>
              <form className="space-y-4">
                {/* Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      defaultValue={user.name.first}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label>Last Name</Label>
                    <Input
                      defaultValue={user.name.last}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label>Email</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      type="email"
                      defaultValue={user.email}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <Label>Phone</Label>
                  <div className="relative mt-1.5">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      type="tel"
                      defaultValue={user.mobile}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <Label>Address</Label>
                  <div className="relative mt-1.5">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      defaultValue={user.address}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* DOB + ID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      defaultValue={user.dob.split("T")[0]}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label>Student ID</Label>
                    <Input
                      defaultValue={user.regdNo}
                      disabled
                      className="mt-1.5 bg-gray-50"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>

            <CardContent>
              <form className="space-y-4">
                <Input type="password" placeholder="Current Password" />
                <Input type="password" placeholder="New Password" />
                <Input type="password" placeholder="Confirm Password" />

                <div className="pt-4">
                  <Button variant="outline">Update Password</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}