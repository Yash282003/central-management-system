"use client";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, Award, Building2, LayoutDashboard, Bell, FileText, Settings } from 'lucide-react';
import DashboardLayout from '../../dashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  { title: 'Total Students', value: '1,247', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { title: 'Students Placed', value: '1,147', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  { title: 'Students Unplaced', value: '100', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
  { title: 'Placement %', value: '92%', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
];

const branchWiseData = [
  { branch: 'CSE', placed: 250, unplaced: 20 },
  { branch: 'ECE', placed: 180, unplaced: 20 },
  { branch: 'EEE', placed: 120, unplaced: 20 },
  { branch: 'MECH', placed: 150, unplaced: 30 },
  { branch: 'CIVIL', placed: 140, unplaced: 30 },
  { branch: 'IT', placed: 200, unplaced: 15 },
];

const companyHiringData = [
  { name: 'TCS', value: 180 },
  { name: 'Infosys', value: 150 },
  { name: 'Wipro', value: 120 },
  { name: 'Accenture', value: 100 },
  { name: 'Others', value: 597 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const recentActivities = [
  { action: 'Student marked as placed', student: 'Rahul Kumar (2021CS045)', company: 'Google', time: '2 hours ago' },
  { action: 'New company added', student: 'Amazon Web Services', company: '', time: '4 hours ago' },
  { action: 'Drive scheduled', student: 'Microsoft Campus Drive', company: '', time: '6 hours ago' },
  { action: 'Student profile updated', student: 'Priya Sharma (2021EC089)', company: '', time: '1 day ago' },
];

export default function OfficerDashboard() {
  return (
    
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Monitor placement statistics and activities</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`${stat.bg} p-3 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Branch-wise Placement */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Branch-wise Placement Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={branchWiseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="branch" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="placed" fill="#4f46e5" name="Placed" />
                  <Bar dataKey="unplaced" fill="#f59e0b" name="Unplaced" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Company Hiring Distribution */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Company Hiring Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={companyHiringData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {companyHiringData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.student} {activity.company && `at ${activity.company}`}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Table */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Branch-wise Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Branch</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Placed</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Unplaced</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {branchWiseData.map((branch) => {
                    const total = branch.placed + branch.unplaced;
                    const percentage = ((branch.placed / total) * 100).toFixed(1);
                    return (
                      <tr key={branch.branch} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{branch.branch}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{total}</td>
                        <td className="py-3 px-4 text-sm text-green-600 font-medium">{branch.placed}</td>
                        <td className="py-3 px-4 text-sm text-orange-600 font-medium">{branch.unplaced}</td>
                        <td className="py-3 px-4 text-sm text-indigo-600 font-semibold">{percentage}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
   
  );
}