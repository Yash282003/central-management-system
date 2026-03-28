"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, Calendar, History, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminMess() {
  const [selectedDate, setSelectedDate] = useState("2026-03-17");
  const [selectedMeal, setSelectedMeal] = useState("all");

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

  const todayMenu = {
    breakfast: ["Poha", "Samosa", "Tea/Coffee", "Bread & Butter"],
    lunch: ["Rice", "Dal", "Paneer Curry", "Roti", "Salad", "Curd"],
    snacks: ["Samosa", "Tea/Coffee"],
    dinner: ["Rice", "Rajma", "Roti", "Mix Veg", "Salad"],
  };

  const feeStatus = [
    { name: "Rahul Sharma", regNo: "21BCE1234", amount: 15000, status: "Paid", paidDate: "March 1, 2026" },
    { name: "Priya Singh", regNo: "21BCE1245", amount: 15000, status: "Pending", dueDate: "March 25, 2026" },
    { name: "Amit Patel", regNo: "21BCE1256", amount: 15000, status: "Paid", paidDate: "March 5, 2026" },
  ];

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
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Today's Menu - March 17, 2026</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Breakfast</h4>
                <div className="flex flex-wrap gap-2">
                  {todayMenu.breakfast.map((item, index) => (
                    <span key={index} className="px-3 py-1.5 bg-orange-100 text-orange-700 text-sm rounded-lg">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Lunch</h4>
                <div className="flex flex-wrap gap-2">
                  {todayMenu.lunch.map((item, index) => (
                    <span key={index} className="px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-lg">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Snacks</h4>
                <div className="flex flex-wrap gap-2">
                  {todayMenu.snacks.map((item, index) => (
                    <span key={index} className="px-3 py-1.5 bg-yellow-100 text-yellow-700 text-sm rounded-lg">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Dinner</h4>
                <div className="flex flex-wrap gap-2">
                  {todayMenu.dinner.map((item, index) => (
                    <span key={index} className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-lg">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
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
