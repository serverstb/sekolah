
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { format, getYear, getMonth, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  attendanceRecords,
  teacherAttendanceRecords,
  employeeAttendanceRecords,
  students,
  teachers,
  employees,
  classes,
  type AttendanceRecord,
  type Student,
  type Teacher,
  type Employee,
} from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";


function getStudentById(id: string) {
  return students.find((s) => s.id === id);
}

function getTeacherById(id: string) {
  return teachers.find((t) => t.id === id);
}

function getEmployeeById(id: string) {
  return employees.find((e) => e.id === id);
}

function getClassById(id: string) {
  return classes.find((c) => c.id === id);
}

function getStatusVariant(
  status: AttendanceRecord["status"]
): "default" | "secondary" | "destructive" {
  if (status === "Present") return "default";
  if (status === "Late") return "secondary";
  return "destructive";
}

const currentYear = getYear(new Date());
const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
const months = [
  { value: "0", label: "January" },
  { value: "1", label: "February" },
  { value: "2", label: "March" },
  { value: "3", label: "April" },
  { value: "4", label: "May" },
  { value: "5", label: "June" },
  { value: "6", label: "July" },
  { value: "7", label: "August" },
  { value: "8",label: "September" },
  { value: "9", label: "October" },
  { value: "10", label: "November" },
  { value: "11", label: "December" },
];

const chartConfig = {
  present: {
    label: "Present",
    color: "hsl(var(--chart-2))",
  },
  late: {
    label: "Late",
    color: "hsl(var(--chart-4))",
  },
  absent: {
    label: "Absent",
    color: "hsl(var(--chart-5))",
  },
};


type AttendanceChartData = {
  date: string;
  present: number;
  late: number;
  absent: number;
};

interface AttendanceChartProps {
  data: AttendanceChartData[];
}

