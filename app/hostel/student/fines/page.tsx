"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, CheckCircle2, Clock } from "lucide-react";

type Fine = {
  _id: string;
  reason: string;
  amount: number;
  status: "pending" | "paid";
  paidAt?: string;
  createdAt: string;
};

export default function StudentFines() {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hostel/student/fines", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { if (d.success) setFines(d.data ?? []); })
      .finally(() => setLoading(false));
  }, []);

  const pending = fines.filter((f) => f.status === "pending");
  const paid = fines.filter((f) => f.status === "paid");
  const totalDue = pending.reduce((s, f) => s + (f.amount ?? 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Hostel Fines</h1>
        <p className="text-slate-500 text-sm mt-1">Pending dues and payment history</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-rose-600 uppercase tracking-wide mb-1">Total Due</p>
            <p className="text-3xl font-bold text-rose-700">
              <IndianRupee className="inline w-5 h-5 mb-1" />
              {totalDue}
            </p>
            <p className="text-xs text-rose-500 mt-1">{pending.length} unpaid</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-amber-600 uppercase tracking-wide mb-1">Pending</p>
            <p className="text-3xl font-bold text-amber-700">{pending.length}</p>
            <p className="text-xs text-amber-500 mt-1">awaiting payment</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-1">Paid</p>
            <p className="text-3xl font-bold text-emerald-700">{paid.length}</p>
            <p className="text-xs text-emerald-500 mt-1">cleared</p>
          </CardContent>
        </Card>
      </div>

      {/* Fines list */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>All Fines</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : fines.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No fines on your account</p>
              <p className="text-xs mt-1">You&apos;re all clear.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {fines.map((f) => (
                <div key={f._id} className="py-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`mt-0.5 p-2 rounded-lg ${f.status === "paid" ? "bg-emerald-50" : "bg-amber-50"}`}>
                      {f.status === "paid"
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        : <Clock className="w-4 h-4 text-amber-600" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900">{f.reason}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Issued {new Date(f.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        {f.paidAt && ` · Paid ${new Date(f.paidAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-semibold text-slate-900">
                      <IndianRupee className="inline w-3.5 h-3.5 mb-0.5" />
                      {f.amount}
                    </span>
                    <Badge className={f.status === "paid" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-amber-100 text-amber-700 hover:bg-amber-100"}>
                      {f.status}
                    </Badge>
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
