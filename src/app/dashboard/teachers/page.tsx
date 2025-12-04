
"use client";

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
import { teachers, classes, subjects, type Teacher } from "@/lib/data";
import { PlusCircle, BookOpen, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { TeacherForm } from "./_components/teacher-form";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 5;

export default function TeachersPage() {
  const [open, setOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const totalPages = Math.ceil(teachers.length / ITEMS_PER_PAGE);

  const paginatedTeachers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return teachers.slice(startIndex, endIndex);
  }, [currentPage]);

  const handleSuccess = () => {
    setOpen(false);
  };

  const handleDeleteClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTeacher) {
      console.log("Menghapus guru:", selectedTeacher.id);
      toast({
        title: "Guru Dihapus",
        description: `Guru "${selectedTeacher.name}" telah dihapus.`,
      });
    }
    setIsAlertOpen(false);
    setSelectedTeacher(null);
  };
  
  const handleEditClick = (teacher: Teacher) => {
    console.log("Mengubah guru:", teacher.id);
     toast({
        title: "Aksi Ubah",
        description: `Mengubah "${teacher.name}". (UI belum diimplementasikan)`,
      });
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manajemen Guru</CardTitle>
            <CardDescription>
              Lihat dan kelola semua guru terdaftar.
            </CardDescription>
          </div>
          <DialogTrigger asChild>
             <Button onClick={() => setOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Guru
            </Button>
          </DialogTrigger>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>NIP</TableHead>
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Kelas yang Diajar</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTeachers.map((teacher) => {
                const subject = subjects.find(s => s.id === teacher.subjectId);
                return (
                    <TableRow key={teacher.id}>
                    <TableCell>
                        <Avatar>
                        <AvatarImage
                            src={teacher.avatarUrl}
                            alt={teacher.name}
                            data-ai-hint={teacher.avatarHint}
                        />
                        <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>{teacher.nip}</TableCell>
                    <TableCell>{subject?.name || "N/A"}</TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-1">
                        {teacher.taughtClassIds.map((classId) => {
                            const taughtClass = classes.find(
                            (c) => c.id === classId
                            );
                            return taughtClass ? (
                            <Badge variant="secondary" key={classId}>
                                {taughtClass.name}
                            </Badge>
                            ) : null;
                        })}
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/dashboard/teachers/${teacher.id}`}>
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    Jurnal
                                </Link>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Buka menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditClick(teacher)}>
                                    Ubah
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteClick(teacher)}>
                                    Hapus
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </TableCell>
                    </TableRow>
                )
              })}
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Guru Baru</DialogTitle>
            <DialogDescription>
              Isi formulir di bawah ini untuk mendaftarkan guru baru.
            </DialogDescription>
          </DialogHeader>
          <TeacherForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus guru secara permanen
              "{selectedTeacher?.name}".
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
