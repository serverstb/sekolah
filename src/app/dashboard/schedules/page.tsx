
"use client";

import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  type Schedule,
  type DayOfWeek,
  type Teacher,
  type Subject,
  type Class
} from "@/lib/types";
import { ScheduleForm } from "./_components/schedule-form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const daysOfWeek: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const daysOfWeekIndonesian: { [key in DayOfWeek]: string } = {
  Monday: "Senin",
  Tuesday: "Selasa",
  Wednesday: "Rabu",
  Thursday: "Kamis",
  Friday: "Jumat",
};

export default function SchedulesPage() {
  const [open, setOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const { toast } = useToast();

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
      // Intentionally not setting loading to true here to avoid flicker on refetch
      try {
          const [schedulesRes, classesRes, teachersRes, subjectsRes] = await Promise.all([
              fetch('/api/schedules'),
              fetch('/api/classes'),
              fetch('/api/teachers'),
              fetch('/api/subjects'),
          ]);
          
          if (!schedulesRes.ok || !classesRes.ok || !teachersRes.ok || !subjectsRes.ok) {
              throw new Error('Gagal memuat sebagian data. Silakan coba lagi.');
          }

          const schedulesData = await schedulesRes.json();
          const classesData = await classesRes.json();
          const teachersData = await teachersRes.json();
          const subjectsData = await subjectsRes.json();

          setSchedules(schedulesData.schedules || []);
          setClasses(classesData.classes || []);
          setTeachers(teachersData.teachers || []);
          setSubjects(subjectsData.subjects || []);

      } catch (error: any) {
          console.error("Failed to fetch schedule data:", error);
          toast({ variant: 'destructive', title: 'Error', description: error.message });
      } finally {
          setIsLoading(false);
      }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleSuccess = () => {
    setOpen(false);
    setIsLoading(true);
    fetchData();
  };

  const getScheduleForDay = (day: DayOfWeek) => {
    return schedules
      .filter((s) => s.day === day)
      .sort((a, b) => {
          if (a.classId.localeCompare(b.classId) !== 0) {
              return a.classId.localeCompare(b.classId);
          }
          return a.startTime.localeCompare(b.startTime);
      });
  };
  
  const getSubjectById = (id: string) => subjects.find((s) => s.id === id);
  const getTeacherById = (id: string) => teachers.find((t) => t.id === id);
  const getClassById = (id: string) => classes.find((c) => c.id === id);


  const handleDeleteClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSchedule) return;
    try {
        const response = await fetch(`/api/schedules/${selectedSchedule.id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Gagal menghapus jadwal');
        }
        toast({
            title: "Jadwal Dihapus",
            description: `Entri jadwal telah dihapus.`,
        });
        fetchData();
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Gagal',
            description: error.message
        });
    } finally {
        setIsAlertOpen(false);
        setSelectedSchedule(null);
    }
  };
  
  if (isLoading) {
      return (
          <Card>
              <CardHeader><Skeleton className="h-8 w-1/3"/><Skeleton className="h-4 w-2/3 mt-2"/></CardHeader>
              <CardContent>
                  <Skeleton className="h-10 w-full mb-4"/>
                  <Skeleton className="h-40 w-full"/>
              </CardContent>
          </Card>
      )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Jadwal Pelajaran</CardTitle>
            <CardDescription>
              Lihat dan kelola jadwal pelajaran untuk semua kelas.
            </CardDescription>
          </div>
            <Button onClick={() => setOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Jadwal
            </Button>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {daysOfWeek.map((day) => (
                    <div key={day}>
                        <h3 className="text-lg font-semibold mb-3 text-center">{daysOfWeekIndonesian[day]}</h3>
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[25%]">Waktu</TableHead>
                                        <TableHead>Kelas</TableHead>
                                        <TableHead>Pelajaran</TableHead>
                                        <TableHead>Guru</TableHead>
                                        <TableHead className="w-[10%] text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                {getScheduleForDay(day).length > 0 ? (
                                    getScheduleForDay(day).map((schedule) => {
                                        const subject = getSubjectById(schedule.subjectId);
                                        const teacher = getTeacherById(schedule.teacherId);
                                        const cls = getClassById(schedule.classId);
                                        return (
                                            <TableRow key={schedule.id}>
                                                <TableCell className="text-xs">{schedule.startTime} - {schedule.endTime}</TableCell>
                                                <TableCell className="font-medium">{cls?.name || "N/A"}</TableCell>
                                                <TableCell>{subject?.name || "N/A"}</TableCell>
                                                <TableCell className="text-xs">{teacher?.name || "N/A"}</TableCell>
                                                <TableCell className="text-right p-1">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Buka menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleDeleteClick(schedule)}>
                                                                Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                            Tidak ada jadwal.
                                        </TableCell>
                                    </TableRow>
                                )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Jadwal Baru</DialogTitle>
            <DialogDescription>
              Isi formulir di bawah ini untuk membuat entri jadwal baru.
            </DialogDescription>
          </DialogHeader>
          <ScheduleForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus entri jadwal secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Lanjutkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
