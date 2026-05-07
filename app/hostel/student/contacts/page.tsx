"use client";

import { useEffect, useState } from "react";
import { Phone, Users, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Contact {
  name: string;
  role: string;
  mobile: string;
  available24x7: boolean;
}

const ROLE_COLORS: Record<string, string> = {
  warden: "bg-emerald-100 text-emerald-700",
  "assistant warden": "bg-teal-100 text-teal-700",
  security: "bg-blue-100 text-blue-700",
  nurse: "bg-pink-100 text-pink-700",
  plumber: "bg-orange-100 text-orange-700",
  electrician: "bg-violet-100 text-violet-700",
  default: "bg-gray-100 text-gray-700",
};

function roleColor(role: string) {
  const key = role.toLowerCase();
  return ROLE_COLORS[key] ?? ROLE_COLORS.default;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ContactCard({ contact }: { contact: Contact }) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="size-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-semibold text-lg">
            {getInitials(contact.name)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{contact.name}</p>
            <span className={`inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${roleColor(contact.role)}`}>
              {contact.role}
            </span>
          </div>
          {contact.available24x7 && (
            <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs gap-1">
              <ShieldCheck className="size-3" />
              24×7 Available
            </Badge>
          )}
          <a
            href={`tel:${contact.mobile}`}
            className="flex items-center gap-2 mt-1 w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors"
          >
            <Phone className="size-4" />
            {contact.mobile}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("/api/hostel/student/contacts");
        const data = await res.json();
        setContacts(Array.isArray(data.data) ? data.data : []);
      } catch {
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const always = contacts.filter((c) => c.available24x7);
  const others = contacts.filter((c) => !c.available24x7);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Emergency Contacts</h1>
        <p className="text-gray-500 text-sm">
          Reach out to hostel staff for any assistance or emergency
        </p>
      </div>

      {contacts.length === 0 ? (
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="py-20 text-center">
            <Users className="size-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No contacts listed</p>
            <p className="text-sm text-gray-400 mt-1">
              Contact directory hasn't been set up yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {always.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-emerald-600" />
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Available 24×7
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {always.map((c, idx) => (
                  <ContactCard key={idx} contact={c} />
                ))}
              </div>
            </section>
          )}
          {others.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Other Staff
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {others.map((c, idx) => (
                  <ContactCard key={idx} contact={c} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
