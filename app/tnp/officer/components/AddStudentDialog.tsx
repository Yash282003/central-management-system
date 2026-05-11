"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BRANCHES = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"];
const STATUSES = ["UNPLACED", "PLACED", "INELIGIBLE"];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
};

const genPassword = () => {
  const chars =
    "ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$";
  let out = "";
  for (let i = 0; i < 12; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
};

export default function AddStudentDialog({ open, onOpenChange, onCreated }: Props) {
  const [form, setForm] = useState({
    first: "",
    middle: "",
    last: "",
    regdNo: "",
    branch: "CSE",
    mobile: "",
    email: "",
    password: "",
    dob: "",
    cgpa: "",
    status: "UNPLACED",
    companyName: "",
    pkg: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const reset = () => {
    setForm({
      first: "",
      middle: "",
      last: "",
      regdNo: "",
      branch: "CSE",
      mobile: "",
      email: "",
      password: "",
      dob: "",
      cgpa: "",
      status: "UNPLACED",
      companyName: "",
      pkg: "",
      address: "",
    });
    setError("");
    setSuccess("");
  };

  const submit = async () => {
    setError("");
    setSuccess("");
    const cgpaNum = parseFloat(form.cgpa);
    if (
      !form.first.trim() ||
      !form.last.trim() ||
      !form.regdNo.trim() ||
      !form.mobile.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.dob ||
      isNaN(cgpaNum) ||
      !form.address.trim()
    ) {
      setError("Please fill all required fields.");
      return;
    }
    if (!/^[0-9]{10}$/.test(form.mobile)) {
      setError("Mobile number must be 10 digits.");
      return;
    }
    if (cgpaNum < 0 || cgpaNum > 10) {
      setError("CGPA must be between 0 and 10.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/tnp/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: {
            first: form.first.trim(),
            middle: form.middle.trim() || undefined,
            last: form.last.trim(),
          },
          regdNo: form.regdNo.trim(),
          branch: form.branch,
          mobile: form.mobile.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          dob: form.dob,
          cgpa: cgpaNum,
          status: form.status,
          companyName: form.companyName.trim() || null,
          package: form.pkg ? parseFloat(form.pkg) : 0,
          address: form.address.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to create student.");
      } else {
        setSuccess(
          `Student created. Temporary password: ${form.password} (share securely)`
        );
        onCreated?.();
        setTimeout(() => {
          onOpenChange(false);
          reset();
        }, 1500);
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
          <DialogTitle className="text-xl font-semibold">Add Student</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <Field label="First Name *">
            <Input
              value={form.first}
              onChange={(e) => update("first", e.target.value)}
            />
          </Field>
          <Field label="Middle Name">
            <Input
              value={form.middle}
              onChange={(e) => update("middle", e.target.value)}
            />
          </Field>
          <Field label="Last Name *">
            <Input
              value={form.last}
              onChange={(e) => update("last", e.target.value)}
            />
          </Field>
          <Field label="Reg. No *">
            <Input
              value={form.regdNo}
              onChange={(e) => update("regdNo", e.target.value)}
              placeholder="e.g. 2205041002"
            />
          </Field>
          <Field label="Branch *">
            <Select
              value={form.branch}
              onValueChange={(v) => update("branch", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                {BRANCHES.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="CGPA *">
            <Input
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={form.cgpa}
              onChange={(e) => update("cgpa", e.target.value)}
            />
          </Field>
          <Field label="Date of Birth *">
            <Input
              type="date"
              value={form.dob}
              onChange={(e) => update("dob", e.target.value)}
            />
          </Field>
          <Field label="Mobile *">
            <Input
              value={form.mobile}
              onChange={(e) => update("mobile", e.target.value)}
              placeholder="10-digit"
              maxLength={10}
            />
          </Field>
          <Field label="Email *">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </Field>
          <Field label="Password *">
            <div className="flex gap-2">
              <Input
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="Set initial password"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => update("password", genPassword())}
              >
                Generate
              </Button>
            </div>
          </Field>
          <Field label="Status">
            <Select
              value={form.status}
              onValueChange={(v) => update("status", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s[0] + s.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Package (LPA)">
            <Input
              type="number"
              step="0.1"
              min="0"
              value={form.pkg}
              onChange={(e) => update("pkg", e.target.value)}
              placeholder="0 if unplaced"
            />
          </Field>
          <Field label="Company (if placed)" full>
            <Input
              value={form.companyName}
              onChange={(e) => update("companyName", e.target.value)}
            />
          </Field>
          <Field label="Address *" full>
            <Input
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
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
            {submitting ? "Creating…" : "Create Student"}
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
