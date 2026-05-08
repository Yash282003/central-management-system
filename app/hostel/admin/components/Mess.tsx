"use client"
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Utensils, Calendar, History, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type MenuItem = {
  day: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
};

type MenuState = Record<string, Omit<MenuItem, "day">>;

function buildEmptyMenu(): MenuState {
  return Object.fromEntries(
    DAYS.map((day) => [day, { breakfast: "", lunch: "", snacks: "", dinner: "" }])
  );
}

export default function AdminMess() {
  const [selectedDate, setSelectedDate] = useState("2026-03-17");
  const [selectedMeal, setSelectedMeal] = useState("all");

  // Menu tab state
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuSaving, setMenuSaving] = useState(false);
  const [menu, setMenu] = useState<MenuState>(buildEmptyMenu());

  const attendanceData = [
    { id: 1, name: "Rahul Sharma", regNo: "21BCE1234", room: "A-204", breakfast: true, lunch: true, dinner: false },
    { id: 2, name: "Priya Singh", regNo: "21BCE1245", room: "B-305", breakfast: true, lunch: false, dinner: true },
    { id: 3, name: "Amit Patel", regNo: "21BCE1256", room: "C-102", breakfast: false, lunch: true, dinner: true },
  ];

  const historyData = [
    { date: "March 17, 2026", breakfast: 218, lunch: 195, dinner: 232, total: 645 },
    { date: "March 16, 2026", breakfast: 225, lunch: 203, dinner: 240, total: 668 },
    { date: "March 15, 2026", breakfast: 220, lunch: 198, dinner: 235, total: 653 },
  ];

  const feeStatus = [
    { name: "Rahul Sharma", regNo: "21BCE1234", amount: 15000, status: "Paid", paidDate: "March 1, 2026" },
    { name: "Priya Singh", regNo: "21BCE1245", amount: 15000, status: "Pending", dueDate: "March 25, 2026" },
    { name: "Amit Patel", regNo: "21BCE1256", amount: 15000, status: "Paid", paidDate: "March 5, 2026" },
  ];

  useEffect(() => {
    async function fetchMenu() {
      setMenuLoading(true);
      try {
        const res = await fetch("/api/hostel/admin/mess");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const next = buildEmptyMenu();
          for (const item of json.data as MenuItem[]) {
            if (next[item.day] !== undefined) {
              next[item.day] = {
                breakfast: item.breakfast ?? "",
                lunch: item.lunch ?? "",
                snacks: item.snacks ?? "",
                dinner: item.dinner ?? "",
              };
            }
          }
          setMenu(next);
        }
      } catch {
        toast.error("Failed to load mess menu.");
      } finally {
        setMenuLoading(false);
      }
    }
    fetchMenu();
  }, []);

  function handleMenuChange(day: string, field: keyof Omit<MenuItem, "day">, value: string) {
    setMenu((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  }

  async function handleSaveMenu() {
    setMenuSaving(true);
    try {
      const menuItems: MenuItem[] = DAYS.map((day) => ({ day, ...menu[day] }));
      const res = await fetch("/api/hostel/admin/mess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuItems }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Menu saved successfully.");
      } else {
        toast.error(json.message ?? "Failed to save menu.");
      }
    } catch {
      toast.error("Failed to save menu.");
    } finally {
      setMenuSaving(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Mess Management</h1>
        <p className="text-slate-600 mt-1">Manage meal attendance, menu, and fees</p>
      </div>

      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="attendance">
            <Calendar className="w-4 h-4 mr-2" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="menu">
            <Utensils className="w-4 h-4 mr-2" />
            Menu
          </TabsTrigger>
          <TabsTrigger value="fees">
            <DollarSign className="w-4 h-4 mr-2" />
            Fees
          </TabsTrigger>
        </TabsList>

        {/* Attendance */}
        <TabsContent value="attendance" className="mt-6 space-y-4">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Meal Attendance Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meal Type</label>
                  <Select value={selectedMeal} onValueChange={setSelectedMeal}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Meals</SelectItem>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Attendance Records - {selectedDate}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Reg No</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Breakfast</TableHead>
                      <TableHead>Lunch</TableHead>
                      <TableHead>Dinner</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceData.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.regNo}</TableCell>
                        <TableCell>{student.room}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            student.breakfast
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}>
                            {student.breakfast ? "Present" : "Absent"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            student.lunch
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}>
                            {student.lunch ? "Present" : "Absent"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            student.dinner
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}>
                            {student.dinner ? "Present" : "Absent"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="mt-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Breakfast</TableHead>
                      <TableHead>Lunch</TableHead>
                      <TableHead>Dinner</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyData.map((day, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{day.date}</TableCell>
                        <TableCell>{day.breakfast}</TableCell>
                        <TableCell>{day.lunch}</TableCell>
                        <TableCell>{day.dinner}</TableCell>
                        <TableCell className="font-semibold">{day.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Menu */}
        <TabsContent value="menu" className="mt-6">
          <Card className="rounded-2xl border-0 shadow-sm bg-gray-50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Weekly Menu Editor</CardTitle>
              <Button
                onClick={handleSaveMenu}
                disabled={menuLoading || menuSaving}
                className="shrink-0"
              >
                {menuSaving ? "Saving..." : "Save Menu"}
              </Button>
            </CardHeader>
            <CardContent>
              {menuLoading ? (
                <div className="space-y-3">
                  {DAYS.map((day) => (
                    <div key={day} className="flex gap-3 items-center">
                      <Skeleton className="h-9 w-24 shrink-0" />
                      <Skeleton className="h-9 flex-1" />
                      <Skeleton className="h-9 flex-1" />
                      <Skeleton className="h-9 flex-1" />
                      <Skeleton className="h-9 flex-1" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 pr-4 font-medium text-slate-700 w-28">Day</th>
                        <th className="text-left py-2 px-2 font-medium text-slate-700">Breakfast</th>
                        <th className="text-left py-2 px-2 font-medium text-slate-700">Lunch</th>
                        <th className="text-left py-2 px-2 font-medium text-slate-700">Snacks</th>
                        <th className="text-left py-2 px-2 font-medium text-slate-700">Dinner</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DAYS.map((day) => (
                        <tr key={day} className="border-b border-slate-100 last:border-0">
                          <td className="py-2 pr-4 font-medium text-slate-800 whitespace-nowrap">{day}</td>
                          {(["breakfast", "lunch", "snacks", "dinner"] as const).map((field) => (
                            <td key={field} className="py-2 px-2">
                              <Input
                                value={menu[day][field]}
                                onChange={(e) => handleMenuChange(day, field, e.target.value)}
                                placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)}...`}
                                className="bg-white border-slate-200"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fees */}
        <TabsContent value="fees" className="mt-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Mess Fee Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Reg No</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feeStatus.map((student, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.regNo}</TableCell>
                        <TableCell>₹{student.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            student.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {student.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {student.status === "Paid"
                            ? `Paid: ${student.paidDate}`
                            : `Due: ${student.dueDate}`}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
