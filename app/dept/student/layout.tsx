"use client";
import { currentUser } from "../data/mockdata";
import Topbar from "../components/toolbar";
import Sidebar from "../components/sidebar";
import { useState, useEffect } from "react";
import { getDetails } from "@/services/student/me/getDetails";
interface Student {
  _id: string;
  regdNo: string;
  branch: string;
  mobile: string;
  email: string;
  dob: string;
  address: string;
  profileUrl: string;
  name: {
    first: string;
    middle: string;
    last: string;
  };
}
export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<Student | null>(null);
  useEffect(() => {
    const loadData = async () => {
      const res = await getDetails();
      if (res?.success) {
        setUser(res.data);
      }
    };
    loadData();
  }, []);
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Topbar
        userRole="student"
        userName={user ? `${user.name.first} ${user.name.last}` : "Loading..."}
        userAvatar={user ? `${user.name.first[0]}${user.name.last[0]}` : "U"}
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar role="student" />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
