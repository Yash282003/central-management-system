"use client"
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  Clock,
  ThumbsUp,
  Heart,
  MessageSquare,
  Target,
  Code,
  BookOpen,
  FileCheck,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import TnpNoticesPanel from './TnpNoticesPanel';


const availableCompanies = [
  { name: 'Google', role: 'Software Engineer', package: '28 LPA', eligibility: 'CGPA ≥ 8.0' },
  { name: 'Microsoft', role: 'SDE', package: '26 LPA', eligibility: 'CGPA ≥ 7.5' },
  { name: 'Amazon', role: 'SDE-1', package: '24 LPA', eligibility: 'CGPA ≥ 7.0' },
  { name: 'TCS Ninja', role: 'Developer', package: '7 LPA', eligibility: 'CGPA ≥ 6.0' },
];

const appliedCompanies = [
  { name: 'Google', status: 'Shortlisted', color: 'bg-blue-100 text-blue-700' },
  { name: 'Microsoft', status: 'Applied', color: 'bg-gray-100 text-gray-700' },
  { name: 'Amazon', status: 'Rejected', color: 'bg-red-100 text-red-700' },
  { name: 'TCS', status: 'Selected', color: 'bg-green-100 text-green-700' },
];

const upcomingDrives = [
  { company: 'Infosys', date: 'March 15, 2026', eligibility: 'CGPA ≥ 6.5', status: 'Registered' },
  { company: 'Wipro', date: 'March 18, 2026', eligibility: 'CGPA ≥ 6.0', status: 'Not Registered' },
  { company: 'Accenture', date: 'March 22, 2026', eligibility: 'CGPA ≥ 7.0', status: 'Registered' },
];

const notifications = [
  { 
    id: 1,
    title: 'Google Recruitment Drive', 
    message: 'Registration open for Google placement drive. Last date: March 12, 2026',
    likes: 45,
    hearts: 23,
    comments: 8
  },
  { 
    id: 2,
    title: 'Important Announcement', 
    message: 'Students with pending profile completion must update by March 11, 2026',
    likes: 32,
    hearts: 15,
    comments: 5
  },
];

type StudentProfile = {
  status?: string;
  companyName?: string;
  package?: number;
  name?: { first: string; last: string };
};

export default function StudentDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    fetch('/api/student/me', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { if (d.success) setProfile(d.data); })
      .catch(() => {});
  }, []);

  const status = profile?.status ?? 'UNPLACED';
  const isPlaced = status === 'PLACED';
  const isIneligible = status === 'INELIGIBLE';

  return (

      <div className="space-y-6">
        <TnpNoticesPanel />

        {/* Placement Status Banner — driven by real profile data */}
        {isPlaced ? (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900">
                    Congratulations! You are placed{profile?.companyName ? ` at ${profile.companyName}` : ''}
                  </h3>
                  {profile?.package ? (
                    <p className="text-sm text-green-700">Package: {profile.package} LPA</p>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : isIneligible ? (
          <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900">You are currently marked as ineligible</h3>
                  <p className="text-sm text-red-700">Contact the TnP office for more information.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Your placement is in progress</h3>
                  <p className="text-sm text-blue-700">Browse companies and apply to open drives.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Profile Completion */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Profile Progress</span>
                    <span className="text-sm font-semibold text-indigo-600">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <p className="text-sm text-gray-600">
                  Complete your profile to unlock more opportunities
                </p>
                <Button onClick={()=>{router.push("/tnp/student/profile")}} className="bg-indigo-600 hover:bg-indigo-700">
                  Complete Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Placement Readiness Score */}
          <Card>
            <CardHeader>
              <CardTitle>Placement Readiness Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#4f46e5"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.78)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-indigo-600">78%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">CGPA</span>
                    </div>
                    <span className="font-medium text-green-600">Excellent</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Skills</span>
                    </div>
                    <span className="font-medium text-blue-600">Good</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-orange-600" />
                      <span className="text-gray-700">Projects</span>
                    </div>
                    <span className="font-medium text-orange-600">Average</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">Resume Quality</span>
                    </div>
                    <span className="font-medium text-green-600">Good</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-yellow-600" />
                      <span className="text-gray-700">Coding Practice</span>
                    </div>
                    <span className="font-medium text-yellow-600">Needs Work</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
                  💡 Improve your readiness by adding more projects or coding practice.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Companies */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Companies</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {availableCompanies.map((company) => (
              <Card key={company.name} className="border-gray-200 hover:border-indigo-300 transition-colors">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{company.name}</h3>
                      <p className="text-sm text-gray-600">{company.role}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      {company.package}
                    </Badge>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Eligibility:</span> {company.eligibility}
                    </p>
                  </div>
                  <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Applied Companies Status */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Applied Companies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {appliedCompanies.map((company) => (
              <Card key={company.name} className="border-gray-200">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">{company.name}</p>
                  <Badge className={company.color}>
                    {company.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Placement Drives */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Placement Drives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Company</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Drive Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Eligibility</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {upcomingDrives.map((drive, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{drive.company}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{drive.date}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{drive.eligibility}</td>
                      <td className="py-3 px-4">
                        <Badge className={drive.status === 'Registered' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'}>
                          {drive.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Feed */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications & Announcements</h2>
          <div className="space-y-4">
            {notifications.map((notif) => (
              <Card key={notif.id} className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{notif.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{notif.message}</p>
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{notif.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>{notif.hearts}</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      <span>{notif.comments}</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    
  );
}