"use client"
import { useState } from "react";
import { User, Mail, Phone, MapPin, Award, BookOpen, Pencil, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { currentUser, courses, publications } from "../../data/mockdata";

export default function TeacherProfile() {
  const user = currentUser.teacher;
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    phone: "+1 (555) 234-5678",
    office: "CS Building, Room 215",
    bio: "Specialist in Machine Learning and AI research with over 12 years of academic and industry experience.",
    designation: user.designation,
    department: user.department,
  });
  const [draft, setDraft] = useState(profile);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">My Profile</h1>
        <p className="text-gray-600">Manage your professional profile</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Avatar + Quick Info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="size-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
                {user.avatar}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{profile.name}</h2>
              <p className="text-sm text-blue-600 font-medium mb-2">{profile.designation}</p>
              <Badge variant="outline">{profile.department}</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="size-4 text-gray-400" />
                <span className="text-gray-700 break-all">{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="size-4 text-gray-400" />
                <span className="text-gray-700">{profile.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="size-4 text-gray-400" />
                <span className="text-gray-700">{profile.office}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">This Semester</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {courses.slice(0, 3).map(c => (
                  <div key={c.id} className="flex items-center gap-3">
                    <div className="size-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <BookOpen className="size-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.enrolled} students</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right — Edit Form + Publications */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                {!editing ? (
                  <button
                    onClick={() => { setDraft(profile); setEditing(true); }}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setProfile(draft); setEditing(false); }}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Check className="size-3.5" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <X className="size-3.5" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Full Name", key: "name" },
                  { label: "Email Address", key: "email" },
                  { label: "Phone", key: "phone" },
                  { label: "Office Location", key: "office" },
                  { label: "Designation", key: "designation" },
                  { label: "Department", key: "department" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
                    {editing ? (
                      <input
                        type="text"
                        value={draft[key as keyof typeof draft]}
                        onChange={e => setDraft(p => ({ ...p, [key]: e.target.value }))}
                        className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm py-2">{profile[key as keyof typeof profile]}</p>
                    )}
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Bio</label>
                  {editing ? (
                    <textarea
                      value={draft.bio}
                      onChange={e => setDraft(p => ({ ...p, bio: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                    />
                  ) : (
                    <p className="text-gray-700 text-sm leading-relaxed py-2">{profile.bio}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Publications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="size-5" />
                My Publications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {publications.slice(0, 3).map(pub => (
                  <div key={pub.id} className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-gray-900 text-sm mb-1">{pub.title}</h4>
                    <p className="text-xs text-gray-500 mb-2">{pub.authors}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-blue-600 font-medium">{pub.journal}</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-500">{pub.year}</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-500">{pub.citations} citations</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
