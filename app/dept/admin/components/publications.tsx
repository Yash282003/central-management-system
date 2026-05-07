"use client"
import { useState, useEffect } from "react";
import { Award, Search, Plus, ExternalLink, BookOpen, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const BRANCHES = ["CSE", "ECE", "EEE", "ME", "CE", "IT", "MCA", "MBA"];

interface Publication {
  _id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  link?: string;
  abstract?: string;
  branch: string;
  createdAt?: string;
}

const emptyForm = {
  title: "",
  authors: "",
  journal: "",
  year: new Date().getFullYear(),
  link: "",
  abstract: "",
  branch: "",
};

export default function AdminPublications() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function fetchPublications() {
    setLoading(true);
    try {
      const res = await fetch("/api/dept/publications");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPublications(Array.isArray(data.data) ? data.data : []);
    } catch {
      toast.error("Failed to load publications");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPublications();
  }, []);

  const years = [...new Set(publications.map(p => p.year))].sort((a, b) => b - a);

  const filtered = publications.filter(p => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.authors.toLowerCase().includes(search.toLowerCase()) ||
      p.journal.toLowerCase().includes(search.toLowerCase());
    const matchYear = yearFilter === "all" || String(p.year) === yearFilter;
    return matchSearch && matchYear;
  });

  async function handleAdd() {
    if (!form.title.trim() || !form.branch) {
      toast.error("Title and branch are required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/dept/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Publication added successfully");
      setOpen(false);
      setForm(emptyForm);
      fetchPublications();
    } catch {
      toast.error("Failed to add publication");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/dept/publications?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Publication deleted");
      setPublications(prev => prev.filter(p => p._id !== id));
    } catch {
      toast.error("Failed to delete publication");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Publications</h1>
          <p className="text-gray-600">Track department research and publications</p>
        </div>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
          <Plus className="size-4" />
          Add Publication
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-5 text-center">
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </CardContent>
            </Card>
          ))
        ) : (
          [
            { label: "Total Publications", value: publications.length },
            { label: "This Year", value: publications.filter(p => p.year === new Date().getFullYear()).length },
            { label: "Branches", value: new Set(publications.map(p => p.branch)).size },
          ].map(item => (
            <Card key={item.label} className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-5 text-center">
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                <p className="text-sm text-gray-500 mt-1">{item.label}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search by title, authors, journal..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setYearFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${yearFilter === "all" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
          >
            All Years
          </button>
          {years.map(y => (
            <button
              key={y}
              onClick={() => setYearFilter(String(y))}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${yearFilter === String(y) ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Publications List */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="size-10 rounded-xl flex-shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Award className="size-12 mx-auto mb-4 text-gray-300" />
            <p className="font-medium text-gray-500">No publications found</p>
            <p className="text-gray-400 text-sm mt-1">Add a publication to get started</p>
          </div>
        ) : (
          filtered.map(pub => (
            <Card key={pub._id} className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="size-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Award className="size-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 leading-tight">{pub.title}</h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="outline" className="text-xs">{pub.year}</Badge>
                        {pub.branch && <Badge variant="secondary" className="text-xs">{pub.branch}</Badge>}
                        {pub.link && (
                          <a
                            href={pub.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <ExternalLink className="size-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(pub._id)}
                          disabled={deletingId === pub._id}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{pub.authors}</p>
                    <div className="flex items-center gap-2">
                      <BookOpen className="size-3.5 text-blue-500" />
                      <span className="text-sm text-blue-600 font-medium">{pub.journal}</span>
                    </div>
                    {pub.abstract && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">{pub.abstract}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Publication Dialog */}
      <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) setForm(emptyForm); }}>
        <DialogContent className="max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add Publication</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <Input
                placeholder="Publication title..."
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Authors</label>
              <Input
                placeholder="Dr. Name1, Dr. Name2..."
                value={form.authors}
                onChange={e => setForm(p => ({ ...p, authors: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Journal / Conference</label>
              <Input
                placeholder="e.g. IEEE Transactions"
                value={form.journal}
                onChange={e => setForm(p => ({ ...p, journal: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <Input
                  type="number"
                  value={form.year}
                  onChange={e => setForm(p => ({ ...p, year: Number(e.target.value) }))}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
                <Select value={form.branch} onValueChange={v => setForm(p => ({ ...p, branch: v }))}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link (optional)</label>
              <Input
                placeholder="https://..."
                value={form.link}
                onChange={e => setForm(p => ({ ...p, link: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Abstract (optional)</label>
              <textarea
                placeholder="Brief abstract..."
                value={form.abstract}
                onChange={e => setForm(p => ({ ...p, abstract: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleAdd} disabled={submitting} className="rounded-xl">
              {submitting ? "Adding..." : "Add Publication"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
