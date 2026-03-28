"use client";
import { useState } from 'react';

import { 
  Users, 
  Building2, 
  LayoutDashboard, 
  Bell, 
  FileText, 
  Settings,
  Send,
  Award
} from 'lucide-react';
import DashboardLayout from '../../dashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';



const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'];

export default function OfficerNotifications() {
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [participationForm, setParticipationForm] = useState({
    title: '',
    description: '',
    expirationDate: '',
    expirationTime: '',
    branches: [] as string[],
  });

  const toggleBranch = (branch: string) => {
    setSelectedBranches(prev =>
      prev.includes(branch)
        ? prev.filter(b => b !== branch)
        : [...prev, branch]
    );
  };

  const toggleParticipationBranch = (branch: string) => {
    setParticipationForm(prev => ({
      ...prev,
      branches: prev.branches.includes(branch)
        ? prev.branches.filter(b => b !== branch)
        : [...prev.branches, branch]
    }));
  };

  return (
    
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notifications & Announcements</h1>
          <p className="text-gray-600 mt-1">Send announcements and participation requests to students</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* General Announcement */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Send Announcement</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="ann-title">Title</Label>
                  <Input id="ann-title" placeholder="Announcement title" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="ann-message">Message</Label>
                  <Textarea 
                    id="ann-message" 
                    placeholder="Write your announcement message..." 
                    className="mt-1" 
                    rows={4}
                  />
                </div>

                <div>
                  <Label className="mb-3 block">Target Audience</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="all-students" />
                      <label htmlFor="all-students" className="text-sm">All Students</label>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <p className="text-sm text-gray-600 mb-2">Or select specific branches:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {branches.map((branch) => (
                          <div key={branch} className="flex items-center gap-2">
                            <Checkbox 
                              id={`ann-${branch}`}
                              checked={selectedBranches.includes(branch)}
                              onCheckedChange={() => toggleBranch(branch)}
                            />
                            <label htmlFor={`ann-${branch}`} className="text-sm">{branch}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="ann-attachment">Attachments (Optional)</Label>
                  <Input 
                    id="ann-attachment" 
                    type="file" 
                    className="mt-1"
                    accept=".pdf,.doc,.docx"
                  />
                </div>

                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <Send className="w-4 h-4 mr-2" />
                  Send Announcement
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Participation Message */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Participation Request</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="part-title">Drive Title</Label>
                  <Input 
                    id="part-title" 
                    placeholder="e.g., Google Placement Drive" 
                    className="mt-1"
                    value={participationForm.title}
                    onChange={(e) => setParticipationForm({ ...participationForm, title: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="part-description">Description</Label>
                  <Textarea 
                    id="part-description" 
                    placeholder="Drive details, eligibility, etc..." 
                    className="mt-1" 
                    rows={4}
                    value={participationForm.description}
                    onChange={(e) => setParticipationForm({ ...participationForm, description: e.target.value })}
                  />
                </div>

                <div>
                  <Label className="mb-3 block">Eligible Branches</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {branches.map((branch) => (
                      <div key={branch} className="flex items-center gap-2">
                        <Checkbox 
                          id={`part-${branch}`}
                          checked={participationForm.branches.includes(branch)}
                          onCheckedChange={() => toggleParticipationBranch(branch)}
                        />
                        <label htmlFor={`part-${branch}`} className="text-sm">{branch}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exp-date">Expiration Date</Label>
                    <Input 
                      id="exp-date" 
                      type="date" 
                      className="mt-1"
                      value={participationForm.expirationDate}
                      onChange={(e) => setParticipationForm({ ...participationForm, expirationDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="exp-time">Expiration Time</Label>
                    <Input 
                      id="exp-time" 
                      type="time" 
                      className="mt-1"
                      value={participationForm.expirationTime}
                      onChange={(e) => setParticipationForm({ ...participationForm, expirationTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    Students will be able to respond with YES or NO. After expiration, you can download 
                    the CSV list of participants.
                  </p>
                </div>

                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <Send className="w-4 h-4 mr-2" />
                  Send Participation Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sent Notifications History */}
        <Card>
          <CardHeader>
            <CardTitle>Sent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Google Recruitment Drive</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Registration open for Google placement drive...
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">March 8, 2026</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Sent to: CSE, ECE</span>
                  <span>•</span>
                  <span>45 responses (YES: 38, NO: 7)</span>
                  <Button size="sm" variant="outline" className="ml-auto">
                    Download CSV
                  </Button>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Profile Completion Reminder</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Students must complete profiles before March 12...
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">March 7, 2026</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Sent to: All Students</span>
                  <span>•</span>
                  <span>1,247 recipients</span>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Microsoft Campus Drive</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Registration is now open for Microsoft...
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">March 6, 2026</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Sent to: CSE, IT, ECE</span>
                  <span>•</span>
                  <span>67 responses (YES: 58, NO: 9)</span>
                  <Button size="sm" variant="outline" className="ml-auto">
                    Download CSV
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    
  );
}