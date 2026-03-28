"use client";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Award, 
  Bell, 
  FileText, 
  Settings,
  Download,
  Eye,
  Upload
} from 'lucide-react';
import DashboardLayout from '../../dashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';



const ongoingDrives = [
  {
    company: 'Google',
    role: 'Software Engineer',
    currentRound: 'Technical Interview',
    studentsApplied: 145,
    driveDate: 'March 12-15, 2026',
  },
  {
    company: 'Amazon',
    role: 'SDE-1',
    currentRound: 'Coding Test',
    studentsApplied: 167,
    driveDate: 'March 13-16, 2026',
  },
  {
    company: 'Microsoft',
    role: 'SDE-2',
    currentRound: 'HR Round',
    studentsApplied: 128,
    driveDate: 'March 11-14, 2026',
  },
];

const upcomingDrives = [
  {
    company: 'TCS',
    role: 'Developer',
    eligibility: 'CGPA ≥ 6.0, No Active Backlogs',
    applicationDeadline: 'March 18, 2026',
  },
  {
    company: 'Infosys',
    role: 'Systems Engineer',
    eligibility: 'CGPA ≥ 6.5, All Branches',
    applicationDeadline: 'March 20, 2026',
  },
  {
    company: 'Wipro',
    role: 'Project Engineer',
    eligibility: 'CGPA ≥ 6.0, CSE/IT/ECE',
    applicationDeadline: 'March 22, 2026',
  },
];

const completedDrives = [
  {
    company: 'Accenture',
    studentsSelected: 42,
    avgPackage: '6.5 LPA',
  },
  {
    company: 'Cognizant',
    studentsSelected: 38,
    avgPackage: '5.8 LPA',
  },
  {
    company: 'Capgemini',
    studentsSelected: 35,
    avgPackage: '6.2 LPA',
  },
  {
    company: 'HCL',
    studentsSelected: 45,
    avgPackage: '5.5 LPA',
  },
];

export default function PlacementDrives() {
  return (
    
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Placement Drives</h1>
          <p className="text-gray-600 mt-1">Manage ongoing, upcoming, and completed placement drives</p>
        </div>

        {/* Ongoing Drives */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>Ongoing Drives</CardTitle>
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Ongoing</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Company</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Current Round</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Students Applied</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Drive Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ongoingDrives.map((drive, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{drive.company}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{drive.role}</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-blue-100 text-blue-700">
                          {drive.currentRound}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">{drive.studentsApplied}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{drive.driveDate}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Upload className="w-4 h-4 mr-1" />
                            Upload
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Drives */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>Upcoming Drives</CardTitle>
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Upcoming</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Company</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Eligibility Criteria</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Application Deadline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {upcomingDrives.map((drive, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{drive.company}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{drive.role}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{drive.eligibility}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">{drive.applicationDeadline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Completed Drives */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>Completed Drives</CardTitle>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Company</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Students Selected</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Average Package</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {completedDrives.map((drive, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{drive.company}</td>
                      <td className="py-3 px-4 text-sm text-green-600 font-medium">{drive.studentsSelected}</td>
                      <td className="py-3 px-4 text-sm text-indigo-600 font-medium">{drive.avgPackage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
   
  );
}
