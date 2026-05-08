"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Phone, Plus, Trash2, ShieldCheck, Mail } from "lucide-react";
import { toast } from "sonner";

interface Contact {
  _id: string;
  name: string;
  role: string;
  mobile: string;
  available24x7?: boolean;
}

const ROLE_COLORS: Record<string, string> = {
  Warden: "bg-emerald-100 text-emerald-700",
  "Assistant Warden": "bg-teal-100 text-teal-700",
  "Hall Assistant": "bg-blue-100 text-blue-700",
  "Medical Emergency": "bg-red-100 text-red-700",
  Security: "bg-indigo-100 text-indigo-700",
  Default: "bg-gray-100 text-gray-700",
};

function roleColor(role: string) {
  return ROLE_COLORS[role] ?? ROLE_COLORS.Default;
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

const EMPTY_FORM = { name: "", role: "", mobile: "", available24x7: false };

export default function AdminEmergencyContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    setLoading(true);
    try {
      const res = await fetch("/api/hostel/admin/contacts");
      const json = await res.json();
      setContacts(Array.isArray(json.data) ? json.data : []);
    } catch {
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!form.name.trim() || !form.role.trim() || !form.mobile.trim()) {
      toast.error("Name, role, and phone are required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/hostel/admin/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setContacts((prev) => [json.data, ...prev]);
      setForm(EMPTY_FORM);
      setIsDialogOpen(false);
      toast.success("Contact added successfully");
    } catch {
      toast.error("Failed to add contact");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/hostel/admin/contacts?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error();
      setContacts((prev) => prev.filter((c) => c._id !== id));
      setDeleteId(null);
      toast.success("Contact deleted");
    } catch {
      toast.error("Failed to delete contact");
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Emergency Contacts</h1>
          <p className="text-gray-500 text-sm">Manage emergency contact information for hostel students</p>
        </div>
        <Button
          onClick={() => { setForm(EMPTY_FORM); setIsDialogOpen(true); }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2"
        >
          <Plus className="size-4" />
          Add Contact
        </Button>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50">
            <CardContent className="p-5">
              <p className="text-xs font-medium text-emerald-600 mb-1">Total Contacts</p>
              <p className="text-3xl font-bold text-emerald-700">{contacts.length}</p>
              <p className="text-xs text-emerald-500 mt-1">in directory</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-5">
              <p className="text-xs font-medium text-blue-600 mb-1">24×7 Available</p>
              <p className="text-3xl font-bold text-blue-700">
                {contacts.filter((c) => c.available24x7).length}
              </p>
              <p className="text-xs text-blue-500 mt-1">always reachable</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-violet-50 to-purple-50">
            <CardContent className="p-5">
              <p className="text-xs font-medium text-violet-600 mb-1">Roles Covered</p>
              <p className="text-3xl font-bold text-violet-700">
                {new Set(contacts.map((c) => c.role)).size}
              </p>
              <p className="text-xs text-violet-500 mt-1">unique roles</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contact grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <div className="py-20 text-center">
          <Phone className="size-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No emergency contacts yet</p>
          <p className="text-gray-400 text-sm mt-1">Add contacts for students to reach in emergencies</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <Card key={contact._id} className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-11 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                      {getInitials(contact.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 leading-tight">{contact.name}</p>
                      <Badge className={`text-xs border-0 mt-0.5 ${roleColor(contact.role)}`}>
                        {contact.role}
                      </Badge>
                    </div>
                  </div>
                  <button
                    onClick={() => setDeleteId(contact._id)}
                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                {contact.available24x7 && (
                  <div className="mb-3">
                    <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs gap-1">
                      <ShieldCheck className="size-3" />
                      24×7 Available
                    </Badge>
                  </div>
                )}

                <a
                  href={`tel:${contact.mobile}`}
                  className="flex items-center gap-2 w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors"
                >
                  <Phone className="size-4" />
                  {contact.mobile}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(o) => { setIsDialogOpen(o); if (!o) setForm(EMPTY_FORM); }}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add Emergency Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium text-gray-700">Name *</Label>
              <Input
                className="rounded-xl mt-1"
                placeholder="e.g., Dr. Rajesh Kumar"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Role / Designation *</Label>
              <Input
                className="rounded-xl mt-1"
                placeholder="e.g., Warden"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Phone Number *</Label>
              <Input
                className="rounded-xl mt-1"
                placeholder="e.g., +91 98765 43210"
                value={form.mobile}
                onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="available24x7"
                checked={form.available24x7}
                onChange={(e) => setForm((f) => ({ ...f, available24x7: e.target.checked }))}
                className="size-4 rounded accent-emerald-600"
              />
              <Label htmlFor="available24x7" className="text-sm font-medium text-gray-700 cursor-pointer">
                Available 24×7
              </Label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
            >
              {submitting ? "Adding..." : "Add Contact"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteId !== null} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Delete Contact</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 text-sm">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-gray-900">
              {contacts.find((c) => c._id === deleteId)?.name}
            </span>
            ? Students will no longer see this contact.
          </p>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && handleDelete(deleteId)}
              className="rounded-xl"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
