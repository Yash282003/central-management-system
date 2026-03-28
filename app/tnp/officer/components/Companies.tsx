"use client";
import { useState } from 'react';

import { 
  Users, 
  Building2, 
  LayoutDashboard, 
  Bell, 
  FileText, 
  Settings,
  Search,
  Plus,
  Calendar,
  Award
} from 'lucide-react';
import DashboardLayout from '../../dashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { label: 'Dashboard', path: '/officer', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Students', path: '/officer/students', icon: <Users className="w-5 h-5" /> },
  { label: 'Companies', path: '/officer/companies', icon: <Building2 className="w-5 h-5" /> },
  { label: 'Placement Drives', path: '/officer/drives', icon: <Award className="w-5 h-5" /> },
  { label: 'Notifications', path: '/officer/notifications', icon: <Bell className="w-5 h-5" /> },
  { label: 'Reports', path: '/officer/reports', icon: <FileText className="w-5 h-5" /> },
  { label: 'Settings', path: '/officer/settings', icon: <Settings className="w-5 h-5" /> },
];

const companies = [
  {
    name: 'Google',
    role: 'Software Engineer',
    package: '28 LPA',
    eligibility: 'CGPA ≥ 8.0',
    branches: ['CSE', 'ECE'],
    driveDate: 'March 25, 2026',
    type: 'Dream',
    registered: 45,
    eligible: 120
  },
  {
    name: 'Microsoft',
    role: 'SDE',
    package: '26 LPA',
    eligibility: 'CGPA ≥ 7.5',
    branches: ['CSE', 'ECE', 'IT'],
    driveDate: 'March 28, 2026',
    type: 'Dream',
    registered: 67,
    eligible: 180
  },
  {
    name: 'Amazon',
    role: 'SDE-1',
    package: '24 LPA',
    eligibility: 'CGPA ≥ 7.0',
    branches: ['CSE', 'ECE', 'IT'],
    driveDate: 'April 2, 2026',
    type: 'Dream',
    registered: 89,
    eligible: 250
  },
  {
    name: 'TCS Ninja',
    role: 'Developer',
    package: '7 LPA',
    eligibility: 'CGPA ≥ 6.0',
    branches: ['All'],
    driveDate: 'April 5, 2026',
    type: 'Regular',
    registered: 450,
    eligible: 800
  },
  {
    name: 'Infosys',
    role: 'System Engineer',
    package: '6.5 LPA',
    eligibility: 'CGPA ≥ 6.5',
    branches: ['All'],
    driveDate: 'April 8, 2026',
    type: 'Regular',
    registered: 380,
    eligible: 650
  },
  {
    name: 'Adobe',
    role: 'Software Engineer',
    package: '32 LPA',
    eligibility: 'CGPA ≥ 8.5',
    branches: ['CSE', 'IT'],
    driveDate: 'April 10, 2026',
    type: 'Special',
    registered: 28,
    eligible: 45
  },
];

export default function OfficerCompanies() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Company Management</h1>
            <p className="text-gray-600 mt-1">Manage companies and placement drives</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Company
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="search"
                placeholder="Search companies..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Companies Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredCompanies.map((company) => (
            <Card key={company.name} className="border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{company.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{company.role}</p>
                  </div>
                  <Badge className={
                    company.type === 'Dream' 
                      ? 'bg-purple-100 text-purple-700' 
                      : company.type === 'Special'
                      ? 'bg-pink-100 text-pink-700'
                      : 'bg-blue-100 text-blue-700'
                  }>
                    {company.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Package</p>
                    <p className="text-lg font-semibold text-green-600">{company.package}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Eligibility</p>
                    <p className="text-sm font-medium text-gray-900">{company.eligibility}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Eligible Branches</p>
                  <div className="flex flex-wrap gap-2">
                    {company.branches.map((branch) => (
                      <Badge key={branch} variant="outline" className="text-xs">
                        {branch}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t border-gray-200">
                  <Calendar className="w-4 h-4" />
                  <span>Drive Date: <span className="font-medium text-gray-900">{company.driveDate}</span></span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                  <div className="text-center p-3 bg-indigo-50 rounded-lg">
                    <p className="text-2xl font-bold text-indigo-600">{company.registered}</p>
                    <p className="text-xs text-gray-600 mt-1">Registered</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{company.eligible}</p>
                    <p className="text-xs text-gray-600 mt-1">Eligible</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Send Notice
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Company Tags Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Company Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Dream</p>
                  <p className="text-xs text-gray-600">Package &gt; 20 LPA</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Regular</p>
                  <p className="text-xs text-gray-600">Package 5-20 LPA</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Special</p>
                  <p className="text-xs text-gray-600">Exclusive drives</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Occasional</p>
                  <p className="text-xs text-gray-600">Walk-in drives</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    
  );
}