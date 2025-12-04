
"use client";

import { useState, useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
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
import { Input } from "@/components/ui/input";
import {
  teachers,
  classes,
  teachingJournals,
  subjects,
  type TeachingJournal,
} from "@/lib/data";
import { ArrowLeft, PlusCircle, MoreHorizontal, Search, File as FileIcon } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
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
import { JournalForm } from "./_components/journal-form";
import { useToast } from "@/hooks/use-toast";

function getTeacherById(id: string) {
  return teachers.find((t) => t.id === id);
}

function getClassById(id: string) {
  return classes.find((c) => c.id === id);
}

function getSubjectById(id: string) {
    return subjects.find(s => s.id === id);
}


const ITEMS_PER_PAGE = 5;

export default function TeacherJournalPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<TeachingJournal | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { toast } = useToast();
  const params = useParams();
  const teacherId = params.teacherId as string;
  
  const teacher = getTeacherById(teacherId);

  if (!teacher) {
    notFound();
  }
  
  const subject = getSubjectById(teacher.subjectId);
  const taughtClasses = classes.filter(c => teacher.taughtClassIds.includes(c.id));
  
  const journals = useMemo(() => {
    return teachingJournals
      .filter((j) => j.teacherId === teacher.id)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [teacher.id]);

  const filteredJournals = useMemo(() => {
    return journals.filter(journal => 
        journal.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journal.notes.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [journals, searchTerm]);

  const totalPages = Math.ceil(filteredJournals.length / ITEMS_PER_PAGE);

  const paginatedJournals = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredJournals.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredJournals, currentPage]);

  const handleSuccess = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
  };

  const handleEditClick = (journal: TeachingJournal) => {
    setSelectedJournal(journal);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (journal: TeachingJournal) => {
    setSelectedJournal(journal);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedJournal) {
      console.log("Menghapus Jurnal:", selectedJournal.id);
      toast({
        title: "Jurnal Dihapus",
        description: `Entri jurnal untuk "${selectedJournal.topic}" telah dihapus.`,
      });
    }
    setIsAlertOpen(false);
    setSelectedJournal(null);
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
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Jurnal Mengajar</CardTitle>
              <CardDescription>
                Catatan semua aktivitas mengajar.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        type="search"
                        placeholder="Cari topik pelajaran..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={() => setIsAddOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tambah Entri
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Mata Pelajaran</TableHead>
                  <TableHead>Topik Pelajaran</TableHead>
                  <TableHead>Catatan</TableHead>
                  <TableHead>Materi</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedJournals.length > 0 ? (
                  paginatedJournals.map((journal) => {
                    const journalClass = getClassById(journal.classId);
                    const journalSubject = getSubjectById(journal.subjectId);
                    return (
                      <TableRow key={journal.id}>
                        <TableCell>{format(journal.date, "dd MMM yyyy")}</TableCell>
                        <TableCell>{journalClass?.name || "N/A"}</TableCell>
                        <TableCell>{journalSubject?.name || "N/A"}</TableCell>
                        <TableCell className="font-medium">
                          {journal.topic}
                        </TableCell>
                        <TableCell>{journal.notes}</TableCell>
                        <TableCell>
                          {journal.materialFile ? (
                            <div className="flex items-center gap-2">
                                <FileIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm truncate">{journal.materialFile}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Buka menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditClick(journal)}>
                                Ubah
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteClick(journal)}>
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
                    <TableCell colSpan={7} className="h-24 text-center">
                      {searchTerm ? "Tidak ada jurnal yang cocok dengan pencarian Anda." : "Belum ada entri jurnal."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
            <CardFooter className="flex items-center justify-between pt-6">
                <div className="text-sm text-muted-foreground">
                    Halaman {currentPage} dari {totalPages}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    >
                    Sebelumnya
                    </Button>
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    >
                    Berikutnya
                    </Button>
                </div>
            </CardFooter>
        </Card>
      </div>

       <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Entri Jurnal Baru</DialogTitle>
            <DialogDescription>
              Isi formulir untuk menambahkan entri jurnal mengajar baru untuk {teacher.name}.
            </DialogDescription>
          </DialogHeader>
          <JournalForm teacher={teacher} subject={subject} taughtClasses={taughtClasses} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Entri Jurnal</DialogTitle>
            <DialogDescription>
              Perbarui detail entri jurnal mengajar untuk {teacher.name}.
            </DialogDescription>
          </DialogHeader>
          <JournalForm 
            teacher={teacher}
            subject={subject}
            taughtClasses={taughtClasses} 
            onSuccess={handleSuccess}
            existingJournal={selectedJournal}
          />
        </DialogContent>
      </Dialog>

       <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus entri jurnal untuk topik
              "{selectedJournal?.topic}" secara permanen.
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

    