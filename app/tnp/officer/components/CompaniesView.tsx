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
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import SendNoticeDialog from './SendNoticeDialog';
import AddCompanyDialog from './AddCompanyDialog';
import { useRouter } from 'next/navigation';

type Company = {
  _id: string;
  company: string;
  role: string;
  category: string;
  package: string;
  eligibility: { cgpa: number };
  eligibleBranches: string[];
  driveDate: string;
  registered: number;
  eligible: number;
};

type Props = {
  companies: Company[];
};

const categoryStyles: Record<string, string> = {
  Dream: 'bg-purple-100 text-purple-700',
  'Super Dream': 'bg-pink-100 text-pink-700',
  Core: 'bg-blue-100 text-blue-700',
  Mass: 'bg-green-100 text-green-700',
};

export default function CompaniesView({ companies }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [noticeCompany, setNoticeCompany] = useState<Company | null>(null);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const router = useRouter();

  const filteredCompanies = companies.filter(
    (c) =>
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Company Management</h1>
          <p className="text-gray-600 mt-1">Manage companies and placement drives</p>
        </div>
        <Button
          className="bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={() => setAddOpen(true)}
        >
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
      {filteredCompanies.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No companies found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredCompanies.map((company) => (
            <Card
              key={company._id}
              className="border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{company.company}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{company.role}</p>
                  </div>
                  <Badge className={categoryStyles[company.category] ?? 'bg-gray-100 text-gray-700'}>
                    {company.category}
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
                    <p className="text-sm text-gray-600">Min. CGPA</p>
                    <p className="text-sm font-medium text-gray-900">
                      CGPA ≥ {company.eligibility.cgpa}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Eligible Branches</p>
                  <div className="flex flex-wrap gap-2">
                    {company.eligibleBranches.map((branch) => (
                      <Badge key={branch} variant="outline" className="text-xs">
                        {branch}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t border-gray-200">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Drive Date:{' '}
                    <span className="font-medium text-gray-900">
                      {new Date(company.driveDate).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </span>
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
                  <Button className="flex-1 text-white bg-indigo-600 hover:bg-indigo-700" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setNoticeCompany(company);
                      setNoticeOpen(true);
                    }}
                  >
                    Send Notice
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Company Tags Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Company Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: 'Dream', color: 'bg-purple-500', desc: 'Package > 20 LPA' },
              { label: 'Super Dream', color: 'bg-pink-500', desc: 'Exclusive drives' },
              { label: 'Core', color: 'bg-blue-500', desc: 'Package 10–20 LPA' },
              { label: 'Mass', color: 'bg-green-500', desc: 'Walk-in / Mass drives' },
            ].map(({ label, color, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`w-3 h-3 ${color} rounded-full`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <SendNoticeDialog
        open={noticeOpen}
        onOpenChange={setNoticeOpen}
        company={noticeCompany}
      />

      <AddCompanyDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        mode="company"
        onCreated={() => router.refresh()}
      />
    </div>
  );
}
