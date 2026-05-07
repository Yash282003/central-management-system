"use client";

import { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Building2,
  Users,
  GraduationCap,
  ChevronRight,
  Search,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/* ── Types ── */
type Drive = {
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

type Props = {
  upcoming: Drive[];
  current: Drive[];
  completed: Drive[];
};

/* ── Helpers ── */
const categoryColors: Record<string, string> = {
  Dream: 'bg-purple-100 text-purple-700 border-purple-200',
  'Super Dream': 'bg-pink-100 text-pink-700 border-pink-200',
  Core: 'bg-blue-100 text-blue-700 border-blue-200',
  Mass: 'bg-green-100 text-green-700 border-green-200',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/* ── Reusable Drive Card ── */
function DriveCard({
  drive,
  status,
}: {
  drive: Drive;
  status: 'upcoming' | 'current' | 'completed';
}) {
  const days = daysUntil(drive.driveDate);

  const statusConfig = {
    upcoming: {
      ring: 'border-l-4 border-l-indigo-500',
      dateBg: 'bg-indigo-50 text-indigo-700',
      dateLabel: days === 1 ? 'Tomorrow' : `In ${days} days`,
    },
    current: {
      ring: 'border-l-4 border-l-emerald-500',
      dateBg: 'bg-emerald-50 text-emerald-700',
      dateLabel: 'Today',
    },
    completed: {
      ring: 'border-l-4 border-l-gray-300',
      dateBg: 'bg-gray-100 text-gray-500',
      dateLabel: formatDate(drive.driveDate),
    },
  }[status];

  return (
    <Card
      className={`${statusConfig.ring} hover:shadow-md transition-shadow duration-200 p-6`}
    >
      <CardContent className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 text-base truncate">
                {drive.company}
              </h3>
              <Badge
                className={`text-xs px-2 py-0.5 ${categoryColors[drive.category] ?? 'bg-gray-100 text-gray-600'}`}
              >
                {drive.category}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{drive.role}</p>
          </div>

          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${statusConfig.dateBg}`}
          >
            {statusConfig.dateLabel}
          </span>
        </div>

        {/* Stats row */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center bg-gray-50 rounded-lg py-2 px-1">
            <span className="text-sm font-bold text-green-600">{drive.package}</span>
            <span className="text-[11px] text-gray-500 mt-0.5">Package</span>
          </div>
          <div className="flex flex-col items-center bg-gray-50 rounded-lg py-2 px-1">
            <span className="text-sm font-bold text-indigo-600">{drive.registered}</span>
            <span className="text-[11px] text-gray-500 mt-0.5">Registered</span>
          </div>
          <div className="flex flex-col items-center bg-gray-50 rounded-lg py-2 px-1">
            <span className="text-sm font-bold text-blue-600">{drive.eligible}</span>
            <span className="text-[11px] text-gray-500 mt-0.5">Eligible</span>
          </div>
        </div>

        {/* Details row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" />
            CGPA ≥ {drive.eligibility.cgpa}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(drive.driveDate)}
          </span>
        </div>

        {/* Branches */}
        <div className="mt-2 flex flex-wrap gap-1">
          {drive.eligibleBranches.map((b) => (
            <Badge key={b} variant="outline" className="text-[10px] px-1.5 py-0">
              {b}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Button size="sm" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8">
            View Details
          </Button>
          {status !== 'completed' && (
            <Button size="sm" variant="outline" className="text-xs h-8">
              Send Notice
            </Button>
          )}
          {status === 'completed' && (
            <Button size="sm" variant="outline" className="text-xs h-8 text-gray-500">
              View Report
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Section ── */
function DriveSection({
  title,
  icon,
  drives,
  accentClass,
  status,
  emptyMsg,
  searchQuery,
}: {
  title: string;
  icon: React.ReactNode;
  drives: Drive[];
  accentClass: string;
  status: 'upcoming' | 'current' | 'completed';
  emptyMsg: string;
  searchQuery: string;
}) {
  const filtered = drives.filter(
    (d) =>
      d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section>
      {/* Section Header */}
      <div className={`flex items-center gap-3 mb-4 pb-3 border-b ${accentClass}`}>
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        <Badge className="bg-gray-100 text-gray-700 text-xs">{filtered.length}</Badge>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400 italic py-6 text-center">{emptyMsg}</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((drive) => (
            <DriveCard key={drive._id} drive={drive} status={status} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ── Main Client View ── */
export default function PlacementDrivesView({ upcoming, current, completed }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const totalDrives = upcoming.length + current.length + completed.length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Placement Drives</h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalDrives} total drives — {upcoming.length} upcoming, {current.length} active, {completed.length} completed
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          + Schedule Drive
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: 'Upcoming',
            count: upcoming.length,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            icon: <Clock className="w-5 h-5 text-indigo-500" />,
          },
          {
            label: 'Active Today',
            count: current.length,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
          },
          {
            label: 'Completed',
            count: completed.length,
            color: 'text-gray-600',
            bg: 'bg-gray-100',
            icon: <Building2 className="w-5 h-5 text-gray-400" />,
          },
        ].map(({ label, count, color, bg, icon }) => (
          <Card key={label} className={`${bg} border-0`}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
              <div>
                <p className={`text-2xl font-bold ${color}`}>{count}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="search"
          placeholder="Search by company or role..."
          className="pl-9 bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Current / Active Today */}
      {(current.length > 0 || searchQuery === '') && (
        <DriveSection
          title="Active Today"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          drives={current}
          accentClass="border-emerald-200"
          status="current"
          emptyMsg="No drives scheduled for today."
          searchQuery={searchQuery}
        />
      )}

      {/* Upcoming */}
      <DriveSection
        title="Upcoming Drives"
        icon={<Clock className="w-5 h-5 text-indigo-500" />}
        drives={upcoming}
        accentClass="border-indigo-200"
        status="upcoming"
        emptyMsg="No upcoming drives at the moment."
        searchQuery={searchQuery}
      />

      {/* Completed */}
      <DriveSection
        title="Completed Drives"
        icon={<Building2 className="w-5 h-5 text-gray-400" />}
        drives={completed}
        accentClass="border-gray-200"
        status="completed"
        emptyMsg="No completed drives yet."
        searchQuery={searchQuery}
      />
    </div>
  );
}
