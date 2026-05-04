"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  Settings,
  Bell,
  Search,
  User,
  LogOut,
  Users,
  Building2,
  Award,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NavItem } from "../type";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDetails } from "@/services/student/me/getDetails";

// ✅ Type
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
export default function StudentLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
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

  // ✅ FIXED: icon as JSX (not component reference)
  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      path: "/tnp/student/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: "My Profile",
      path: "/tnp/student/profile",
      icon: <User className="w-5 h-5" />,
    },
    {
      label: "Companies",
      path: "/tnp/student/companies",
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      label: "Applications",
      path: "/tnp/student/applications",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: "Notifications",
      path: "/tnp/student/notifications",
      icon: <Bell className="w-5 h-5" />,
    },
  ];

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ✅ Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-indigo-600">CPMS</h1>
          <p className="text-sm text-gray-500">Student Portal</p>
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

      {/* ✅ Main Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ✅ Navbar (Dashboard Style) */}
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
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>

              {/* Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-purple-600 text-white text-sm font-semibold">
                        {user
                          ? `${user.name.first?.[0] || ""}${user.name.last?.[0] || ""}`
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {user
                        ? `${user.name.first} ${user.name.last}`
                        : "Loading..."}
                    </span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem>
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

        {/* ✅ Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
