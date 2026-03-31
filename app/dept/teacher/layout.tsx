"use client"
import { currentUser } from "../data/mockdata";
import Topbar from "../components/toolbar";
import Sidebar from "../components/sidebar";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const user = currentUser.teacher;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Topbar 
        userRole="teacher" 
        userName={user.name} 
        userAvatar={user.avatar} 
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar role="teacher" />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
