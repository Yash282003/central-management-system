"use client";
import { 
  Users, 
  Building2, 
  LayoutDashboard, 
  Bell, 
  FileText, 
  Settings,
  Download,
  Award
} from 'lucide-react';
import DashboardLayout from '../../dashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';



const reports = [
  {
    title: 'Overall Placement Report',
    description: 'Complete placement statistics for all branches',
    formats: ['PDF', 'CSV']
  },
  {
    title: 'Branch-wise Placement Report',
    description: 'Detailed placement data segregated by branch',
    formats: ['PDF', 'CSV', 'Excel']
  },
  {
    title: 'Company-wise Hiring Report',
    description: 'Students hired by each company',
    formats: ['PDF', 'CSV']
  },
  {
    title: 'Student Placement List',
    description: 'List of all placed students with details',
    formats: ['PDF', 'CSV', 'Excel']
  },
  {
    title: 'Unplaced Students Report',
    description: 'List of unplaced students for follow-up',
    formats: ['PDF', 'CSV']
  },
  {
    title: 'Package Distribution Report',
    description: 'Analysis of salary packages offered',
    formats: ['PDF', 'CSV']
  },
  {
    title: 'Placement Drive Summary',
    description: 'Summary of all placement drives conducted',
    formats: ['PDF']
  },
  {
    title: 'Student Application Report',
    description: 'All applications submitted by students',
    formats: ['CSV', 'Excel']
  },
];

export default function OfficerReports() {
  return (
    
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Download placement reports in various formats</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Total Reports</p>
              <p className="text-3xl font-bold text-indigo-600">{reports.length}</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Downloaded Today</p>
              <p className="text-3xl font-bold text-green-600">12</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Last Generated</p>
              <p className="text-sm font-medium text-gray-900 mt-2">March 10, 2026</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Auto-Refresh</p>
              <p className="text-sm font-medium text-gray-900 mt-2">Daily at 6 AM</p>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <div className="grid md:grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <Card key={index} className="border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Download as:</span>
                  {report.formats.map((format) => (
                    <Button
                      key={format}
                      size="sm"
                      variant="outline"
                      className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      {format}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom Report Builder */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Custom Report Builder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Generate custom reports with specific filters and parameters. Select criteria below:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-900 block mb-2">Report Type</label>
                  <select className="w-full p-2 border border-gray-200 rounded-lg">
                    <option>Placement Statistics</option>
                    <option>Student Data</option>
                    <option>Company Data</option>
                    <option>Drive Analytics</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900 block mb-2">Branch Filter</label>
                  <select className="w-full p-2 border border-gray-200 rounded-lg">
                    <option>All Branches</option>
                    <option>CSE</option>
                    <option>ECE</option>
                    <option>IT</option>
                    <option>MECH</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900 block mb-2">Date Range</label>
                  <select className="w-full p-2 border border-gray-200 rounded-lg">
                    <option>Current Year</option>
                    <option>Last 6 Months</option>
                    <option>Last 3 Months</option>
                    <option>Custom Range</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline">
                  Preview
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Downloads */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Recent Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Overall_Placement_Report_2024.pdf</p>
                    <p className="text-xs text-gray-500">Downloaded 2 hours ago</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Branch_Wise_Report_CSE.csv</p>
                    <p className="text-xs text-gray-500">Downloaded yesterday</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Student_Placement_List.xlsx</p>
                    <p className="text-xs text-gray-500">Downloaded 2 days ago</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
   
  );
}