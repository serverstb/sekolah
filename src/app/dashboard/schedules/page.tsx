
"use client";

import { useState } from "react";
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
  DialogTrigger,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  classes,
  schedules,
  subjects,
  teachers,
  type Schedule,
  type DayOfWeek,
} from "@/lib/data";
import { ScheduleForm } from "./_components/schedule-form";
import { useToast } from "@/hooks/use-toast";

function getSubjectById(id: string) {
  return subjects.find((s) => s.id === id);
}

function getTeacherById(id: string) {
  return teachers.find((t) => t.id === id);
}

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

  const handleSuccess = () => {
    setOpen(false);
  };

  const getScheduleForDay = (classId: string, day: DayOfWeek) => {
    return schedules
      .filter((s) => s.classId === classId && s.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const handleDeleteClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSchedule) {
      console.log("Menghapus jadwal:", selectedSchedule.id);
      toast({
        title: "Jadwal Dihapus",
        description: `Entri jadwal telah dihapus.`,
      });
    }
    setIsAlertOpen(false);
    setSelectedSchedule(null);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Jadwal Pelajaran</CardTitle>
            <CardDescription>
              Lihat dan kelola jadwal pelajaran kelas.
            </CardDescription>
          </div>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Jadwal
            </Button>
          </DialogTrigger>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={classes[0]?.id || ""}>
            <TabsList className="grid w-full grid-cols-5">
              {classes.map((cls) => (
                <TabsTrigger key={cls.id} value={cls.id}>
                  {cls.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {classes.map((cls) => (
              <TabsContent key={cls.id} value={cls.id}>
                <div className="mt-4 space-y-6">
                  {daysOfWeek.map((day) => (
                    <div key={day}>
                      <h3 className="text-lg font-semibold mb-2">{daysOfWeekIndonesian[day]}</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[20%]">Waktu</TableHead>
                            <TableHead className="w-[35%]">Mata Pelajaran</TableHead>
                            <TableHead className="w-[35%]">Guru</TableHead>
                            <TableHead className="w-[10%] text-right">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getScheduleForDay(cls.id, day).length > 0 ? (
                            getScheduleForDay(cls.id, day).map((schedule) => {
                              const subject = getSubjectById(schedule.subjectId);
                              const teacher = getTeacherById(schedule.teacherId);
                              return (
                                <TableRow key={schedule.id}>
                                  <TableCell>
                                    {schedule.startTime} - {schedule.endTime}
                                  </TableCell>
                                  <TableCell>{subject?.name || "N/A"}</TableCell>
                                  <TableCell>{teacher?.name || "N/A"}</TableCell>
                                  <TableCell className="text-right">
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
                              <TableCell
                                colSpan={4}
                                className="text-center h-24"
                              >
                                Tidak ada jadwal untuk hari {daysOfWeekIndonesian[day]}.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
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
