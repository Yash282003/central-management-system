"use client"
import { 
  LayoutDashboard, 
  User, 
  Building2, 
  FileText, 
  Bell, 
  Award, 
  Settings,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '../../dashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const applications = [
  {
    company: 'Google',
    role: 'Software Engineer',
    package: '28 LPA',
    appliedDate: 'Feb 28, 2026',
    status: 'Shortlisted',
    statusColor: 'bg-blue-100 text-blue-700',
    icon: AlertCircle,
    iconColor: 'text-blue-600',
    nextRound: 'Technical Interview - March 20, 2026'
  },
  {
    company: 'Microsoft',
    role: 'SDE',
    package: '26 LPA',
    appliedDate: 'March 1, 2026',
    status: 'Applied',
    statusColor: 'bg-gray-100 text-gray-700',
    icon: Clock,
    iconColor: 'text-gray-600',
    nextRound: 'Waiting for response'
  },
  {
    company: 'Amazon',
    role: 'SDE-1',
    package: '24 LPA',
    appliedDate: 'March 2, 2026',
    status: 'Rejected',
    statusColor: 'bg-red-100 text-red-700',
    icon: XCircle,
    iconColor: 'text-red-600',
    nextRound: 'Application not selected'
  },
  {
    company: 'TCS',
    role: 'Developer',
    package: '7 LPA',
    appliedDate: 'March 3, 2026',
    status: 'Selected',
    statusColor: 'bg-green-100 text-green-700',
    icon: CheckCircle2,
    iconColor: 'text-green-600',
    nextRound: 'Offer letter sent'
  },
  {
    company: 'Infosys',
    role: 'System Engineer',
    package: '6.5 LPA',
    appliedDate: 'March 5, 2026',
    status: 'Shortlisted',
    statusColor: 'bg-blue-100 text-blue-700',
    icon: AlertCircle,
    iconColor: 'text-blue-600',
    nextRound: 'Aptitude Test - March 18, 2026'
  },
  {
    company: 'Wipro',
    role: 'Project Engineer',
    package: '6 LPA',
    appliedDate: 'March 6, 2026',
    status: 'Applied',
    statusColor: 'bg-gray-100 text-gray-700',
    icon: Clock,
    iconColor: 'text-gray-600',
    nextRound: 'Under review'
  },
];

const stats = [
  { label: 'Total Applications', value: '6', color: 'bg-indigo-50 text-indigo-600' },
  { label: 'Shortlisted', value: '2', color: 'bg-blue-50 text-blue-600' },
  { label: 'Selected', value: '1', color: 'bg-green-50 text-green-600' },
  { label: 'Rejected', value: '1', color: 'bg-red-50 text-red-600' },
];

export default function StudentApplications() {
  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-1">Track your placement application status</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-gray-200">
              <CardContent className="p-6">
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.company} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${app.statusColor.split(' ')[0].replace('text', 'bg')}/10`}>
                      <app.icon className={`w-6 h-6 ${app.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{app.company}</h3>
                        <Badge className={app.statusColor}>
                          {app.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{app.role}</p>
                      <p className="text-sm font-medium text-green-600 mb-2">{app.package}</p>
                      <div className="flex flex-col gap-1 text-sm text-gray-500">
                        <span>Applied: {app.appliedDate}</span>
                        <span className="font-medium text-gray-700">{app.nextRound}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {app.status === 'Applied' && (
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                        Withdraw
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Application Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Application Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <div className="w-0.5 h-full bg-gray-200"></div>
                </div>
                <div className="flex-1 pb-6">
                  <p className="font-medium text-gray-900">Selected at TCS</p>
                  <p className="text-sm text-gray-600">March 8, 2026</p>
                  <p className="text-sm text-gray-500 mt-1">Offer letter received. Package: 7 LPA</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div className="w-0.5 h-full bg-gray-200"></div>
                </div>
                <div className="flex-1 pb-6">
                  <p className="font-medium text-gray-900">Shortlisted at Google</p>
                  <p className="text-sm text-gray-600">March 5, 2026</p>
                  <p className="text-sm text-gray-500 mt-1">Technical interview scheduled for March 20</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Rejected at Amazon</p>
                  <p className="text-sm text-gray-600">March 4, 2026</p>
                  <p className="text-sm text-gray-500 mt-1">Application not selected after aptitude test</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

  );
}
