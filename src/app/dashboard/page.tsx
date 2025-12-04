
import {
  BarChart,
  UserCheck,
  Users,
  CalendarCheck,
} from "lucide-react";
import { format } from "date-fns";
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
import { attendanceRecords, students, classes, newStudentApplicants } from "@/lib/data";
import type { AttendanceRecord } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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
  
  const studentsByYear = newStudentApplicants
    .filter(applicant => applicant.status === 'Accepted')
    .reduce((acc, applicant) => {
      acc[applicant.academicYear] = (acc[applicant.academicYear] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              Total siswa aktif saat ini
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hadir Hari Ini</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentToday}</div>
            <p className="text-xs text-muted-foreground">
              {students.length - presentToday} siswa tidak hadir
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tingkat Kehadiran
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Untuk kehadiran hari ini
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Siswa Diterima</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {Object.keys(studentsByYear).sort().map((year, index) => (
              <React.Fragment key={year}>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{year}</span>
                  <span className="font-bold">{studentsByYear[year]} siswa</span>
                </div>
                {index < Object.keys(studentsByYear).length - 1 && <Separator className="my-1.5" />}
              </React.Fragment>
            ))}
             {Object.keys(studentsByYear).length === 0 && (
                <p className="text-xs text-muted-foreground text-center pt-2">Belum ada siswa diterima.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Absensi Terbaru</CardTitle>
          <CardDescription>5 catatan absensi terakhir hari ini.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Siswa</TableHead>
                <TableHead className="hidden sm:table-cell">Kelas</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Tanggal</TableHead>
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
                        <div className="font-medium">{student?.name || "Tidak Dikenal"}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{studentClass?.name || "N/A"}</TableCell>
                    <TableCell>{format(record.timestamp, "HH:mm:ss")}</TableCell>
                    <TableCell>{format(record.timestamp, "dd MMM yyyy")}</TableCell>
                    <TableCell className="text-right">
                       <Badge variant={getStatusVariant(record.status)}>{record.status === 'Present' ? 'Hadir' : record.status === 'Late' ? 'Terlambat' : 'Absen'}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {attendanceRecords.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                        Belum ada catatan absensi untuk hari ini.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
