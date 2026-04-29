"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, GraduationCap, Shield } from "lucide-react";
import { JSX } from "react";
import { useRouter } from "next/navigation";

export function RoleSelector(): JSX.Element {
  const router = useRouter();

  const handleNavigate = (page: "dept" | "tnp" | "hostel") => {
    router.push(`/${page}/student/dashboard`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">
            Management System
          </h1>
          <p className="text-muted-foreground text-lg">
            Select a module to continue
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Department */}
          <Card
            onClick={() => handleNavigate("dept")}
            className="hover:shadow-lg transition-all cursor-pointer h-full hover:scale-105"
          >
            <CardHeader className="text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                <GraduationCap className="h-10 w-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Department</CardTitle>
              <CardDescription>
                Manage students, courses, attendance, and academics
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate("dept");
                }}
              >
                Go to Department
              </Button>
            </CardContent>
          </Card>

          {/* TnP */}
          <Card
            onClick={() => handleNavigate("tnp")}
            className="hover:shadow-lg transition-all cursor-pointer h-full hover:scale-105"
          >
            <CardHeader className="text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <Users className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl">TnP</CardTitle>
              <CardDescription>
                Manage placements, companies, and student recruitment data
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate("tnp");
                }}
              >
                Go to TnP
              </Button>
            </CardContent>
          </Card>

          {/* Hostel */}
          <Card
            onClick={() => handleNavigate("hostel")}
            className="hover:shadow-lg transition-all cursor-pointer h-full hover:scale-105"
          >
            <CardHeader className="text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                <Shield className="h-10 w-10 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">Hostel</CardTitle>
              <CardDescription>
                Manage rooms, students, complaints, and hostel facilities
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate("hostel");
                }}
              >
                Go to Hostel
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}