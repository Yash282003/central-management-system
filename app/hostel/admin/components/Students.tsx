"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function AdminStudents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBranch, setFilterBranch] = useState("all");
  const [filterRoom, setFilterRoom] = useState("");
  const [filterFloor, setFilterFloor] = useState("all");

  const students = [
    {
      id: 1,
      name: "Rahul Sharma",
      regNo: "21BCE1234",
      room: "A-204",
      floor: "A",
      branch: "CSE",
      phone: "+91 98765 43210",
      email: "rahul@university.edu",
      role: "Student",
    },
    {
      id: 2,
      name: "Priya Singh",
      regNo: "21BCE1245",
      room: "B-305",
      floor: "B",
      branch: "ECE",
      phone: "+91 98765 43211",
      email: "priya@university.edu",
      role: "Floor Representative",
    },
    {
      id: 3,
      name: "Amit Patel",
      regNo: "21BCE1256",
      room: "C-102",
      floor: "C",
      branch: "CSE",
      phone: "+91 98765 43212",
      email: "amit@university.edu",
      role: "Student",
    },
    {
      id: 4,
      name: "Suresh Kumar",
      regNo: "21BCE1267",
      room: "A-201",
      floor: "A",
      branch: "ME",
      phone: "+91 98765 43213",
      email: "suresh@university.edu",
      role: "Student",
    },
  ];

  const roomOccupancy = [
    { floor: "A", total: 60, occupied: 55, percentage: 91.7 },
    { floor: "B", total: 60, occupied: 58, percentage: 96.7 },
    { floor: "C", total: 66, occupied: 62, percentage: 93.9 },
    { floor: "D", total: 80, occupied: 70, percentage: 87.5 },
  ];

  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.regNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = filterBranch === "all" || student.branch === filterBranch;
    const matchesRoom = !filterRoom || student.room.toLowerCase().includes(filterRoom.toLowerCase());
    const matchesFloor = filterFloor === "all" || student.floor === filterFloor;
    
    return matchesSearch && matchesBranch && matchesRoom && matchesFloor;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Students Management</h1>
        <p className="text-slate-600 mt-1">Manage student information and room assignments</p>
      </div>

      {/* Room Occupancy */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Room Occupancy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roomOccupancy.map((floor) => (
            <Card key={floor.floor} className="border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-slate-600">Floor {floor.floor}</h3>
                  <span className="text-sm font-semibold text-slate-900">
                    {floor.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                  <div
                    className="bg-slate-900 h-2 rounded-full transition-all"
                    style={{ width: `${floor.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {floor.occupied} / {floor.total} rooms occupied
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Filters */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2 text-slate-600" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name or reg no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterBranch} onValueChange={setFilterBranch}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="CSE">CSE</SelectItem>
                <SelectItem value="ECE">ECE</SelectItem>
                <SelectItem value="ME">ME</SelectItem>
                <SelectItem value="CE">CE</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Filter by room..."
              value={filterRoom}
              onChange={(e) => setFilterRoom(e.target.value)}
            />

            <Select value={filterFloor} onValueChange={setFilterFloor}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Floors</SelectItem>
                <SelectItem value="A">Floor A</SelectItem>
                <SelectItem value="B">Floor B</SelectItem>
                <SelectItem value="C">Floor C</SelectItem>
                <SelectItem value="D">Floor D</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-slate-600" />
            Students List ({filteredStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Reg No</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.regNo}</TableCell>
                    <TableCell>{student.room}</TableCell>
                    <TableCell>{student.branch}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{student.phone}</div>
                        <div className="text-slate-500">{student.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        student.role === "Floor Representative"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-700"
                      }`}>
                        {student.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600">No students found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
