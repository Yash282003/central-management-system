"use client"
import { currentUser } from "../data/mockdata";
import Topbar from "../components/toolbar";
import Sidebar from "../components/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = currentUser.admin;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Topbar 
        userRole="admin" 
        userName={user.name} 
        userAvatar={user.avatar} 
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar role="admin" />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
