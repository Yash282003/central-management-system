"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { notifications, searchSuggestions } from "../data/mockdata";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TopbarProps {
  userRole: "student" | "teacher" | "admin";
  userName: string;
  userAvatar: string;
}

export default function Topbar({ userRole, userName, userAvatar }: TopbarProps) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notificationList, setNotificationList] = useState(notifications);

  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notificationList.filter(n => !n.read).length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchDropdown(value.length > 0);
  };

  const markAsRead = (id: number) => {
    setNotificationList(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const handleLogout = () => {
    router.push("/");
  };

  const filteredSuggestions = searchQuery
    ? {
        students: searchSuggestions.students.filter(s =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        files: searchSuggestions.files.filter(f =>
          f.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        notices: searchSuggestions.notices.filter(n =>
          n.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }
    : null;

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-semibold">DMS</span>
        </div>
        <span className="font-semibold text-gray-900">Department Management</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-2xl mx-8 relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search students, files, notices..."
            className="w-full h-10 pl-10 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 transition-all"
          />
        </div>

        {showSearchDropdown && filteredSuggestions && (
          <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
            
            {/* Students */}
            {filteredSuggestions.students.length > 0 && (
              <div className="p-3 border-b border-gray-100">
                <div className="text-xs font-semibold text-gray-500 mb-2">Students</div>
                {filteredSuggestions.students.map((student, idx) => (
                  <div key={idx} className="px-3 py-2 hover:bg-gray-50 rounded cursor-pointer">
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{student}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Files */}
            {filteredSuggestions.files.length > 0 && (
              <div className="p-3 border-b border-gray-100">
                <div className="text-xs font-semibold text-gray-500 mb-2">Files</div>
                {filteredSuggestions.files.map((file, idx) => (
                  <div key={idx} className="px-3 py-2 hover:bg-gray-50 rounded cursor-pointer">
                    <span className="text-sm text-gray-700">{file}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Notices */}
            {filteredSuggestions.notices.length > 0 && (
              <div className="p-3">
                <div className="text-xs font-semibold text-gray-500 mb-2">Notices</div>
                {filteredSuggestions.notices.map((notice, idx) => (
                  <div key={idx} className="px-3 py-2 hover:bg-gray-50 rounded cursor-pointer">
                    <span className="text-sm text-gray-700">{notice}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-gray-100 rounded-lg"
          >
            <Bell className="size-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 size-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-white border rounded-lg shadow-lg z-50">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Notifications</h3>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notificationList.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-4 border-b cursor-pointer ${
                      !notification.read ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <div className="text-sm font-medium">{notification.title}</div>
                    <div className="text-sm text-gray-600">{notification.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg"
          >
            <Avatar className="size-8">
              <AvatarFallback className="bg-blue-600 text-white">
                {userAvatar}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="text-sm font-medium">{userName}</div>
              <div className="text-xs text-gray-500 capitalize">{userRole}</div>
            </div>

            <ChevronDown className="size-4 text-gray-600" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50">
              <div className="p-2">

                <button
                  onClick={() => {
                    router.push(`/${userRole}/profile`);
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg"
                >
                  <User className="size-4" />
                  Profile
                </button>

                <button
                  onClick={() => {
                    router.push(`/${userRole}/profile`);
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg"
                >
                  <Settings className="size-4" />
                  Settings
                </button>

                <div className="h-px bg-gray-200 my-2" />

                <button
                  onClick={handleLogout}
                  className="w-full flex gap-3 px-3 py-2 hover:bg-red-50 rounded-lg text-red-600"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>

              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}