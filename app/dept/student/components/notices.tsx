"use client"
import { useState } from "react";
import { AlertCircle, Calendar, User, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { notices } from "../../data/mockdata";

export default function StudentNotices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "all" || notice.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Notices</h1>
        <p className="text-gray-600">Stay updated with important announcements</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search notices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-gray-600" />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => (
          <Card key={notice.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    {notice.priority === "high" && (
                      <div className="size-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <AlertCircle className="size-5 text-red-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {notice.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {notice.content}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="size-4" />
                      {new Date(notice.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="size-4" />
                      {notice.author}
                    </div>
                  </div>
                </div>

                <Badge
                  variant={
                    notice.priority === "high"
                      ? "destructive"
                      : notice.priority === "medium"
                      ? "default"
                      : "outline"
                  }
                >
                  {notice.priority.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No notices found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
