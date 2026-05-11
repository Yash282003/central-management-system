"use client";
import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';



function downloadCSV(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

const reports = [
  {
    title: 'Overall Placement Report',
    description: 'Complete placement statistics for all branches',
    formats: ['CSV'],
    csvUrl: '/api/tnp/reports/csv?type=placed',
    csvFile: 'placed_students.csv',
  },
  {
    title: 'All Students Report',
    description: 'Full student list with branch, CGPA, and status',
    formats: ['CSV'],
    csvUrl: '/api/tnp/reports/csv?type=all',
    csvFile: 'all_students.csv',
  },
  {
    title: 'Company-wise Hiring Report',
    description: 'All registered placement drives with package and eligibility',
    formats: ['CSV'],
    csvUrl: '/api/tnp/reports/csv?type=companies',
    csvFile: 'companies_report.csv',
  },
  {
    title: 'Student Placement List',
    description: 'List of all placed students with details',
    formats: ['PDF', 'CSV'],
    csvUrl: '/api/tnp/reports/csv?type=placed',
    csvFile: 'placed_students.csv',
  },
  {
    title: 'Unplaced Students Report',
    description: 'List of unplaced students for follow-up',
    formats: ['CSV'],
    csvUrl: '/api/tnp/reports/csv?type=all',
    csvFile: 'all_students.csv',
  },
  {
    title: 'Package Distribution Report',
    description: 'Analysis of salary packages offered',
    formats: ['CSV'],
    csvUrl: '/api/tnp/reports/csv?type=placed',
    csvFile: 'placed_students.csv',
  },
  {
    title: 'Placement Drive Summary',
    description: 'Summary of all placement drives conducted',
    formats: ['PDF', 'CSV'],
    csvUrl: '/api/tnp/reports/csv?type=companies',
    csvFile: 'companies_report.csv',
  },
  {
    title: 'Student Application Report',
    description: 'All applications submitted by students',
    formats: ['CSV'],
    csvUrl: '/api/tnp/reports/csv?type=all',
    csvFile: 'all_students.csv',
  },
];

const reportTypeMap: Record<string, string> = {
  "Placement Statistics": "placed",
  "Student Data": "all",
  "Company Data": "companies",
  "Drive Analytics": "companies",
};

export default function OfficerReports() {
  const [reportType, setReportType] = useState("Placement Statistics");
  const [branch, setBranch] = useState("All Branches");

  function handleGenerate() {
    const type = reportTypeMap[reportType] ?? "placed";
    const branchParam = branch !== "All Branches" ? `&branch=${branch}` : "";
    const url = `/api/tnp/reports/csv?type=${type}${branchParam}`;
    const filename = `${reportType.replace(/\s+/g, "_")}_${branch !== "All Branches" ? branch + "_" : ""}report.csv`;
    downloadCSV(url, filename);
  }

  return (
    
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Download placement reports in various formats</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Total Reports</p>
              <p className="text-3xl font-bold text-indigo-600">{reports.length}</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">CSV Formats</p>
              <p className="text-3xl font-bold text-green-600">{reports.filter(r => r.formats.includes('CSV')).length}</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Filters Available</p>
              <p className="text-sm font-medium text-gray-900 mt-2">Branch + Type</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Data Source</p>
              <p className="text-sm font-medium text-gray-900 mt-2">Live Database</p>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <div className="grid md:grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <Card key={index} className="border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Download as:</span>
                  {report.formats.map((format) => (
                    <Button
                      key={format}
                      size="sm"
                      variant="outline"
                      className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                      onClick={format === "CSV" && report.csvUrl ? () => downloadCSV(report.csvUrl!, report.csvFile!) : undefined}
                      disabled={format !== "CSV"}
                      title={format !== "CSV" ? "PDF export coming soon" : undefined}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      {format}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom Report Builder */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Custom Report Builder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Generate custom reports with specific filters and parameters. Select criteria below:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-900 block mb-2">Report Type</label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Placement Statistics">Placement Statistics</SelectItem>
                      <SelectItem value="Student Data">Student Data</SelectItem>
                      <SelectItem value="Company Data">Company Data</SelectItem>
                      <SelectItem value="Drive Analytics">Drive Analytics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900 block mb-2">Branch Filter</label>
                  <Select value={branch} onValueChange={setBranch}>
                    <SelectTrigger className="border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Branches">All Branches</SelectItem>
                      <SelectItem value="CSE">CSE</SelectItem>
                      <SelectItem value="ECE">ECE</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="MECH">MECH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900 block mb-2">Date Range</label>
                  <Select defaultValue="Current Year">
                    <SelectTrigger className="border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Current Year">Current Year</SelectItem>
                      <SelectItem value="Last 6 Months">Last 6 Months</SelectItem>
                      <SelectItem value="Last 3 Months">Last 3 Months</SelectItem>
                      <SelectItem value="Custom Range">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleGenerate}>
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline">
                  Preview
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
   
  );
}