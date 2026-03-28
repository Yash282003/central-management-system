"use client";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, Award, Building2, LayoutDashboard, FileText, Settings, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '../../dashboardLayout';

const stats = [
  { title: 'Overall Placement Rate', value: '92%', change: '+5%', icon: Award, color: 'text-green-600', bg: 'bg-green-50' },
  { title: 'Total Students', value: '1,247', change: '+12%', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { title: 'Companies Visited', value: '48', change: '+8', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
  { title: 'Avg Package', value: '8.5 LPA', change: '+1.2', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
];

const yearlyPlacementData = [
  { year: '2020', percentage: 78, avgPackage: 6.2 },
  { year: '2021', percentage: 82, avgPackage: 6.8 },
  { year: '2022', percentage: 86, avgPackage: 7.3 },
  { year: '2023', percentage: 89, avgPackage: 7.9 },
  { year: '2024', percentage: 92, avgPackage: 8.5 },
];

const branchWisePlacementRate = [
  { branch: 'CSE', rate: 95, avgPackage: 12.5 },
  { branch: 'IT', rate: 93, avgPackage: 11.2 },
  { branch: 'ECE', rate: 90, avgPackage: 9.8 },
  { branch: 'EEE', rate: 86, avgPackage: 8.5 },
  { branch: 'MECH', rate: 83, avgPackage: 7.2 },
  { branch: 'CIVIL', rate: 82, avgPackage: 6.8 },
];

const packageTrends = [
  { year: '2020', min: 3.5, avg: 6.2, max: 18 },
  { year: '2021', min: 3.8, avg: 6.8, max: 22 },
  { year: '2022', min: 4.2, avg: 7.3, max: 24 },
  { year: '2023', min: 4.5, avg: 7.9, max: 28 },
  { year: '2024', min: 5.0, avg: 8.5, max: 32 },
];

export default function ManagementDashboard() {
  return (
    
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Management Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive placement analytics and insights</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`${stat.bg} p-3 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <span className="text-sm font-medium text-green-600">{stat.change}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Placement Trends */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Placement Percentage & Average Package Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={yearlyPlacementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="percentage" 
                  stroke="#4f46e5" 
                  strokeWidth={2} 
                  name="Placement %" 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="avgPackage" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  name="Avg Package (LPA)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Branch-wise Placement Rate */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Branch-wise Placement Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={branchWisePlacementRate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="branch" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rate" fill="#4f46e5" name="Placement Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Package Trends */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Package Distribution Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={packageTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="min" stroke="#f59e0b" strokeWidth={2} name="Min Package" />
                  <Line type="monotone" dataKey="avg" stroke="#4f46e5" strokeWidth={2} name="Avg Package" />
                  <Line type="monotone" dataKey="max" stroke="#10b981" strokeWidth={2} name="Max Package" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Branch-wise Detailed Stats */}
        <Card className="border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Detailed Branch-wise Statistics</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export as CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Branch</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Placement Rate</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Avg Package</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Highest Package</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Companies</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {branchWisePlacementRate.map((branch) => (
                    <tr key={branch.branch} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{branch.branch}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-600 rounded-full" 
                              style={{ width: `${branch.rate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-indigo-600">{branch.rate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-green-600 font-medium">{branch.avgPackage} LPA</td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {branch.branch === 'CSE' ? '32 LPA' : 
                         branch.branch === 'IT' ? '28 LPA' : 
                         branch.branch === 'ECE' ? '24 LPA' : '18 LPA'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {branch.branch === 'CSE' ? '35' : 
                         branch.branch === 'IT' ? '32' : 
                         branch.branch === 'ECE' ? '28' : '22'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          branch.rate >= 90 ? 'bg-green-100 text-green-800' : 
                          branch.rate >= 85 ? 'bg-blue-100 text-blue-800' : 
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {branch.rate >= 90 ? 'Excellent' : branch.rate >= 85 ? 'Good' : 'Average'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Annual Report</h3>
                  <p className="text-sm text-gray-600">Download complete report</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:border-green-300 hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Analytics Dashboard</h3>
                  <p className="text-sm text-gray-600">View detailed insights</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Top Performers</h3>
                  <p className="text-sm text-gray-600">View student rankings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    
  );
}