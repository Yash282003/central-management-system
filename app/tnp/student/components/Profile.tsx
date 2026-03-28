"use client"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  LayoutDashboard, 
  User, 
  Building2, 
  FileText, 
  Bell, 
  Award, 
  Settings,
  Upload,
  X
} from 'lucide-react';
import { useState } from 'react';


export default function StudentProfile() {
  const [skills, setSkills] = useState(['React', 'Node.js', 'Python', 'Java', 'SQL']);
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
   
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal and academic information</p>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" defaultValue="John Doe" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="regNo">Registration Number</Label>
                      <Input id="regNo" defaultValue="2021CS001" disabled className="mt-1 bg-gray-50" />
                    </div>
                    <div>
                      <Label htmlFor="branch">Branch</Label>
                      <Input id="branch" defaultValue="Computer Science" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue="+91 9876543210" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john.doe@student.edu" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" type="date" defaultValue="2003-05-15" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea 
                      id="address" 
                      defaultValue="123 Main Street, City, State - 123456" 
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

          {/* Academic Information */}
          <TabsContent value="academic">
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="tenth">10th Percentage</Label>
                      <Input id="tenth" type="number" defaultValue="92.5" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="twelfth">12th / Diploma Percentage</Label>
                      <Input id="twelfth" type="number" defaultValue="88.7" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="cgpa">Current CGPA</Label>
                      <Input id="cgpa" type="number" step="0.01" defaultValue="8.45" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="backlogs">Active Backlogs</Label>
                      <Input id="backlogs" type="number" defaultValue="0" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="yearOfPassing">Year of Passing</Label>
                      <Input id="yearOfPassing" defaultValue="2025" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="semester">Current Semester</Label>
                      <Input id="semester" defaultValue="7" className="mt-1" />
                    </div>
                  </div>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Information */}
          <TabsContent value="professional">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 px-3 py-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="ml-2 hover:text-indigo-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={addSkill} className="bg-indigo-600 hover:bg-indigo-700">
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Internships</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" placeholder="Company name" className="mt-1" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" placeholder="Intern role" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input id="duration" placeholder="e.g., 3 months" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Describe your work" className="mt-1" rows={3} />
                  </div>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Add Internship
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Coding Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input id="linkedin" placeholder="https://linkedin.com/in/..." className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="github">GitHub</Label>
                    <Input id="github" placeholder="https://github.com/..." className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="leetcode">LeetCode</Label>
                    <Input id="leetcode" placeholder="https://leetcode.com/..." className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="codechef">CodeChef</Label>
                    <Input id="codechef" placeholder="https://codechef.com/users/..." className="mt-1" />
                  </div>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Save Profiles
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents */}
          <TabsContent value="documents">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Passport Photo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">JPG, PNG (max 2MB)</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resume / CV</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF (max 5MB)</p>
                  </div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Current: <span className="font-medium">resume_john_doe.pdf</span></p>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Document
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Certificates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG (max 10MB)</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                      <span className="text-sm text-gray-900">10th_marksheet.pdf</span>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                      <span className="text-sm text-gray-900">12th_marksheet.pdf</span>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Achievements & Positions of Responsibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="achievement">Achievement / Position</Label>
                      <Input id="achievement" placeholder="e.g., Class Representative" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="achievementDesc">Description</Label>
                      <Textarea 
                        id="achievementDesc" 
                        placeholder="Describe your achievement or role" 
                        className="mt-1" 
                        rows={3}
                      />
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      Add Achievement
                    </Button>
                  </form>
                  <div className="mt-6 space-y-2">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900">Technical Club Coordinator</h4>
                      <p className="text-sm text-gray-600 mt-1">Led a team of 20 students in organizing technical workshops and coding competitions.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

  );
}
