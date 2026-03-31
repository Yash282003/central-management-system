"use client"
import { Mail, Phone, MapPin, Calendar, Award, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { currentUser } from "../../data/mockdata";

export default function StudentProfile() {
  const user = currentUser.student;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your personal information and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="size-24 mb-4">
                  <AvatarFallback className="bg-blue-600 text-white text-2xl">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{user.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{user.id}</p>
                <Badge variant="outline" className="mb-4">
                  Student
                </Badge>
                <Button variant="outline" className="w-full mb-2">
                  Change Photo
                </Button>
                <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                  Remove Photo
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Academic Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="size-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Department</p>
                  <p className="font-medium text-gray-900">{user.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="size-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Current Semester</p>
                  <p className="font-medium text-gray-900">Semester {user.semester}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="size-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">CGPA</p>
                  <p className="font-medium text-gray-900">{user.cgpa} / 4.0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      defaultValue="Alex"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      defaultValue="Morgan"
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user.email}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative mt-1.5">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <div className="relative mt-1.5">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      id="address"
                      placeholder="Enter your address"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      defaultValue={user.id}
                      disabled
                      className="mt-1.5 bg-gray-50"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full md:w-auto">
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="mt-1.5"
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" variant="outline" className="w-full md:w-auto">
                    Update Password
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
