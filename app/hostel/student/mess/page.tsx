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

const DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const meals = [
  { key: "breakfast" as keyof MessMenu, label: "Breakfast", icon: Coffee, color: "text-orange-600", bg: "bg-orange-50" },
  { key: "lunch" as keyof MessMenu, label: "Lunch", icon: Sun, color: "text-emerald-600", bg: "bg-emerald-50" },
  { key: "snacks" as keyof MessMenu, label: "Snacks", icon: Sunset, color: "text-pink-600", bg: "bg-pink-50" },
  { key: "dinner" as keyof MessMenu, label: "Dinner", icon: Moon, color: "text-indigo-600", bg: "bg-indigo-50" },
];

export default function MessMenuPage() {
  const [menu, setMenu] = useState<MessMenu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("/api/hostel/student/mess");
        const data = await res.json();
        setMenu(Array.isArray(data.data) ? data.data : []);
      } catch {
        setMenu([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const sortedMenu = [...menu].sort((a, b) => DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day));

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-9 w-28 rounded-full" />)}
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Mess Menu</h1>
        <p className="text-gray-500 text-sm">Weekly meal schedule for the hostel mess</p>
      </div>

      {/* Meal legend */}
      <div className="flex flex-wrap gap-3 mb-6">
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
          <CardContent className="py-20 text-center">
            <Utensils className="size-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No menu available</p>
            <p className="text-sm text-gray-400 mt-1">
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
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="text-left px-6 py-4 text-gray-500 font-medium w-36">Day</th>
                      {meals.map((m) => (
                        <th key={m.key} className="text-left px-4 py-4 text-gray-500 font-medium">
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
                          className={`border-b border-gray-50 last:border-0 transition-colors ${
                            isToday ? "bg-emerald-50/60" : "hover:bg-gray-50/50"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold ${isToday ? "text-emerald-700" : "text-gray-900"}`}>
                                {row.day}
                              </span>
                              {isToday && (
                                <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full font-medium">
                                  Today
                                </span>
                              )}
                            </div>
                          </td>
                          {meals.map((m) => (
                            <td key={m.key} className="px-4 py-4 text-gray-700">
                              {row[m.key] || (
                                <span className="text-gray-300 italic text-xs">Not set</span>
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
                  className={`rounded-2xl border-0 shadow-sm ${isToday ? "ring-2 ring-emerald-500" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <span className={isToday ? "text-emerald-700" : "text-gray-900"}>
                        {row.day}
                      </span>
                      {isToday && (
                        <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full font-normal">
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
                        <p className="text-sm text-gray-700">
                          {row[m.key] || (
                            <span className="text-gray-400 italic text-xs">Not set</span>
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
