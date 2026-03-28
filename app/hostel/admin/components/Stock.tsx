"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Package, TrendingDown, TrendingUp } from "lucide-react";

export default function AdminStock() {
  const inventory = [
    { id: 1, item: "Rice (kg)", quantity: 450, threshold: 200, unit: "kg", status: "good" },
    { id: 2, item: "Dal (kg)", quantity: 180, threshold: 150, unit: "kg", status: "good" },
    { id: 3, item: "Cooking Oil (L)", quantity: 75, threshold: 100, unit: "L", status: "low" },
    { id: 4, item: "Vegetables", quantity: 120, threshold: 80, unit: "kg", status: "good" },
    { id: 5, item: "Spices", quantity: 45, threshold: 50, unit: "kg", status: "low" },
    { id: 6, item: "Tea/Coffee", quantity: 30, threshold: 40, unit: "kg", status: "low" },
  ];

  const dailyExpenditure = [
    { date: "March 17, 2026", rice: 25, dal: 15, oil: 8, vegetables: 20, total: "₹12,500" },
    { date: "March 16, 2026", rice: 28, dal: 16, oil: 7, vegetables: 22, total: "₹13,200" },
    { date: "March 15, 2026", rice: 26, dal: 14, oil: 9, vegetables: 18, total: "₹11,800" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Stock Management</h1>
        <p className="text-slate-600 mt-1">Monitor inventory and daily expenditure</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Items</p>
                <p className="text-3xl font-semibold text-slate-900">{inventory.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Low Stock Items</p>
                <p className="text-3xl font-semibold text-yellow-600">
                  {inventory.filter(i => i.status === "low").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Daily Avg Expense</p>
                <p className="text-3xl font-semibold text-green-600">₹12,500</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Current Quantity</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action Needed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.item}</TableCell>
                    <TableCell>
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell>
                      {item.threshold} {item.unit}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.status === "good"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {item.status === "good" ? "Good" : "Low Stock"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.status === "low" ? (
                        <span className="text-sm text-yellow-700">Reorder Soon</span>
                      ) : (
                        <span className="text-sm text-slate-500">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Daily Expenditure */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Daily Expenditure Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Rice (kg)</TableHead>
                  <TableHead>Dal (kg)</TableHead>
                  <TableHead>Oil (L)</TableHead>
                  <TableHead>Vegetables (kg)</TableHead>
                  <TableHead>Total Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailyExpenditure.map((day, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{day.date}</TableCell>
                    <TableCell>{day.rice}</TableCell>
                    <TableCell>{day.dal}</TableCell>
                    <TableCell>{day.oil}</TableCell>
                    <TableCell>{day.vegetables}</TableCell>
                    <TableCell className="font-semibold">{day.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
