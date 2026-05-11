"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BRANCHES = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"];
const CATEGORIES = ["Dream", "Super Dream", "Core", "Mass"];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** "company" — shown as "Add Company"; "drive" — shown as "Schedule Drive" */
  mode?: "company" | "drive";
  onCreated?: () => void;
};

export default function AddCompanyDialog({
  open,
  onOpenChange,
  mode = "company",
  onCreated,
}: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    company: "",
    role: "",
    category: "Dream",
    pkg: "",
    cgpa: "",
    branches: [] as string[],
    driveDate: "",
    description: "",
    registered: "",
    eligible: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = (k: keyof typeof form, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  const toggleBranch = (b: string) =>
    setForm((p) => ({
      ...p,
      branches: p.branches.includes(b)
        ? p.branches.filter((x) => x !== b)
        : [...p.branches, b],
    }));

  const reset = () => {
    setForm({
      company: "",
      role: "",
      category: "Dream",
      pkg: "",
      cgpa: "",
      branches: [],
      driveDate: "",
      description: "",
      registered: "",
      eligible: "",
    });
    setError("");
    setSuccess("");
  };

  const submit = async () => {
    setError("");
    setSuccess("");
    const cgpaNum = parseFloat(form.cgpa);
    if (
      !form.company.trim() ||
      !form.role.trim() ||
      !form.pkg.trim() ||
      isNaN(cgpaNum) ||
      form.branches.length === 0 ||
      !form.driveDate
    ) {
      setError("Please fill all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/tnp/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: form.company.trim(),
          role: form.role.trim(),
          category: form.category,
          package: form.pkg.trim(),
          eligibility: { cgpa: cgpaNum },
          eligibleBranches: form.branches,
          driveDate: form.driveDate,
          registered: form.registered ? parseInt(form.registered, 10) : 0,
          eligible: form.eligible ? parseInt(form.eligible, 10) : 0,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to create.");
      } else {
        setSuccess(
          mode === "drive"
            ? "Drive scheduled successfully."
            : "Company added successfully."
        );
        onCreated?.();
        router.refresh();
        setTimeout(() => {
          onOpenChange(false);
          reset();
        }, 900);
      }
    } catch (e: any) {
      setError(e?.message || "Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
      }}
    >
      <DialogContent className="max-w-2xl rounded-2xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === "drive" ? "Schedule Placement Drive" : "Add Company"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Company *">
            <Input
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
              placeholder="e.g. Amazon"
            />
          </Field>
          <Field label="Role *">
            <Input
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
              placeholder="e.g. SDE-1"
            />
          </Field>
          <Field label="Category *">
            <Select
              value={form.category}
              onValueChange={(v) => update("category", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Package *">
            <Input
              value={form.pkg}
              onChange={(e) => update("pkg", e.target.value)}
              placeholder="e.g. 24 LPA"
            />
          </Field>
          <Field label="Min. CGPA *">
            <Input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={form.cgpa}
              onChange={(e) => update("cgpa", e.target.value)}
            />
          </Field>
          <Field label="Drive Date *">
            <Input
              type="date"
              value={form.driveDate}
              onChange={(e) => update("driveDate", e.target.value)}
            />
          </Field>
          <Field label="Registered (optional)">
            <Input
              type="number"
              min="0"
              value={form.registered}
              onChange={(e) => update("registered", e.target.value)}
            />
          </Field>
          <Field label="Eligible (optional)">
            <Input
              type="number"
              min="0"
              value={form.eligible}
              onChange={(e) => update("eligible", e.target.value)}
            />
          </Field>

          <Field label="Eligible Branches *" full>
            <div className="flex flex-wrap gap-2">
              {BRANCHES.map((b) => {
                const active = form.branches.includes(b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleBranch(b)}
                    className={`px-2.5 py-1 rounded-full text-xs border transition ${
                      active
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-indigo-300"
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Description (optional)" full>
            <Textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Company / role description shown to students"
              className="min-h-[80px]"
            />
          </Field>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2 mt-3">
            {error}
          </p>
        )}
        {success && (
          <p className="text-xs text-green-700 bg-green-50 border border-green-100 rounded px-3 py-2 mt-3">
            {success}
          </p>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              reset();
            }}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={submitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {submitting
              ? "Saving…"
              : mode === "drive"
              ? "Schedule Drive"
              : "Create Company"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
