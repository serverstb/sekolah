
"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  teachers,
  classes,
  teachingJournals,
  subjects,
  type TeachingJournal,
} from "@/lib/data";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { JournalForm } from "./_components/journal-form";

function getTeacherById(id: string) {
  return teachers.find((t) => t.id === id);
}

function getClassById(id: string) {
  return classes.find((c) => c.id === id);
}

function getJournalsByTeacherId(teacherId: string) {
  return teachingJournals
    .filter((j) => j.teacherId === teacherId)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export default function TeacherJournalPage() {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const teacherId = params.teacherId as string;
  
  const teacher = getTeacherById(teacherId);

  if (!teacher) {
    notFound();
  }
  
  const subject = subjects.find(s => s.id === teacher.subjectId);
  const journals = getJournalsByTeacherId(teacher.id);
  const taughtClasses = classes.filter(c => teacher.taughtClassIds.includes(c.id));

  const handleSuccess = () => {
    // In a real app, you'd refetch the data. For now, just close the dialog.
    setOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard/teachers">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            </Button>
            <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={teacher.avatarUrl} alt={teacher.name} data-ai-hint={teacher.avatarHint} />
                    <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-2xl font-bold">{teacher.name}</h1>
                    <p className="text-muted-foreground">{subject?.name || "N/A"}</p>
                </div>
            </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Jurnal Mengajar</CardTitle>
              <CardDescription>
                Catatan semua aktivitas mengajar.
              </CardDescription>
            </div>
             <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tambah Entri
                </Button>
            </DialogTrigger>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Materi Pelajaran</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {journals.length > 0 ? (
                  journals.map((journal) => {
                    const journalClass = getClassById(journal.classId);
                    return (
                      <TableRow key={journal.id}>
                        <TableCell>{format(journal.date, "dd MMM yyyy")}</TableCell>
                        <TableCell>{journalClass?.name || "N/A"}</TableCell>
                        <TableCell className="font-medium">
                          {journal.subjectMatter}
                        </TableCell>
                        <TableCell>{journal.notes}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Belum ada entri jurnal.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

       <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Entri Jurnal Baru</DialogTitle>
            <DialogDescription>
              Isi formulir di bawah ini untuk menambahkan entri jurnal mengajar baru untuk {teacher.name}.
            </DialogDescription>
          </DialogHeader>
          <JournalForm teacher={teacher} taughtClasses={taughtClasses} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
}
