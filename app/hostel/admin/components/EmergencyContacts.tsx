"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  id: number;
  name: string;
  role: string;
  phone: string;
  email: string;
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
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AdminEmergencyContacts() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", role: "", phone: "", email: "", available24x7: false });

  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: "Dr. Rajesh Kumar", role: "Warden", phone: "+91 98765 43210", email: "warden.ganga@university.edu", available24x7: true },
    { id: 2, name: "Mr. Suresh Patel", role: "Assistant Warden", phone: "+91 98765 43211", email: "asst.warden@university.edu" },
    { id: 3, name: "Mr. Anil Sharma", role: "Hall Assistant", phone: "+91 98765 43212", email: "hall.assistant@university.edu" },
    { id: 4, name: "University Hospital", role: "Medical Emergency", phone: "+91 98765 43220", email: "hospital@university.edu", available24x7: true },
    { id: 5, name: "Campus Security", role: "Security", phone: "+91 98765 43230", email: "security@university.edu", available24x7: true },
  ]);

  const resetForm = () => {
    setForm({ name: "", role: "", phone: "", email: "", available24x7: false });
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.role.trim() || !form.phone.trim()) {
      toast.error("Name, role, and phone are required");
      return;
    }
    const newContact: Contact = {
      id: Date.now(),
      name: form.name,
      role: form.role,
      phone: form.phone,
      email: form.email,
      available24x7: form.available24x7,
    };
    setContacts((prev) => [...prev, newContact]);
    resetForm();
    setIsDialogOpen(false);
    toast.success("Contact added successfully");
  };

  const handleDelete = (id: number) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setDeleteId(null);
    toast.success("Contact deleted");
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Emergency Contacts</h1>
          <p className="text-gray-500 text-sm">Manage emergency contact information for hostel students</p>
        </div>
        <Button
          onClick={() => { resetForm(); setIsDialogOpen(true); }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2"
        >
          <Plus className="size-4" />
          Add Contact
        </Button>
      </div>

      {/* Stats */}
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
            <p className="text-xs font-medium text-blue-600 mb-1">24x7 Available</p>
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

      {contacts.length === 0 ? (
        <div className="py-20 text-center">
          <Phone className="size-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No emergency contacts yet</p>
          <p className="text-gray-400 text-sm mt-1">Add contacts for students to reach in emergencies</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
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
                    onClick={() => setDeleteId(contact.id)}
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

                <div className="space-y-2">
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-2 w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors"
                  >
                    <Phone className="size-4" />
                    {contact.phone}
                  </a>
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Mail className="size-3.5 text-gray-400" />
                      <span className="truncate">{contact.email}</span>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Contact Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(o) => { setIsDialogOpen(o); if (!o) resetForm(); }}>
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
              <Label className="text-sm font-medium text-gray-700">Role/Designation *</Label>
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
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Email (optional)</Label>
              <Input
                className="rounded-xl mt-1"
                type="email"
                placeholder="e.g., warden@university.edu"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
            >
              Add Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Delete Contact</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 text-sm">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-gray-900">
              {contacts.find((c) => c.id === deleteId)?.name}
            </span>
            ? This action cannot be undone.
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
              Delete Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
