"use client";
import { useState, useEffect } from "react";
import { BookOpen, Award, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Course {
  _id: string;
  name: string;
  code?: string;
  credits?: number;
  description?: string;
  teacher?: { name?: { first?: string; last?: string } };
}

interface Publication {
  _id: string;
  title: string;
  authors?: string;
  journal?: string;
  year?: number;
  citations?: number;
  url?: string;
}

export default function TeacherDepartment() {
  const [dept, setDept] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch("/api/teacher/me");
        if (!meRes.ok) throw new Error("auth");
        const me = await meRes.json();
        const department: string = me.data?.department ?? "";
        setDept(department);

        const [courseRes, pubRes] = await Promise.allSettled([
          fetch(`/api/dept/courses?branch=${encodeURIComponent(department)}`),
          fetch(`/api/dept/publications?branch=${encodeURIComponent(department)}`),
        ]);

        if (courseRes.status === "fulfilled" && courseRes.value.ok) {
          const d = await courseRes.value.json();
          if (d.success) setCourses(Array.isArray(d.data) ? d.data : []);
        }
        if (pubRes.status === "fulfilled" && pubRes.value.ok) {
          const d = await pubRes.value.json();
          if (d.success) setPublications(Array.isArray(d.data) ? d.data : []);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Department</h1>
        <p className="text-gray-500 text-sm">
          {dept ? `${dept} — courses and publications` : "Department overview"}
        </p>
      </div>

      {/* Courses */}
      <Card className="rounded-2xl border-0 shadow-sm mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="size-4 text-blue-600" />
            Department Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
            </div>
          ) : courses.length === 0 ? (
            <div className="py-12 text-center">
              <BookOpen className="size-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No courses listed for this department</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {courses.map((c) => {
                const teacherName = c.teacher?.name
                  ? `${c.teacher.name.first ?? ""} ${c.teacher.name.last ?? ""}`.trim()
                  : null;
                return (
                  <div
                    key={c._id}
                    className="p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {c.code && (
                          <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">{c.code}</Badge>
                        )}
                        {c.credits != null && (
                          <Badge className="bg-violet-100 text-violet-700 border-0 text-xs">
                            {c.credits} cr
                          </Badge>
                        )}
                      </div>
                    </div>
                    {c.description && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{c.description}</p>
                    )}
                    {teacherName && (
                      <p className="text-xs text-gray-500 mt-1">{teacherName}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Publications */}
      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="size-4 text-violet-600" />
            Department Publications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
            </div>
          ) : publications.length === 0 ? (
            <div className="py-12 text-center">
              <Award className="size-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No publications listed</p>
            </div>
          ) : (
            <div className="space-y-3">
              {publications.map((pub) => (
                <div
                  key={pub._id}
                  className="p-4 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{pub.title}</p>
                      {pub.authors && (
                        <p className="text-xs text-gray-500 mb-2">{pub.authors}</p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        {pub.journal && (
                          <Badge className="bg-violet-100 text-violet-700 border-0 text-xs">{pub.journal}</Badge>
                        )}
                        {pub.year && (
                          <span className="text-xs text-gray-400">{pub.year}</span>
                        )}
                        {pub.citations != null && (
                          <span className="text-xs text-gray-400">{pub.citations} citations</span>
                        )}
                      </div>
                    </div>
                    {pub.url && (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
