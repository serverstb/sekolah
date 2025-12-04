
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
import { teachers, classes } from "@/lib/data";
import { PlusCircle, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TeacherForm } from "./_components/teacher-form";
import { useState, useMemo } from "react";
import Link from "next/link";

const ITEMS_PER_PAGE = 5;

export default function TeachersPage() {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(teachers.length / ITEMS_PER_PAGE);

  const paginatedTeachers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return teachers.slice(startIndex, endIndex);
  }, [currentPage]);

  const handleSuccess = () => {
    // In a real app, you'd refetch the data here.
    // For now, we just close the dialog.
    setOpen(false);
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Teacher Management</CardTitle>
            <CardDescription>
              View and manage all registered teachers.
            </CardDescription>
          </div>
          <DialogTrigger asChild>
             <Button onClick={() => setOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Teacher
            </Button>
          </DialogTrigger>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>NIP</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Classes Taught</TableHead>
                <TableHead className="text-right">Jurnal Mengajar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTeachers.map((teacher) => (
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
                  <TableCell>{teacher.subject}</TableCell>
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
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/teachers/${teacher.id}`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Lihat Jurnal
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
         <CardFooter className="flex items-center justify-between pt-6">
          <div className="text-sm text-muted-foreground">
            Showing page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Teacher</DialogTitle>
            <DialogDescription>
              Fill out the form below to register a new teacher.
            </DialogDescription>
          </DialogHeader>
          <TeacherForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
}
