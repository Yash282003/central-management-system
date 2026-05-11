"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search, Calendar } from "lucide-react";

type Company = {
  _id: string;
  company: string;
  role: string;
  category: string;
  package: string;
  eligibility: { cgpa: number };
  eligibleBranches: string[];
  driveDate: string;
  registered: number;
  eligible: number;
};

const categoryStyles: Record<string, string> = {
  Dream: "bg-purple-100 text-purple-700",
  "Super Dream": "bg-pink-100 text-pink-700",
  Core: "bg-blue-100 text-blue-700",
  Mass: "bg-green-100 text-green-700",
};

export default function StudentCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [applyTarget, setApplyTarget] = useState<Company | null>(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState("");
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/tnp/companies", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { if (d.success) setCompanies(d.data ?? []); })
      .finally(() => setLoading(false));

    fetch("/api/student/tnp-applications", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setAppliedIds(new Set((d.data ?? []).map((a: any) => String(a.companyId))));
      })
      .catch(() => {});
  }, []);

  const filtered = companies.filter(
    (c) =>
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase())
  );

  const openApply = (c: Company) => {
    setApplyTarget(c);
    setResumeUrl("");
    setNote("");
    setApplyError("");
    setApplySuccess("");
  };

  const handleApply = async () => {
    if (!applyTarget) return;
    setApplyError("");
    if (!resumeUrl.trim()) { setApplyError("Resume URL is required."); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/student/tnp-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ companyId: applyTarget._id, resumeUrl, note }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setApplyError(json.message || "Failed to apply.");
      } else {
        setApplySuccess("Application submitted!");
        setAppliedIds((prev) => new Set([...prev, applyTarget._id]));
        setTimeout(() => setApplyTarget(null), 900);
      }
    } catch {
      setApplyError("Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Available Companies</h1>
        <p className="text-gray-600 mt-1">Browse and apply to placement drives</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search companies or roles..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && (
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <p className="text-center text-gray-400 py-16">No companies found.</p>
      )}

      {!loading && (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((c) => {
            const applied = appliedIds.has(c._id);
            return (
              <Card key={c._id} className="border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">{c.company}</p>
                      <p className="text-sm text-gray-500">{c.role}</p>
                    </div>
                    <Badge className={categoryStyles[c.category] ?? "bg-gray-100 text-gray-700"}>
                      {c.category}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Package</p>
                      <p className="font-semibold text-green-600">{c.package}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Min. CGPA</p>
                      <p className="font-medium">≥ {c.eligibility?.cgpa}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {(c.eligibleBranches ?? []).map((b) => (
                      <Badge key={b} variant="outline" className="text-xs">{b}</Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    Drive:{" "}
                    {new Date(c.driveDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>

                  <Button
                    size="sm"
                    className={`w-full ${applied ? "bg-green-600 hover:bg-green-600 cursor-default" : "bg-indigo-600 hover:bg-indigo-700"} text-white`}
                    onClick={() => !applied && openApply(c)}
                    disabled={applied}
                  >
                    {applied ? "Applied ✓" : "Apply Now"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Apply Dialog */}
      <Dialog open={!!applyTarget} onOpenChange={(o) => !o && setApplyTarget(null)}>
        <DialogContent className="max-w-md rounded-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Apply to {applyTarget?.company}
              <span className="block text-sm font-normal text-gray-500 mt-0.5">
                {applyTarget?.role} · {applyTarget?.package}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Resume URL *</label>
              <Input
                className="mt-1"
                placeholder="https://drive.google.com/your-resume"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">
                One-liner about yourself{" "}
                <span className="text-gray-400">(optional, max 200 chars)</span>
              </label>
              <Input
                className="mt-1"
                placeholder="e.g. CSE final year, 9.1 CGPA, 2× hackathon winner"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={200}
              />
            </div>
            {applyError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
                {applyError}
              </p>
            )}
            {applySuccess && (
              <p className="text-xs text-green-700 bg-green-50 border border-green-100 rounded px-3 py-2">
                {applySuccess}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setApplyTarget(null)} disabled={submitting}>
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              disabled={submitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {submitting ? "Submitting…" : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
