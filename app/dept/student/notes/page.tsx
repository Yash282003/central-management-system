"use client";
import { useState, useEffect } from "react";
import { FileText, Search, Download, ExternalLink, BookMarked } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Note {
  _id: string;
  title: string;
  subject: string;
  fileUrl: string;
  branch: string;
  uploadedByName?: string;
  downloads?: number;
  createdAt: string;
}

export default function StudentNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch("/api/student/me");
        const me = await meRes.json();
        if (!me.success) return;
        const dept: string = me.data?.branch ?? "";
        setBranch(dept);

        const res = await fetch(`/api/dept/notes?branch=${encodeURIComponent(dept)}`);
        const data = await res.json();
        setNotes(Array.isArray(data.data) ? data.data : []);
      } catch {
        toast.error("Failed to load notes");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.subject.toLowerCase().includes(search.toLowerCase()) ||
      (n.uploadedByName ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const subjects = [...new Set(notes.map((n) => n.subject))];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Notes</h1>
        <p className="text-gray-500 text-sm">
          {branch ? `${branch} department study materials` : "Study materials from your teachers"}
        </p>
      </div>

      {/* Stats */}
      {!loading && notes.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-blue-600 mb-1">Total Notes</p>
              <p className="text-2xl font-bold text-blue-700">{notes.length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-violet-50 to-purple-50">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-violet-600 mb-1">Subjects</p>
              <p className="text-2xl font-bold text-violet-700">{subjects.length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50 hidden sm:block">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-emerald-600 mb-1">Downloads</p>
              <p className="text-2xl font-bold text-emerald-700">
                {notes.reduce((acc, n) => acc + (n.downloads ?? 0), 0)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <Input
          placeholder="Search by title, subject or teacher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 rounded-xl"
        />
      </div>

      {/* Notes grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-5 space-y-3">
                <Skeleton className="size-10 rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-full rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="py-20 text-center">
            <BookMarked className="size-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              {search ? "No notes match your search" : "No notes uploaded yet"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {search ? "Try a different keyword" : "Your teachers haven't uploaded any materials yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((note) => (
            <Card
              key={note._id}
              className="rounded-2xl border-0 shadow-sm hover:-translate-y-0.5 transition-all"
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="size-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="size-5 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                      {note.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{note.subject}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">{note.branch}</Badge>
                  </div>
                  <span>
                    {new Date(note.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {note.uploadedByName && (
                  <p className="text-xs text-gray-400 mb-4">By {note.uploadedByName}</p>
                )}

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Download className="size-3" />
                    {note.downloads ?? 0}
                  </span>
                  {note.fileUrl ? (
                    <a
                      href={note.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      <ExternalLink className="size-3.5" />
                      Open
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 italic">No link</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
