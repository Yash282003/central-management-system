"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bell,
  BookOpen,
  Users,
  Calendar,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  UserCircle,
  BarChart3,
  BookMarked,
  Building,
  Award,
} from "lucide-react";
import { cn } from "@/components/ui/utils";

interface SidebarProps {
  role: "student" | "teacher" | "admin";
}

const menuItems = {
  student: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dept/student/dashboard" },
    { icon: Bell, label: "Notices", path: "/dept/student/notices" },
    { icon: BarChart3, label: "Grades", path: "/dept/student/grades" },
    { icon: Calendar, label: "Attendance", path: "/dept/student/attendance" },
    { icon: ClipboardList, label: "Tests & Polls", path: "/dept/student/student_tests" },
    { icon: BookMarked, label: "Notes", path: "/dept/student/notes" },
    { icon: Building, label: "Department", path: "/dept/student/department" },
    { icon: UserCircle, label: "Profile", path: "/dept/student/profile" },
  ],
  teacher: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dept/teacher/dashboard" },
    { icon: Bell, label: "Notices", path: "/dept/teacher/notices" },
    { icon: ClipboardList, label: "Tests & Polls", path: "/dept/teacher/teacher_tests" },
    { icon: Users, label: "Students", path: "/dept/teacher/students" },
    { icon: BookOpen, label: "Notes", path: "/dept/teacher/notes" },
    { icon: Building, label: "Department", path: "/dept/teacher/department" },
    { icon: UserCircle, label: "Profile", path: "/dept/teacher/profile" },
  ],
  admin: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dept/admin/dashboard" },
    { icon: Bell, label: "Notices", path: "/dept/admin/notices" },
    { icon: GraduationCap, label: "Students", path: "/dept/admin/students" },
    { icon: Users, label: "Faculty", path: "/dept/admin/members" },
    { icon: BookMarked, label: "Courses", path: "/dept/admin/courses" },
    { icon: Award, label: "Publications", path: "/dept/admin/publications" },
  ],
};

export default function Sidebar({ role }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const items = menuItems[role];

  return (
    <div
      className={cn(
        "h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <div className="h-16 flex items-center justify-end px-4 border-b border-gray-200">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="size-5 text-gray-600" />
          ) : (
            <ChevronLeft className="size-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon
                className={cn(
                  "size-5 transition-colors",
                  isActive
                    ? "text-indigo-600"
                    : "text-gray-600 group-hover:text-gray-900"
                )}
              />

              {!isCollapsed && (
                <span className="font-medium text-sm">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        {!isCollapsed && (
          <div className="px-3 py-2 text-xs text-gray-500">
            <div className="font-medium text-gray-900 mb-1">
              DMS v1.0
            </div>
            <div>© 2026 University</div>
          </div>
        )}
      </div>
    </div>
  );
}