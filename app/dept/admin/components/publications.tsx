"use client"
import { useState } from "react";
import { Award, Search, Plus, ExternalLink, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { publications } from "../../data/mockdata";

export default function AdminPublications() {
  const [pubList, setPubList] = useState(publications);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", authors: "", journal: "", year: new Date().getFullYear(), citations: 0 });

  const years = [...new Set(pubList.map(p => p.year))].sort((a, b) => b - a);

  const filtered = pubList.filter(p => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.authors.toLowerCase().includes(search.toLowerCase()) ||
      p.journal.toLowerCase().includes(search.toLowerCase());
    const matchYear = yearFilter === "all" || String(p.year) === yearFilter;
    return matchSearch && matchYear;
  });

  const handleCreate = () => {
    if (!form.title.trim()) return;
    setPubList(prev => [{ id: Date.now(), ...form }, ...prev]);
    setShowModal(false);
    setForm({ title: "", authors: "", journal: "", year: new Date().getFullYear(), citations: 0 });
  };

  const totalCitations = pubList.reduce((a, p) => a + p.citations, 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Publications</h1>
          <p className="text-gray-600">Track department research and publications</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus className="size-4" />
          Add Publication
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Publications", value: pubList.length },
          { label: "Total Citations", value: totalCitations },
          { label: "This Year", value: pubList.filter(p => p.year === new Date().getFullYear()).length },
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
            placeholder="Search publications..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 h-10 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setYearFilter("all")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${yearFilter === "all" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}>All Years</button>
          {years.map(y => (
            <button key={y} onClick={() => setYearFilter(String(y))} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${yearFilter === String(y) ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}>{y}</button>
          ))}
        </div>
      </div>

      {/* Publications List */}
      <div className="space-y-4">
        {filtered.map((pub, idx) => (
          <Card key={pub.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="size-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Award className="size-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 leading-tight">{pub.title}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className="text-xs">{pub.year}</Badge>
                      <span className="text-sm text-gray-500 font-medium whitespace-nowrap">{pub.citations} citations</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{pub.authors}</p>
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-3.5 text-blue-500" />
                    <span className="text-sm text-blue-600 font-medium">{pub.journal}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Award className="size-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No publications found</p>
          </div>
        )}
      </div>

      {/* Add Publication Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add Publication</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="Publication title..." className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Authors</label>
                <input type="text" value={form.authors} onChange={e => setForm(p => ({...p, authors: e.target.value}))} placeholder="Dr. Name1, Dr. Name2..." className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Journal / Conference</label>
                <input type="text" value={form.journal} onChange={e => setForm(p => ({...p, journal: e.target.value}))} placeholder="e.g. IEEE Transactions" className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input type="number" value={form.year} onChange={e => setForm(p => ({...p, year: Number(e.target.value)}))} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Citations</label>
                  <input type="number" value={form.citations} onChange={e => setForm(p => ({...p, citations: Number(e.target.value)}))} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreate} className="flex-1 h-10 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Add Publication</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
