"use client";
import { 
  LayoutDashboard, 
  TrendingUp, 
  FileText, 
  Settings,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import DashboardLayout from '../../dashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const branchWiseData = [
  { branch: 'CSE', total: 270, placed: 256, percentage: 95 },
  { branch: 'IT', total: 215, placed: 200, percentage: 93 },
  { branch: 'ECE', total: 200, placed: 180, percentage: 90 },
  { branch: 'EEE', total: 140, placed: 120, percentage: 86 },
  { branch: 'MECH', total: 180, placed: 149, percentage: 83 },
  { branch: 'CIVIL', total: 170, placed: 139, percentage: 82 },
];

const companyWiseData = [
  { company: 'TCS', studentsHired: 180, avgPackage: '7.2 LPA', highestPackage: '12 LPA' },
  { company: 'Infosys', studentsHired: 150, avgPackage: '6.8 LPA', highestPackage: '10 LPA' },
  { company: 'Wipro', studentsHired: 120, avgPackage: '6.5 LPA', highestPackage: '9 LPA' },
  { company: 'Accenture', studentsHired: 100, avgPackage: '6.2 LPA', highestPackage: '8.5 LPA' },
  { company: 'Cognizant', studentsHired: 85, avgPackage: '5.8 LPA', highestPackage: '7.5 LPA' },
];

const internshipData = [
  { company: 'Google', students: 12, stipend: '₹80,000/month', duration: '3 months' },
  { company: 'Microsoft', students: 10, stipend: '₹75,000/month', duration: '3 months' },
  { company: 'Amazon', students: 15, stipend: '₹60,000/month', duration: '2 months' },
  { company: 'Adobe', students: 8, stipend: '₹70,000/month', duration: '3 months' },
];

export default function ManagementReports() {
  return (
    
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Reports Dashboard</h1>
            <p className="text-gray-600 mt-1">Download and preview placement reports</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">Total Students</div>
              <div className="text-2xl font-bold text-gray-900">1,175</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">Students Placed</div>
              <div className="text-2xl font-bold text-green-600">1,044</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">Placement Rate</div>
              <div className="text-2xl font-bold text-indigo-600">88.8%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">Avg Package</div>
              <div className="text-2xl font-bold text-purple-600">6.8 LPA</div>
            </CardContent>
          </Card>
        </div>

        {/* Branch-wise Placement Report */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Branch-wise Placement Report</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Branch</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Total Students</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Placed</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Unplaced</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Placement %</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {branchWiseData.map((branch) => (
                    <tr key={branch.branch} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{branch.branch}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{branch.total}</td>
                      <td className="py-3 px-4 text-sm text-green-600 font-medium">{branch.placed}</td>
                      <td className="py-3 px-4 text-sm text-orange-600 font-medium">{branch.total - branch.placed}</td>
                      <td className="py-3 px-4 text-sm text-indigo-600 font-semibold">{branch.percentage}%</td>
                      <td className="py-3 px-4">
                        <Badge className={
                          branch.percentage >= 90 
                            ? 'bg-green-100 text-green-700' 
                            : branch.percentage >= 85 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-orange-100 text-orange-700'
                        }>
                          {branch.percentage >= 90 ? 'Excellent' : branch.percentage >= 85 ? 'Good' : 'Average'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Company-wise Placement Report */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Company-wise Placement Report</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Company</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Students Hired</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Avg Package</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Highest Package</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {companyWiseData.map((company, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{company.company}</td>
                      <td className="py-3 px-4 text-sm text-indigo-600 font-medium">{company.studentsHired}</td>
                      <td className="py-3 px-4 text-sm text-green-600 font-medium">{company.avgPackage}</td>
                      <td className="py-3 px-4 text-sm text-purple-600 font-medium">{company.highestPackage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Internship Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Internship Reports</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Company</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Students</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Stipend</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {internshipData.map((intern, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{intern.company}</td>
                      <td className="py-3 px-4 text-sm text-indigo-600 font-medium">{intern.students}</td>
                      <td className="py-3 px-4 text-sm text-green-600 font-medium">{intern.stipend}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{intern.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Current Year Placement Report Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Year Placement Report (2025-26)</CardTitle>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Download className="w-4 h-4 mr-2" />
                Download Complete Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm text-indigo-600 mb-1">Total Companies Visited</p>
                <p className="text-2xl font-bold text-indigo-900">48</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 mb-1">Highest Package Offered</p>
                <p className="text-2xl font-bold text-green-900">32 LPA</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600 mb-1">Average Package</p>
                <p className="text-2xl font-bold text-purple-900">6.8 LPA</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    
  );
}
