"use client"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  LayoutDashboard, 
  User, 
  Building2, 
  FileText, 
  Bell, 
  Award, 
  Settings,
  Search,
  Filter
} from 'lucide-react';

const companies = [
  { 
    name: 'Google', 
    role: 'Software Engineer', 
    package: '28 LPA', 
    eligibility: 'CGPA ≥ 8.0',
    branches: ['CSE', 'ECE'],
    type: 'Dream',
    deadline: 'March 15, 2026'
  },
  { 
    name: 'Microsoft', 
    role: 'SDE', 
    package: '26 LPA', 
    eligibility: 'CGPA ≥ 7.5',
    branches: ['CSE', 'ECE', 'IT'],
    type: 'Dream',
    deadline: 'March 18, 2026'
  },
  { 
    name: 'Amazon', 
    role: 'SDE-1', 
    package: '24 LPA', 
    eligibility: 'CGPA ≥ 7.0',
    branches: ['CSE', 'ECE', 'IT'],
    type: 'Dream',
    deadline: 'March 20, 2026'
  },
  { 
    name: 'TCS Ninja', 
    role: 'Developer', 
    package: '7 LPA', 
    eligibility: 'CGPA ≥ 6.0',
    branches: ['All branches'],
    type: 'Regular',
    deadline: 'March 25, 2026'
  },
  { 
    name: 'Infosys', 
    role: 'System Engineer', 
    package: '6.5 LPA', 
    eligibility: 'CGPA ≥ 6.5',
    branches: ['All branches'],
    type: 'Regular',
    deadline: 'March 28, 2026'
  },
  { 
    name: 'Wipro', 
    role: 'Project Engineer', 
    package: '6 LPA', 
    eligibility: 'CGPA ≥ 6.0',
    branches: ['All branches'],
    type: 'Regular',
    deadline: 'March 30, 2026'
  },
];

export default function StudentCompanies() {
  return (
   
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Available Companies</h1>
          <p className="text-gray-600 mt-1">Browse and apply to placement opportunities</p>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="search"
                  placeholder="Search companies..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="md:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Companies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Card key={company.name} className="border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                    <p className="text-sm text-gray-600">{company.role}</p>
                  </div>
                  <Badge className={
                    company.type === 'Dream' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }>
                    {company.type}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Package</span>
                    <span className="text-sm font-semibold text-green-600">{company.package}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Eligibility</span>
                    <span className="text-sm font-medium text-gray-900">{company.eligibility}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 block mb-1">Eligible Branches</span>
                    <div className="flex flex-wrap gap-1">
                      {company.branches.map((branch) => (
                        <Badge key={branch} variant="outline" className="text-xs">
                          {branch}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-xs text-gray-500">Deadline</span>
                    <span className="text-xs font-medium text-red-600">{company.deadline}</span>
                  </div>
                </div>

                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
  
  );
}
