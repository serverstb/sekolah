import {
  BarChart,
  UserCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { attendanceRecords, students, classes } from "@/lib/data";
import type { AttendanceRecord } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function getStudentById(id: string) {
  return students.find((s) => s.id === id);
}

function getClassById(id: string) {
    return classes.find((c) => c.id === id);
}

function getStatusVariant(status: AttendanceRecord["status"]): "default" | "secondary" | "destructive" {
  if (status === 'Present') return 'default';
  if (status === 'Late') return 'secondary';
  return 'destructive';
}

export default function DashboardPage() {
  const presentToday = attendanceRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
  const attendanceRate = students.length > 0 ? (presentToday / students.length) * 100 : 0;
  
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              Total registered students
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentToday}</div>
            <p className="text-xs text-muted-foreground">
              {students.length - presentToday} students absent
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance Rate
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              For today's attendance
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
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
              {attendanceRecords.slice(0, 5).map((record) => {
                const student = getStudentById(record.studentId);
                const studentClass = student ? getClassById(student.classId) : null;
                return (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                         <Avatar className="hidden h-9 w-9 sm:flex">
                          <AvatarImage src={student?.avatarUrl} alt={student?.name} data-ai-hint={student?.avatarHint} />
                          <AvatarFallback>{student?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{student?.name || "Unknown"}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{studentClass?.name || "N/A"}</TableCell>
                    <TableCell>{format(record.timestamp, "HH:mm:ss")}</TableCell>
                    <TableCell>{format(record.timestamp, "dd MMM yyyy")}</TableCell>
                    <TableCell className="text-right">
                       <Badge variant={getStatusVariant(record.status)}>{record.status}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
