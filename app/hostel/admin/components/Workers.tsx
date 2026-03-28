"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Calendar, DollarSign, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminWorkers() {
  const workers = [
    {
      id: 1,
      name: "Ramesh Kumar",
      role: "Cook",
      phone: "+91 98765 00001",
      salary: 18000,
      joinDate: "Jan 2024",
      status: "Active",
    },
    {
      id: 2,
      name: "Sunil Yadav",
      role: "Cleaner",
      phone: "+91 98765 00002",
      salary: 12000,
      joinDate: "Mar 2024",
      status: "Active",
    },
    {
      id: 3,
      name: "Vijay Singh",
      role: "Security Guard",
      phone: "+91 98765 00003",
      salary: 15000,
      joinDate: "Feb 2024",
      status: "Active",
    },
    {
      id: 4,
      name: "Rajesh Patel",
      role: "Electrician",
      phone: "+91 98765 00004",
      salary: 16000,
      joinDate: "Jan 2024",
      status: "Active",
    },
  ];

  const attendance = [
    { id: 1, name: "Ramesh Kumar", role: "Cook", date: "March 17, 2026", status: "Present" },
    { id: 2, name: "Sunil Yadav", role: "Cleaner", date: "March 17, 2026", status: "Present" },
    { id: 3, name: "Vijay Singh", role: "Security Guard", date: "March 17, 2026", status: "Present" },
    { id: 4, name: "Rajesh Patel", role: "Electrician", date: "March 17, 2026", status: "Absent" },
  ];

  const payments = [
    { id: 1, name: "Ramesh Kumar", month: "February 2026", amount: 18000, status: "Paid", date: "March 1, 2026" },
    { id: 2, name: "Sunil Yadav", month: "February 2026", amount: 12000, status: "Paid", date: "March 1, 2026" },
    { id: 3, name: "Vijay Singh", month: "February 2026", amount: 15000, status: "Pending", date: "-" },
    { id: 4, name: "Rajesh Patel", month: "February 2026", amount: 16000, status: "Pending", date: "-" },
  ];

  const complaints = [
    { id: 1, worker: "Ramesh Kumar", complaint: "Delayed in preparing breakfast", date: "March 15, 2026", status: "Resolved" },
    { id: 2, worker: "Sunil Yadav", complaint: "Not cleaning common areas properly", date: "March 12, 2026", status: "In Progress" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Workers Management</h1>
        <p className="text-slate-600 mt-1">Manage staff, attendance, payments, and issues</p>
      </div>

      <Tabs defaultValue="workers" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="workers">
            <Briefcase className="w-4 h-4 mr-2" />
            Workers
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <Calendar className="w-4 h-4 mr-2" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="payments">
            <DollarSign className="w-4 h-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="complaints">
            <MessageSquare className="w-4 h-4 mr-2" />
            Complaints
          </TabsTrigger>
        </TabsList>

        {/* Workers List */}
        <TabsContent value="workers" className="mt-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Workers List ({workers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Salary</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workers.map((worker) => (
                      <TableRow key={worker.id}>
                        <TableCell className="font-medium">{worker.name}</TableCell>
                        <TableCell>{worker.role}</TableCell>
                        <TableCell>{worker.phone}</TableCell>
                        <TableCell>₹{worker.salary.toLocaleString()}</TableCell>
                        <TableCell>{worker.joinDate}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                            {worker.status}
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

        {/* Attendance */}
        <TabsContent value="attendance" className="mt-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Today's Attendance - March 17, 2026</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.name}</TableCell>
                        <TableCell>{record.role}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            record.status === "Present"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {record.status}
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

        {/* Payments */}
        <TabsContent value="payments" className="mt-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Month</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.name}</TableCell>
                        <TableCell>{payment.month}</TableCell>
                        <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            payment.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {payment.status}
                          </span>
                        </TableCell>
                        <TableCell>{payment.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Complaints */}
        <TabsContent value="complaints" className="mt-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Worker Complaints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <div key={complaint.id} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-slate-900">{complaint.worker}</p>
                        <p className="text-sm text-slate-600 mt-1">{complaint.complaint}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        complaint.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{complaint.date}</p>
                  </div>
                ))}

                {complaints.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600">No complaints</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