function AttendanceChart({ data }: AttendanceChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full mb-8">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.substring(0, 5)} // "Mon 01" -> "Mon"
          />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="present" fill="var(--color-present)" radius={4} />
          <Bar dataKey="late" fill="var(--color-late)" radius={4} />
          <Bar dataKey="absent" fill="var(--color-absent)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default function ReportPage() {
  const [classId, setClassId] = useState("all");
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(getMonth(new Date()).toString());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const dateRange = useMemo(() => {
    if (!isClient) return undefined;
    const year = parseInt(selectedYear);
    const month = parseInt(selectedMonth);
    const from = startOfMonth(new Date(year, month));
    const to = endOfMonth(new Date(year, month));
    return { from, to };
  }, [selectedYear, selectedMonth, isClient]);

  const getChartData = <T extends {id: string}, R extends {timestamp: Date; status: "Present" | "Late" | "Absent"}>(
    allPersons: T[],
    records: R[],
    personIdKey: keyof R
  ): AttendanceChartData[] => {
    if (!dateRange) return [];

    const daysInMonth = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });

    return daysInMonth.map(day => {
      const dailyRecords = records.filter(record => isSameDay(record.timestamp, day));
      const present = dailyRecords.filter(r => r.status === "Present").length;
      const late = dailyRecords.filter(r => r.status === "Late").length;
      
      const attendedIds = new Set(dailyRecords.map(r => r[personIdKey]));
      const absent = allPersons.filter(p => !attendedIds.has(p.id)).length;

      return {
        date: format(day, "dd/MM"),
        present,
        late,
        absent,
      };
    });
  };

  const filteredStudentRecords = useMemo(() => {
    if (!dateRange) return [];
    return attendanceRecords.filter((record) => {
      const recordDate = new Date(record.timestamp);
      const student = getStudentById(record.studentId);
      
      const isClassMatch = classId === "all" || student?.classId === classId;
      
      const isDateMatch = dateRange.from && dateRange.to 
        ? recordDate >= dateRange.from && recordDate <= dateRange.to
        : true;

      return isClassMatch && isDateMatch;
    });
  }, [classId, dateRange]);

  const filteredTeacherRecords = useMemo(() => {
    if (!dateRange) return [];
    return teacherAttendanceRecords.filter((record) => {
      const recordDate = new Date(record.timestamp);
      const isDateMatch = dateRange.from && dateRange.to 
        ? recordDate >= dateRange.from && recordDate <= dateRange.to
        : true;
      return isDateMatch;
    });
  }, [dateRange]);

  const filteredEmployeeRecords = useMemo(() => {
    if (!dateRange) return [];
    return employeeAttendanceRecords.filter((record) => {
      const recordDate = new Date(record.timestamp);
      const isDateMatch = dateRange.from && dateRange.to 
        ? recordDate >= dateRange.from && recordDate <= dateRange.to
        : true;
      return isDateMatch;
    });
  }, [dateRange]);

  const studentChartData = useMemo(() => {
    let relevantStudents = students;
    if (classId !== 'all') {
      relevantStudents = students.filter(s => s.classId === classId);
    }
    return getChartData(relevantStudents, filteredStudentRecords, 'studentId');
  }, [filteredStudentRecords, students, classId, dateRange]);
  
  const teacherChartData = useMemo(() => getChartData(teachers, filteredTeacherRecords, 'teacherId'), [filteredTeacherRecords, dateRange]);
  const employeeChartData = useMemo(() => getChartData(employees, filteredEmployeeRecords, 'employeeId'), [filteredEmployeeRecords, dateRange]);

  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Report</CardTitle>
        <CardDescription>
          View and filter attendance records for students, teachers, and employees by month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="students">
          <div className="flex justify-between flex-wrap gap-4">
            <TabsList>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="teachers">Teachers</TabsTrigger>
              <TabsTrigger value="employees">Employees</TabsTrigger>
            </TabsList>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                 <label htmlFor="year-filter" className="text-sm font-medium">
                    Year:
                 </label>
                 <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                 </Select>
              </div>
              <div className="flex items-center gap-2">
                 <label htmlFor="month-filter" className="text-sm font-medium">
                    Month:
                 </label>
                 <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                 </Select>
              </div>
            </div>
          </div>

          <TabsContent value="students" className="mt-6">
            <div className="mb-6 flex flex-wrap items-center gap-4">
               <div className="flex items-center gap-2">
                <label htmlFor="class-filter" className="text-sm font-medium">
                  Class:
                </label>
                <Select value={classId} onValueChange={setClassId}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <AttendanceChart data={studentChartData} />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="hidden sm:table-cell">Class</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudentRecords.length > 0 ? (
                  filteredStudentRecords.map((record) => {
                    const student = getStudentById(record.studentId);
                    const studentClass = student
                      ? getClassById(student.classId)
                      : null;
                    return (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="hidden h-9 w-9 sm:flex">
                              <AvatarImage
                                src={student?.avatarUrl}
                                alt={student?.name}
                                data-ai-hint={student?.avatarHint}
                              />
                              <AvatarFallback>
                                {student?.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="font-medium">
                              {student?.name || "Unknown"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {studentClass?.name || "N/A"}
                        </TableCell>
                        <TableCell>
                          {format(record.timestamp, "HH:mm:ss")}
                        </TableCell>
                        <TableCell>
                          {format(record.timestamp, "dd MMM yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={getStatusVariant(record.status)}>
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                        No attendance records found for the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="teachers" className="mt-6">
            <AttendanceChart data={teacherChartData} />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeacherRecords.length > 0 ? (
                  filteredTeacherRecords.map((record) => {
                    const teacher = getTeacherById(record.teacherId);
                    return (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="hidden h-9 w-9 sm:flex">
                              <AvatarImage
                                src={teacher?.avatarUrl}
                                alt={teacher?.name}
                                data-ai-hint={teacher?.avatarHint}
                              />
                              <AvatarFallback>
                                {teacher?.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="font-medium">
                              {teacher?.name || "Unknown"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(record.timestamp, "HH:mm:ss")}
                        </TableCell>
                        <TableCell>
                          {format(record.timestamp, "dd MMM yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={getStatusVariant(record.status)}>
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                        No attendance records found for the selected date range.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="employees" className="mt-6">
            <AttendanceChart data={employeeChartData} />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                   <TableHead className="hidden sm:table-cell">Role</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployeeRecords.length > 0 ? (
                  filteredEmployeeRecords.map((record) => {
                    const employee = getEmployeeById(record.employeeId);
                    return (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="hidden h-9 w-9 sm:flex">
                              <AvatarImage
                                src={employee?.avatarUrl}
                                alt={employee?.name}
                                data-ai-hint={employee?.avatarHint}
                              />
                              <AvatarFallback>
                                {employee?.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="font-medium">
                              {employee?.name || "Unknown"}
                            </div>
                          </div>
                        </TableCell>
                         <TableCell className="hidden sm:table-cell">{employee?.role || "N/A"}</TableCell>
                        <TableCell>
                          {format(record.timestamp, "HH:mm:ss")}
                        </TableCell>
                        <TableCell>
                          {format(record.timestamp, "dd MMM yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={getStatusVariant(record.status)}>
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                        No attendance records found for the selected date range.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

    