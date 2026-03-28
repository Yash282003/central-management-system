"use client"
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Utensils, Calendar as CalendarIcon, Info } from "lucide-react";


export default function StudentMess() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const todayMenu = {
    breakfast: ["Poha", "Samosa", "Tea/Coffee", "Bread & Butter"],
    lunch: ["Rice", "Dal", "Paneer Curry", "Roti", "Salad", "Curd"],
    snacks: ["Samosa", "Tea/Coffee"],
    dinner: ["Rice", "Rajma", "Roti", "Mix Veg", "Salad"],
  };

  // Mock calendar data - dots represent meals taken
  const mealHistory = [
    { date: "2026-03-15", meals: ["breakfast", "lunch", "dinner"] },
    { date: "2026-03-16", meals: ["breakfast", "dinner"] },
    { date: "2026-03-17", meals: ["breakfast", "lunch"] },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(selectedDate);
  const monthName = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const getMealDots = (day: number) => {
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayMeals = mealHistory.find(m => m.date === dateStr);
    return dayMeals?.meals || [];
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Mess Management</h1>
        <p className="text-slate-600 mt-1">QR attendance, menu, and meal history</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Scan Section */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="w-5 h-5 mr-2 text-slate-600" />
              QR Code Attendance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-100 rounded-lg p-8 flex items-center justify-center">
              <div className="text-center">
                <QrCode className="w-32 h-32 text-slate-400 mx-auto mb-4" />
                <p className="text-sm text-slate-600">Scan this QR at mess entry</p>
              </div>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Info className="w-4 h-4 mr-2" />
                  How to use?
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>QR Code Instructions</DialogTitle>
                  <DialogDescription>
                    Follow these steps to mark your mess attendance
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 mt-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <p className="ml-3 text-sm text-slate-700">
                      Show your QR code at the mess entrance
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <p className="ml-3 text-sm text-slate-700">
                      Warden/staff will scan your QR code
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <p className="ml-3 text-sm text-slate-700">
                      Your attendance will be marked automatically
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      4
                    </div>
                    <p className="ml-3 text-sm text-slate-700">
                      Check your meal history in the calendar below
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Today's Menu */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Utensils className="w-5 h-5 mr-2 text-slate-600" />
              Today's Menu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Breakfast</h4>
              <div className="flex flex-wrap gap-2">
                {todayMenu.breakfast.map((item, index) => (
                  <span key={index} className="px-2.5 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Lunch</h4>
              <div className="flex flex-wrap gap-2">
                {todayMenu.lunch.map((item, index) => (
                  <span key={index} className="px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Snacks</h4>
              <div className="flex flex-wrap gap-2">
                {todayMenu.snacks.map((item, index) => (
                  <span key={index} className="px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Dinner</h4>
              <div className="flex flex-wrap gap-2">
                {todayMenu.dinner.map((item, index) => (
                  <span key={index} className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meal Calendar */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-slate-600" />
            Meal History Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-center font-semibold text-slate-900 mb-4">{monthName}</h3>
            
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-slate-600 py-2">
                  {day}
                </div>
              ))}
              
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} />
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const meals = getMealDots(day);
                const isToday = day === new Date().getDate() && 
                               selectedDate.getMonth() === new Date().getMonth() &&
                               selectedDate.getFullYear() === new Date().getFullYear();
                
                return (
                  <div
                    key={day}
                    className={`aspect-square border border-slate-200 rounded-lg p-2 flex flex-col items-center justify-between ${
                      isToday ? "bg-slate-900 text-white border-slate-900" : "bg-white"
                    }`}
                  >
                    <span className="text-sm font-medium">{day}</span>
                    <div className="flex gap-1">
                      {meals.includes("breakfast") && (
                        <div className={`w-1.5 h-1.5 rounded-full ${isToday ? "bg-orange-300" : "bg-orange-500"}`} />
                      )}
                      {meals.includes("lunch") && (
                        <div className={`w-1.5 h-1.5 rounded-full ${isToday ? "bg-green-300" : "bg-green-500"}`} />
                      )}
                      {meals.includes("dinner") && (
                        <div className={`w-1.5 h-1.5 rounded-full ${isToday ? "bg-blue-300" : "bg-blue-500"}`} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 justify-center pt-4 border-t border-slate-200">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-2" />
              <span className="text-xs text-slate-600">Breakfast</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
              <span className="text-xs text-slate-600">Lunch</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
              <span className="text-xs text-slate-600">Dinner</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
