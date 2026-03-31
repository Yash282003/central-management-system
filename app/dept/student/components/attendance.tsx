"use client"
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { attendance } from "../../data/mockdata";

export default function StudentAttendance() {
  const averageAttendance =
    attendance.reduce((sum, course) => sum + course.percentage, 0) / attendance.length;

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 90) return { color: "green", icon: CheckCircle2, label: "Excellent" };
    if (percentage >= 75) return { color: "blue", icon: CheckCircle2, label: "Good" };
    if (percentage >= 65) return { color: "orange", icon: AlertTriangle, label: "Warning" };
    return { color: "red", icon: XCircle, label: "Critical" };
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Attendance Record</h1>
        <p className="text-gray-600">Monitor your class attendance across all courses</p>
      </div>

      {/* Summary Card */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="size-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Attendance</p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {averageAttendance.toFixed(1)}%
                  </p>
                </div>
              </div>
              <Progress value={averageAttendance} className="h-3" />
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-600">
                  Minimum required: <span className="font-medium">75%</span>
                </p>
                {averageAttendance >= 75 ? (
                  <Badge variant="default" className="bg-green-600">
                    Above Requirement
                  </Badge>
                ) : (
                  <Badge variant="destructive">Below Requirement</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Course-wise Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Course Code</TableHead>
                  <TableHead className="font-semibold">Course Name</TableHead>
                  <TableHead className="font-semibold text-center">Classes Attended</TableHead>
                  <TableHead className="font-semibold text-center">Total Classes</TableHead>
                  <TableHead className="font-semibold text-center">Percentage</TableHead>
                  <TableHead className="font-semibold text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((course) => {
                  const status = getAttendanceStatus(course.percentage);
                  const StatusIcon = status.icon;
                  return (
                    <TableRow key={course.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{course.code}</TableCell>
                      <TableCell>{course.course}</TableCell>
                      <TableCell className="text-center">{course.attended}</TableCell>
                      <TableCell className="text-center">{course.total}</TableCell>
                      <TableCell className="text-center">
                        <div className="space-y-2">
                          <span className="font-semibold text-gray-900">
                            {course.percentage.toFixed(1)}%
                          </span>
                          <Progress value={course.percentage} className="h-2 w-24 mx-auto" />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <StatusIcon
                            className={`size-4 ${
                              status.color === "green"
                                ? "text-green-600"
                                : status.color === "blue"
                                ? "text-blue-600"
                                : status.color === "orange"
                                ? "text-orange-600"
                                : "text-red-600"
                            }`}
                          />
                          <Badge
                            variant={
                              status.color === "green" || status.color === "blue"
                                ? "default"
                                : status.color === "orange"
                                ? "outline"
                                : "destructive"
                            }
                            className={
                              status.color === "green"
                                ? "bg-green-600"
                                : status.color === "blue"
                                ? "bg-blue-600"
                                : status.color === "orange"
                                ? "text-orange-600 border-orange-600"
                                : ""
                            }
                          >
                            {status.label}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Important Note */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Attendance Policy</h4>
              <p className="text-sm text-blue-800">
                A minimum attendance of 75% is required in each course to be eligible for the final
                examination. Students falling below this threshold may face academic penalties.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
