"use client";

import { useEffect, useState } from "react";
import { Utensils, Coffee, Sun, Sunset, Moon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface MessMenu {
  day: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

const DAYS_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const meals = [
  {
    key: "breakfast" as keyof MessMenu,
    label: "Breakfast",
    icon: Coffee,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    key: "lunch" as keyof MessMenu,
    label: "Lunch",
    icon: Sun,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    key: "snacks" as keyof MessMenu,
    label: "Snacks",
    icon: Sunset,
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
  {
    key: "dinner" as keyof MessMenu,
    label: "Dinner",
    icon: Moon,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
];

export default function MessMenuPage() {
  const [menu, setMenu] = useState<MessMenu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("/api/hostel/student/mess");
        const data = await res.json();
        setMenu(Array.isArray(data) ? data : []);
      } catch {
        setMenu([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const sortedMenu = [...menu].sort(
    (a, b) => DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day)
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Mess Menu</h1>
        <p className="text-slate-500 mt-1">Weekly meal schedule for the hostel mess</p>
      </div>

      {/* Meal legend */}
      <div className="flex flex-wrap gap-3">
        {meals.map((m) => (
          <div
            key={m.key}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${m.bg} ${m.color}`}
          >
            <m.icon className="size-4" />
            {m.label}
          </div>
        ))}
      </div>

      {sortedMenu.length === 0 ? (
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="py-16 text-center">
            <Utensils className="size-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No menu available</p>
            <p className="text-sm text-slate-400 mt-1">
              The weekly mess menu hasn't been uploaded yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop: table */}
          <div className="hidden md:block overflow-x-auto">
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left px-6 py-4 text-slate-500 font-medium w-32">
                        Day
                      </th>
                      {meals.map((m) => (
                        <th
                          key={m.key}
                          className="text-left px-4 py-4 text-slate-500 font-medium"
                        >
                          <div className={`flex items-center gap-1.5 ${m.color}`}>
                            <m.icon className="size-4" />
                            {m.label}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedMenu.map((row, idx) => {
                      const isToday = row.day === today;
                      return (
                        <tr
                          key={idx}
                          className={`border-b border-slate-50 last:border-0 transition-colors ${
                            isToday
                              ? "bg-green-50"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-semibold ${
                                  isToday ? "text-green-700" : "text-slate-900"
                                }`}
                              >
                                {row.day}
                              </span>
                              {isToday && (
                                <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                                  Today
                                </span>
                              )}
                            </div>
                          </td>
                          {meals.map((m) => (
                            <td key={m.key} className="px-4 py-4 text-slate-700">
                              {row[m.key] || (
                                <span className="text-slate-300 italic text-xs">
                                  Not set
                                </span>
                              )}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* Mobile: cards */}
          <div className="md:hidden space-y-4">
            {sortedMenu.map((row, idx) => {
              const isToday = row.day === today;
              return (
                <Card
                  key={idx}
                  className={`rounded-2xl border-0 shadow-sm ${
                    isToday ? "ring-2 ring-green-500" : ""
                  }`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <span className={isToday ? "text-green-700" : "text-slate-900"}>
                        {row.day}
                      </span>
                      {isToday && (
                        <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-normal">
                          Today
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3">
                    {meals.map((m) => (
                      <div key={m.key} className={`p-3 rounded-xl ${m.bg}`}>
                        <div className={`flex items-center gap-1.5 mb-1 ${m.color}`}>
                          <m.icon className="size-3.5" />
                          <span className="text-xs font-semibold">{m.label}</span>
                        </div>
                        <p className="text-sm text-slate-700">
                          {row[m.key] || (
                            <span className="text-slate-400 italic text-xs">Not set</span>
                          )}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
