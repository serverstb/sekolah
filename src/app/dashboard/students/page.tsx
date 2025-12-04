
"use client";

import Image from "next/image";
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
import { students, classes } from "@/lib/data";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StudentForm } from "./_components/student-form";
import { useState } from "react";

function getClassById(id: string) {
  return classes.find((c) => c.id === id);
}

export default function StudentsPage() {
  const [open, setOpen] = useState(false);

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
            <CardTitle>Student Management</CardTitle>
            <CardDescription>
              View and manage all registered students.
            </CardDescription>
          </div>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Class</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => {
                const studentClass = getClassById(student.classId);
                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage
                          src={student.avatarUrl}
                          alt={student.name}
                          data-ai-hint={student.avatarHint}
                        />
                        <AvatarFallback>
                          {student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{studentClass?.name || "N/A"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Fill out the form below to register a new student.
          </DialogDescription>
        </DialogHeader>
        <StudentForm onSuccess={handleSuccess} />
      </DialogContent>
    </>
  );
}
