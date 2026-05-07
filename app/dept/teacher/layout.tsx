"use client";
import Topbar from "../components/toolbar";
import Sidebar from "../components/sidebar";
import { useState, useEffect } from "react";
import { getTeacherDetails } from "@/services/teacher/me/getDetails";

interface Teacher {
  _id: string;
  employeeId: string;
  department: string;
  mobile: string;
  email: string;
  designation: string;
  profileUrl: string;
  name: { first: string; middle: string; last: string };
}

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Teacher | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await getTeacherDetails();
      if (res?.success) setUser(res.data);
    };
    loadData();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Topbar
        userRole="teacher"
        userName={user ? `${user.name.first} ${user.name.last}` : "Loading..."}
        userAvatar={user ? `${user.name.first[0]}${user.name.last[0]}` : "T"}
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar role="teacher" />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
