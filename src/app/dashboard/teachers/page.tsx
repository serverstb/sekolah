
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { teachers, classes } from "@/lib/data";
import { PlusCircle } from "lucide-react";
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
import { useState } from "react";


export default function TeachersPage() {
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
            <CardTitle>Teacher Management</CardTitle>
            <CardDescription>
              View and manage all registered teachers.
            </CardDescription>
          </div>
          <DialogTrigger asChild>
            <Button>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Teacher</DialogTitle>
          <DialogDescription>
            Fill out the form below to register a new teacher.
          </DialogDescription>
        </DialogHeader>
        <TeacherForm onSuccess={handleSuccess} />
      </DialogContent>
    </>
  );
}
