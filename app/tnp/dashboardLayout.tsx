"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Bell,
  Search,
  LogOut,
  User,
  Settings,
  FileText,
  ChevronDown,
  Users,
  Building2,
  Calendar,
  BarChart,
  LayoutDashboard,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import NotificationPanel from "./notificationPanel";
import { NavItem } from "./type";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: string;
  userName?: string;
  userEmail?: string;
}

export default function DashboardLayout({
  children,
  userRole,
  userName = "User",
  userEmail = "user@example.com",
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      path: "/management",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: "Analytics",
      path: "/management/analytics",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      label: "Reports",
      path: "/management/reports",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: "Settings",
      path: "/management/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  // ✅ Navigation handlers (Next.js)
  const handleLogout = () => {
    router.push("/");
  };

  const handleViewProfile = () => {
    if (userRole === "Student") {
      router.push("/student/profile");
    } else if (userRole === "Placement Officer") {
      router.push("/officer/settings");
    } else {
      router.push("/management/settings");
    }
  };

  const handleSettings = () => {
    handleViewProfile();
  };

  // Mock search data
  const searchResults =
    searchQuery.length > 0
      ? {
          students: [
            { name: "Rahul Kumar", branch: "CSE", id: "2021CS045" },
            { name: "Priya Sharma", branch: "ECE", id: "2021EC089" },
          ],
          companies: [
            { name: "Google", role: "Software Engineer" },
            { name: "Microsoft", role: "SDE-2" },
          ],
          drives: [
            { title: "Amazon Campus Drive", date: "March 15, 2026" },
            { title: "TCS Hiring", date: "March 18, 2026" },
          ],
          reports: [
            { name: "Current Year Placement Report" },
            { name: "Branch-wise Report" },
          ],
        }
      : null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-indigo-600">CPMS</h1>
          <p className="text-sm text-gray-500 mt-1">{userRole}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 bg-gray-50 border-gray-200"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(e.target.value.length > 0);
                }}
              />
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNotificationPanelOpen(true)}
              >
                <Bell className="w-5 h-5" />
              </Button>

              {/* Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {userName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{userName}</span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleViewProfile}>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={handleSettings}>
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {/* Notifications */}
      <NotificationPanel
        isOpen={notificationPanelOpen}
        onClose={() => setNotificationPanelOpen(false)}
      />
    </div>
  );
}