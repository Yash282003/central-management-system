"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getDetails } from "@/services/student/me/getDetails";

interface Student {
  _id: string;
  regdNo: string;
  branch: string;
  mobile: string;
  email: string;
  dob: string;
  address: string;
  profileUrl: string;
  cgpa?: number;
  status?: string;
  companyName?: string;
  package?: number;
  name: {
    first: string;
    middle: string;
    last: string;
  };
}

export default function StudentProfile() {
  const [user, setUser] = useState<Student | null>(null);

  const DEFAULT_SKILLS = ['React', 'Node.js', 'Python', 'Java', 'SQL'];
  const [skills, setSkills] = useState<string[]>([]);
  const [skillsLoaded, setSkillsLoaded] = useState(false);
  const [skillSaving, setSkillSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const res = await getDetails();
      if (res?.success) setUser(res.data);
    };
    loadData();

    fetch('/api/student/skills', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setSkills(d.data.length > 0 ? d.data : DEFAULT_SKILLS);
        } else {
          setSkills(DEFAULT_SKILLS);
        }
        setSkillsLoaded(true);
      })
      .catch(() => { setSkills(DEFAULT_SKILLS); setSkillsLoaded(true); });
  }, []);

  const saveSkills = async (updated: string[]) => {
    setSkillSaving(true);
    try {
      await fetch('/api/student/skills', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ skills: updated }),
      });
    } finally {
      setSkillSaving(false);
    }
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      const updated = [...skills, trimmed];
      setSkills(updated);
      setNewSkill('');
      saveSkills(updated);
    }
  };

  const removeSkill = (index: number) => {
    const updated = skills.filter((_, i) => i !== index);
    setSkills(updated);
    saveSkills(updated);
  };

  // ✅ Loading state
  if (!user) {
    return <div className="p-6">Loading...</div>;
  }

  const fullName = `${user.name.first} ${user.name.middle} ${user.name.last}`.trim();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal and academic information</p>
        </div>
        {user.status === 'PLACED' ? (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-800">
                Placed{user.companyName ? ` at ${user.companyName}` : ''}
              </p>
              {user.package ? (
                <p className="text-xs text-green-600">{user.package} LPA</p>
              ) : null}
            </div>
          </div>
        ) : user.status === 'INELIGIBLE' ? (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm font-semibold text-red-700">Ineligible</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
            <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <p className="text-sm font-semibold text-blue-700">Placement in Progress</p>
          </div>
        )}
      </div>

      <Tabs defaultValue="personal" className="w-full">
          <TabsList className="flex w-full bg-gray-100 p-1 rounded-full mb-6">
    
    <TabsTrigger
      value="personal"
      className="flex-1 rounded-full px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition"
    >
      Personal Info
    </TabsTrigger>

    <TabsTrigger
      value="academic"
      className="flex-1 rounded-full px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition"
    >
      Academic
    </TabsTrigger>

    <TabsTrigger
      value="professional"
      className="flex-1 rounded-full px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition"
    >
      Professional
    </TabsTrigger>

    <TabsTrigger
      value="documents"
      className="flex-1 rounded-full px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition"
    >
      Documents
    </TabsTrigger>

  </TabsList>

        {/* ✅ PERSONAL INFO (UPDATED) */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>

            <CardContent>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">

                  <div>
                    <Label>Full Name</Label>
                    <Input value={fullName} readOnly className="mt-1" />
                  </div>

                  <div>
                    <Label>Registration Number</Label>
                    <Input value={user.regdNo} disabled className="mt-1 bg-gray-50" />
                  </div>

                  <div>
                    <Label>Branch</Label>
                    <Input value={user.branch} readOnly className="mt-1" />
                  </div>

                  <div>
                    <Label>Phone Number</Label>
                    <Input value={user.mobile} className="mt-1" />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={user.email} className="mt-1" />
                  </div>

                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={user.dob.split("T")[0]}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Address</Label>
                  <Textarea
                    value={user.address}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic */}
        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>CGPA</Label>
                    <Input
                      className="mt-1"
                      value={user.cgpa ?? ''}
                      readOnly
                      placeholder="—"
                    />
                  </div>
                  <div>
                    <Label>Branch</Label>
                    <Input className="mt-1" value={user.branch} readOnly />
                  </div>
                  <div>
                    <Label>Placement Status</Label>
                    <Input
                      className="mt-1"
                      value={
                        user.status === 'PLACED'
                          ? `Placed${user.companyName ? ` at ${user.companyName}` : ''}`
                          : user.status === 'INELIGIBLE'
                          ? 'Ineligible'
                          : 'Unplaced'
                      }
                      readOnly
                    />
                  </div>
                  {user.status === 'PLACED' && user.package ? (
                    <div>
                      <Label>Package (LPA)</Label>
                      <Input className="mt-1" value={user.package} readOnly />
                    </div>
                  ) : null}
                </div>
                <p className="text-xs text-gray-500">Academic details are managed by the TnP office. Contact them to make changes.</p>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Professional */}
        <TabsContent value="professional">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Skills</CardTitle>
                {skillSaving && <span className="text-xs text-gray-400">Saving…</span>}
                {!skillSaving && skillsLoaded && <span className="text-xs text-gray-400">Auto-saved</span>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 min-h-[2rem]">
                {skills.map((skill, index) => (
                  <Badge key={index} className="bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 pr-1">
                    {skill}
                    <button
                      onClick={() => removeSkill(index)}
                      className="ml-1.5 hover:text-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {skills.length === 0 && skillsLoaded && (
                  <p className="text-xs text-gray-400">No skills added yet.</p>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  placeholder="e.g. TypeScript, Docker, AWS…"
                />
                <Button onClick={addSkill} className="bg-indigo-600 hover:bg-indigo-700 text-white">Add</Button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Press Enter or click Add. Changes are saved automatically.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-dashed border p-8 text-center">
                <Upload className="mx-auto mb-2" />
                Upload Files
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}