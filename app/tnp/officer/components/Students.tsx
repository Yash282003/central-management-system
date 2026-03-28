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
  Filter,
  MoreVertical,
  Eye,
  CheckCircle2,
  XCircle,
  Ban,
  Award
} from 'lucide-react';
import DashboardLayout from '../../dashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const students = [
  { 
    name: 'Rahul Kumar', 
    regNo: '2021CS001', 
    branch: 'CSE', 
    cgpa: 8.95, 
    status: 'Placed',
    company: 'Google',
    package: '28 LPA'
  },
  { 
    name: 'Priya Sharma', 
    regNo: '2021CS045', 
    branch: 'CSE', 
    cgpa: 8.67, 
    status: 'Placed',
    company: 'Microsoft',
    package: '26 LPA'
  },
  { 
    name: 'Amit Verma', 
    regNo: '2021EC089', 
    branch: 'ECE', 
    cgpa: 7.85, 
    status: 'Unplaced',
    company: '-',
    package: '-'
  },
  { 
    name: 'Sneha Patel', 
    regNo: '2021CS078', 
    branch: 'CSE', 
    cgpa: 9.12, 
    status: 'Placed',
    company: 'Amazon',
    package: '24 LPA'
  },
  { 
    name: 'Vikram Singh', 
    regNo: '2021ME034', 
    branch: 'MECH', 
    cgpa: 7.45, 
    status: 'Unplaced',
    company: '-',
    package: '-'
  },
  { 
    name: 'Anjali Rao', 
    regNo: '2021IT056', 
    branch: 'IT', 
    cgpa: 8.34, 
    status: 'Placed',
    company: 'TCS',
    package: '7 LPA'
  },
  { 
    name: 'Karan Mehta', 
    regNo: '2021CS092', 
    branch: 'CSE', 
    cgpa: 8.21, 
    status: 'Ineligible',
    company: '-',
    package: '-'
  },
  { 
    name: 'Pooja Gupta', 
    regNo: '2021EC067', 
    branch: 'ECE', 
    cgpa: 8.78, 
    status: 'Placed',
    company: 'Infosys',
    package: '6.5 LPA'
  },
];

export default function OfficerStudents() {
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter(student => {
    const matchesBranch = branchFilter === 'all' || student.branch === branchFilter;
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.regNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesStatus && matchesSearch;
  });

  return (
    
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Student Management</h1>
          <p className="text-gray-600 mt-1">Manage student profiles and placement status</p>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="search"
                  placeholder="Search by name or registration number..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="ECE">ECE</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="MECH">MECH</SelectItem>
                  <SelectItem value="CIVIL">CIVIL</SelectItem>
                  <SelectItem value="EEE">EEE</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Placed">Placed</SelectItem>
                  <SelectItem value="Unplaced">Unplaced</SelectItem>
                  <SelectItem value="Ineligible">Ineligible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Reg No</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Branch</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">CGPA</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Company</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Package</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.regNo} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student.regNo}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student.branch}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{student.cgpa}</td>
                      <td className="px-6 py-4">
                        <Badge className={
                          student.status === 'Placed' 
                            ? 'bg-green-100 text-green-700' 
                            : student.status === 'Unplaced'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-red-100 text-red-700'
                        }>
                          {student.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{student.company}</td>
                      <td className="px-6 py-4 text-sm text-green-600 font-medium">{student.package}</td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                              Mark Placed
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <XCircle className="mr-2 h-4 w-4 text-orange-600" />
                              Mark Unplaced
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Ban className="mr-2 h-4 w-4 text-red-600" />
                              Mark Ineligible
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Total Students (Filtered)</p>
              <p className="text-3xl font-bold text-indigo-600">{filteredStudents.length}</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Placed</p>
              <p className="text-3xl font-bold text-green-600">
                {filteredStudents.filter(s => s.status === 'Placed').length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Unplaced</p>
              <p className="text-3xl font-bold text-orange-600">
                {filteredStudents.filter(s => s.status === 'Unplaced').length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
   
  );
}