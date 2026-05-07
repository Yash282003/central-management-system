"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, TrendingDown, TrendingUp, AlertTriangle, Plus } from "lucide-react";
import { toast } from "sonner";

interface InventoryItem {
  id: number;
  item: string;
  quantity: number;
  threshold: number;
  unit: string;
}

const dailyExpenditure = [
  { date: "March 17, 2026", rice: 25, dal: 15, oil: 8, vegetables: 20, total: "₹12,500" },
  { date: "March 16, 2026", rice: 28, dal: 16, oil: 7, vegetables: 22, total: "₹13,200" },
  { date: "March 15, 2026", rice: 26, dal: 14, oil: 9, vegetables: 18, total: "₹11,800" },
];

export default function AdminStock() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, item: "Rice", quantity: 450, threshold: 200, unit: "kg" },
    { id: 2, item: "Dal", quantity: 180, threshold: 150, unit: "kg" },
    { id: 3, item: "Cooking Oil", quantity: 75, threshold: 100, unit: "L" },
    { id: 4, item: "Vegetables", quantity: 120, threshold: 80, unit: "kg" },
    { id: 5, item: "Spices", quantity: 45, threshold: 50, unit: "kg" },
    { id: 6, item: "Tea/Coffee", quantity: 30, threshold: 40, unit: "kg" },
  ]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ item: "", quantity: "", threshold: "", unit: "kg" });

  const lowStockItems = inventory.filter((i) => i.quantity < i.threshold);
  const isLow = (item: InventoryItem) => item.quantity < item.threshold;

  const handleAdd = () => {
    if (!form.item.trim() || !form.quantity || !form.threshold) {
      toast.error("Please fill all required fields");
      return;
    }
    const newItem: InventoryItem = {
      id: Date.now(),
      item: form.item,
      quantity: Number(form.quantity),
      threshold: Number(form.threshold),
      unit: form.unit,
    };
    setInventory((prev) => [...prev, newItem]);
    setForm({ item: "", quantity: "", threshold: "", unit: "kg" });
    setOpen(false);
    toast.success("Item added to inventory");
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Stock Management</h1>
          <p className="text-gray-500 text-sm">Monitor inventory levels and daily expenditure</p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2"
        >
          <Plus className="size-4" />
          Add Item
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-blue-600 mb-1">Total Items</p>
            <p className="text-3xl font-bold text-blue-700">{inventory.length}</p>
            <p className="text-xs text-blue-500 mt-1">in inventory</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-orange-600 mb-1">Low Stock</p>
            <p className="text-3xl font-bold text-orange-700">{lowStockItems.length}</p>
            <p className="text-xs text-orange-500 mt-1">items below threshold</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-emerald-600 mb-1">Daily Avg</p>
            <p className="text-3xl font-bold text-emerald-700">₹12.5k</p>
            <p className="text-xs text-emerald-500 mt-1">expenditure</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert Banner */}
      {lowStockItems.length > 0 && (
        <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4 mb-6">
          <AlertTriangle className="size-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-orange-800">Low stock alert</p>
            <p className="text-sm text-orange-700 mt-0.5">
              {lowStockItems.map((i) => i.item).join(", ")} are running low and need restocking.
            </p>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <Card className="rounded-2xl border-0 shadow-sm mb-6">
        <div className="px-5 pt-5 pb-3 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Current Inventory</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-semibold text-gray-600">Item</TableHead>
                <TableHead className="font-semibold text-gray-600">Quantity</TableHead>
                <TableHead className="font-semibold text-gray-600">Threshold</TableHead>
                <TableHead className="font-semibold text-gray-600">Status</TableHead>
                <TableHead className="font-semibold text-gray-600">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`size-8 rounded-lg flex items-center justify-center ${isLow(item) ? "bg-orange-50" : "bg-emerald-50"}`}>
                        <Package className={`size-4 ${isLow(item) ? "text-orange-500" : "text-emerald-600"}`} />
                      </div>
                      <span className="font-medium text-gray-900">{item.item}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700 font-medium">
                    {item.quantity} {item.unit}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {item.threshold} {item.unit}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-xs border-0 gap-1 ${
                        isLow(item)
                          ? "bg-orange-100 text-orange-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {isLow(item) ? (
                        <><TrendingDown className="size-3" /> Low Stock</>
                      ) : (
                        <><TrendingUp className="size-3" /> Good</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {isLow(item) ? (
                      <span className="text-sm text-orange-600 font-medium">Reorder Soon</span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Daily Expenditure */}
      <Card className="rounded-2xl border-0 shadow-sm">
        <div className="px-5 pt-5 pb-3 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Daily Expenditure Log</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-semibold text-gray-600">Date</TableHead>
                <TableHead className="font-semibold text-gray-600">Rice (kg)</TableHead>
                <TableHead className="font-semibold text-gray-600">Dal (kg)</TableHead>
                <TableHead className="font-semibold text-gray-600">Oil (L)</TableHead>
                <TableHead className="font-semibold text-gray-600">Vegetables (kg)</TableHead>
                <TableHead className="font-semibold text-gray-600">Total Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dailyExpenditure.map((day, index) => (
                <TableRow key={index} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium text-gray-900">{day.date}</TableCell>
                  <TableCell className="text-gray-700">{day.rice}</TableCell>
                  <TableCell className="text-gray-700">{day.dal}</TableCell>
                  <TableCell className="text-gray-700">{day.oil}</TableCell>
                  <TableCell className="text-gray-700">{day.vegetables}</TableCell>
                  <TableCell className="font-semibold text-emerald-700">{day.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add Item Dialog */}
      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setForm({ item: "", quantity: "", threshold: "", unit: "kg" }); }}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add Inventory Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium text-gray-700">Item Name *</Label>
              <Input
                className="rounded-xl mt-1"
                placeholder="e.g., Rice"
                value={form.item}
                onChange={(e) => setForm((f) => ({ ...f, item: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-sm font-medium text-gray-700">Quantity *</Label>
                <Input
                  className="rounded-xl mt-1"
                  type="number"
                  placeholder="0"
                  value={form.quantity}
                  onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Threshold *</Label>
                <Input
                  className="rounded-xl mt-1"
                  type="number"
                  placeholder="0"
                  value={form.threshold}
                  onChange={(e) => setForm((f) => ({ ...f, threshold: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Unit</Label>
                <Input
                  className="rounded-xl mt-1"
                  placeholder="kg"
                  value={form.unit}
                  onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
            >
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
