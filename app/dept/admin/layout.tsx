"use client";
import Topbar from "../components/toolbar";
import Sidebar from "../components/sidebar";
import { useState, useEffect } from "react";
import { getAdminDetails } from "@/services/admin/me/getDetails";

interface Admin {
  _id: string;
  employeeId: string;
  department: string;
  email: string;
  profileUrl: string;
  name: { first: string; last: string };
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Admin | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await getAdminDetails();
      if (res?.success) setUser(res.data);
    };
    loadData();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Topbar
        userRole="admin"
        userName={user ? `${user.name.first} ${user.name.last}` : "Loading..."}
        userAvatar={user ? `${user.name.first[0]}${user.name.last[0]}` : "A"}
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar role="admin" />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
