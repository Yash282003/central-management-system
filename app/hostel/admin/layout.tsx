"use client";

// import "../styles/index.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Bell,
  BarChart3,
  DollarSign,
  Users,
  Utensils,
  Package,
  Briefcase,
  Phone,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";

import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/hostel/admin" },
  { icon: MessageSquare, label: "Complaints", path: "/hostel/admin/complaints" },
  { icon: FileText, label: "Applications", path: "/hostel/admin/applications" },
  { icon: Bell, label: "Notifications", path: "/hostel/admin/notifications" },
  { icon: BarChart3, label: "Polls", path: "/hostel/admin/polls" },
  { icon: DollarSign, label: "Fines", path: "/hostel/admin/fines" },
  { icon: Users, label: "Students", path: "/hostel/admin/students" },
  { icon: Utensils, label: "Mess", path: "/hostel/admin/mess" },
  { icon: Package, label: "Stock", path: "/hostel/admin/stock" },
  { icon: Briefcase, label: "Workers", path: "/hostel/admin/workers" },
  { icon: Phone, label: "Emergency Contacts", path: "/hostel/admin/emergency_contacts" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow border-r border-slate-200 bg-white overflow-y-auto">
          <div className="flex items-center px-6 py-5 border-b border-slate-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-slate-900">Admin Portal</p>
                <p className="text-xs text-slate-500">HMS</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-3 border-t border-slate-200">
            <Link
              href="/"
              className="flex items-center px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Navbar */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-4 lg:px-8 py-4 bg-white border-b border-slate-200">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>

          <h2 className="text-lg font-semibold">Admin Dashboard</h2>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <User />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/" className="text-red-600 flex items-center">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200">
            <nav className="px-4 py-2 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2.5 text-sm rounded-lg ${
                    isActive(item.path)
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}