"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Application = {
  _id: string;
  companyName: string;
  role: string;
  package: string;
  status: "applied" | "shortlisted" | "selected" | "rejected";
  resumeUrl: string;
  note: string;
  createdAt: string;
};

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  applied:     { label: "Applied",     color: "bg-gray-100 text-gray-700",   icon: Clock },
  shortlisted: { label: "Shortlisted", color: "bg-blue-100 text-blue-700",   icon: AlertCircle },
  selected:    { label: "Selected",    color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  rejected:    { label: "Rejected",    color: "bg-red-100 text-red-700",     icon: XCircle },
};

export default function StudentApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/tnp-applications", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { if (d.success) setApplications(d.data ?? []); })
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    total: applications.length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    selected: applications.filter((a) => a.status === "selected").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const stats = [
    { label: "Total Applications", value: counts.total,      color: "text-indigo-600" },
    { label: "Shortlisted",        value: counts.shortlisted, color: "text-blue-600"   },
    { label: "Selected",           value: counts.selected,    color: "text-green-600"  },
    { label: "Rejected",           value: counts.rejected,    color: "text-red-600"    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-1">Track your placement application status</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-gray-200">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* List */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {!loading && applications.length === 0 && (
        <Card className="border-gray-200">
          <CardContent className="py-16 text-center text-gray-400">
            <p className="font-medium">No applications yet</p>
            <p className="text-sm mt-1">Go to Companies to apply to placement drives.</p>
          </CardContent>
        </Card>
      )}

      {!loading && applications.length > 0 && (
        <div className="space-y-3">
          {applications.map((app) => {
            const cfg = statusConfig[app.status] ?? statusConfig.applied;
            const Icon = cfg.icon;
            return (
              <Card key={app._id} className="border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg ${cfg.color.split(" ")[0]} flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${cfg.color.split(" ")[1]}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-900">{app.companyName}</p>
                          <Badge className={cfg.color}>{cfg.label}</Badge>
                        </div>
                        <p className="text-sm text-gray-500">{app.role}</p>
                        {app.package && (
                          <p className="text-sm font-medium text-green-600">{app.package}</p>
                        )}
                        {app.note && (
                          <p className="text-xs text-gray-400 mt-1 truncate">{app.note}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-400">
                        Applied{" "}
                        {new Date(app.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:underline mt-1 block"
                      >
                        View Resume →
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Timeline — only shown when there are real applications */}
      {!loading && applications.length > 0 && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Application Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.slice(0, 5).map((app, i) => {
                const cfg = statusConfig[app.status] ?? statusConfig.applied;
                const dotColor =
                  app.status === "selected"    ? "bg-green-600" :
                  app.status === "shortlisted" ? "bg-blue-600"  :
                  app.status === "rejected"    ? "bg-red-600"   : "bg-gray-400";
                return (
                  <div key={app._id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 ${dotColor} rounded-full flex-shrink-0`} />
                      {i < applications.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-gray-900">
                        {cfg.label} at {app.companyName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(app.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-gray-400 mt-0.5">{app.role} · {app.package}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
