
"use client";

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
import { classes, teachers } from "@/lib/data";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClassForm } from "./_components/class-form";
import { useState } from "react";

function getTeacherById(id: string) {
  return teachers.find((t) => t.id === id);
}

export default function ClassesPage() {
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
            <CardTitle>Class Management</CardTitle>
            <CardDescription>View and manage all classes.</CardDescription>
          </div>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </DialogTrigger>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Name</TableHead>
                <TableHead>Wali Kelas</TableHead>
                <TableHead className="text-right">Number of Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((cls) => {
                const walikelas = getTeacherById(cls.walikelasId);
                return (
                  <TableRow key={cls.id}>
                    <TableCell className="font-medium">{cls.name}</TableCell>
                    <TableCell>{walikelas?.name || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      {cls.studentCount}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new class.
          </DialogDescription>
        </DialogHeader>
        <ClassForm onSuccess={handleSuccess} />
      </DialogContent>
    </>
  );
}
