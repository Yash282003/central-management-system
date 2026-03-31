"use client"
import { useState } from "react";
import { Search, Users, Plus, Pencil, Trash2, Mail, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { facultyMembers } from "../../data/mockdata";

export default function AdminMembers() {
  const [members, setMembers] = useState(facultyMembers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<typeof facultyMembers[0] | null>(null);
  const [showModal, setShowModal] = useState(false);

  const designations = [...new Set(facultyMembers.map(f => f.designation))];

  const filtered = members.filter(m => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.specialization.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || m.designation === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Faculty Management</h1>
          <p className="text-gray-600">{members.length} faculty members in the department</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus className="size-4" />
          Add Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Faculty", value: members.length },
          { label: "Professors", value: members.filter(m => m.designation === "Professor").length },
          { label: "Avg Experience", value: `${Math.round(members.reduce((a, m) => a + m.experience, 0) / members.length)}y` },
        ].map(item => (
          <Card key={item.label}>
            <CardContent className="p-5 text-center">
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-sm text-gray-500 mt-1">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search faculty..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 h-10 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "all" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}>All</button>
          {designations.map(d => (
            <button key={d} onClick={() => setFilter(d)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === d ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}>{d.replace("Associate ", "Assoc. ")}</button>
          ))}
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(member => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="size-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                  {member.name.split(" ").filter(w => w !== "Dr.").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">{member.name}</h3>
                    <div className="flex gap-1 flex-shrink-0">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={() => setMembers(prev => prev.filter(m => m.id !== member.id))}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 font-medium mb-2">{member.designation}</p>
                  <p className="text-xs text-gray-500 mb-3">{member.specialization}</p>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">{member.experience}y experience</Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Mail className="size-3" />
                      <span className="truncate">{member.email.split("@")[0]}@...</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Member Modal (stub) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add Faculty Member</h2>
            <div className="space-y-4">
              {[
                { label: "Full Name", placeholder: "Dr. Jane Smith" },
                { label: "Email", placeholder: "jane.smith@university.edu" },
                { label: "Specialization", placeholder: "e.g. Machine Learning" },
              ].map(field => (
                <div key={field.label}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input type="text" placeholder={field.placeholder} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <select className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500">
                  <option>Professor</option>
                  <option>Associate Professor</option>
                  <option>Assistant Professor</option>
                  <option>Lecturer</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Add Member</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
