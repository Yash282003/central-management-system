"use client";
import { Card, CardContent } from "@/components/ui/card";
import TnpNoticesPanel from "./TnpNoticesPanel";

export default function StudentNotifications() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Notifications & Announcements</h1>
        <p className="text-gray-600 mt-1">Stay updated with placement drives and announcements</p>
      </div>

      <TnpNoticesPanel hideBadge />

      <Card className="border-gray-200">
        <CardContent className="py-10 text-center text-gray-400">
          <p className="text-sm">All TnP office announcements appear above.</p>
          <p className="text-xs mt-1">New notices will show here as soon as the officer posts them.</p>
        </CardContent>
      </Card>
    </div>
  );
}
