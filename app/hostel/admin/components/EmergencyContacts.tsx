"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AdminEmergencyContacts() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const contacts = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      role: "Warden",
      phone: "+91 98765 43210",
      email: "warden.ganga@university.edu",
    },
    {
      id: 2,
      name: "Mr. Suresh Patel",
      role: "Assistant Warden",
      phone: "+91 98765 43211",
      email: "asst.warden@university.edu",
    },
    {
      id: 3,
      name: "Mr. Anil Sharma",
      role: "Hall Assistant",
      phone: "+91 98765 43212",
      email: "hall.assistant@university.edu",
    },
    {
      id: 4,
      name: "University Hospital",
      role: "Medical Emergency",
      phone: "+91 98765 43220",
      email: "hospital@university.edu",
    },
    {
      id: 5,
      name: "Campus Security",
      role: "Security",
      phone: "+91 98765 43230",
      email: "security@university.edu",
    },
  ];

  const handleSave = () => {
    if (!name || !role || !phone) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editingId) {
      toast.success("Contact updated successfully");
    } else {
      toast.success("Contact added successfully");
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setName("");
    setRole("");
    setPhone("");
    setEmail("");
    setEditingId(null);
  };

  const handleEdit = (contact: any) => {
    setEditingId(contact.id);
    setName(contact.name);
    setRole(contact.role);
    setPhone(contact.phone);
    setEmail(contact.email);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    toast.success("Contact deleted");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Emergency Contacts</h1>
          <p className="text-slate-600 mt-1">Manage emergency contact information</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Contact" : "Add New Contact"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update contact information" : "Add a new emergency contact"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Dr. Rajesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role/Designation *</Label>
                <Input
                  id="role"
                  placeholder="e.g., Warden"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="e.g., +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., warden@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1">
                  {editingId ? "Update" : "Add"} Contact
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contacts.map((contact) => (
          <Card key={contact.id} className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                    <Phone className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{contact.name}</div>
                    <div className="text-sm text-slate-600 font-normal">{contact.role}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => handleEdit(contact)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => handleDelete(contact.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 text-slate-500 mr-2" />
                <a href={`tel:${contact.phone}`} className="text-slate-700 hover:text-slate-900">
                  {contact.phone}
                </a>
              </div>
              {contact.email && (
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-slate-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${contact.email}`} className="text-slate-700 hover:text-slate-900">
                    {contact.email}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {contacts.length === 0 && (
        <Card className="border-slate-200">
          <CardContent className="text-center py-12">
            <Phone className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600">No emergency contacts added yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
