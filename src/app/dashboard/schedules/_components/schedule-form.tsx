
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type DayOfWeek, type Staff, type Subject, type Class } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const daysOfWeek: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const daysOfWeekIndonesian: { [key in DayOfWeek]: string } = {
    Monday: "Senin",
    Tuesday: "Selasa",
    Wednesday: "Rabu",
    Thursday: "Kamis",
    Friday: "Jumat",
};


const formSchema = z.object({
  classId: z.string().nonempty("Silakan pilih kelas."),
  subjectId: z.string().nonempty("Silakan pilih mata pelajaran."),
  teacherId: z.string().nonempty("Silakan pilih guru."),
  day: z.string().nonempty("Silakan pilih hari."),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format waktu tidak valid (HH:mm)."),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format waktu tidak valid (HH:mm)."),
});

type ScheduleFormValues = z.infer<typeof formSchema>;

interface ScheduleFormProps {
  onSuccess: () => void;
}

export function ScheduleForm({ onSuccess }: ScheduleFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Staff[]>([]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [classesRes, subjectsRes, staffRes] = await Promise.all([
          fetch('/api/classes'),
          fetch('/api/subjects'),
          fetch('/api/staff')
        ]);
        
        const classesData = await classesRes.json();
        const subjectsData = await subjectsRes.json();
        const staffData = await staffRes.json();

        setClasses(classesData.classes || []);
        setSubjects(subjectsData.subjects || []);
        setTeachers((staffData.staff || []).filter((s: Staff) => s.role === 'teacher'));

      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat data untuk form jadwal.' });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [toast]);

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classId: "",
      subjectId: "",
      teacherId: "",
      day: "",
      startTime: "",
      endTime: "",
    },
  });

  const onSubmit = async (values: ScheduleFormValues) => {
    setIsSubmitting(true);
    try {
        const response = await fetch('/api/schedules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Gagal menyimpan jadwal.');
        }
        toast({
          title: "Jadwal Ditambahkan",
          description: `Jadwal baru telah berhasil dibuat.`,
        });
        onSuccess();
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Gagal',
            description: error.message,
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        <div className="flex justify-end pt-4">
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="classId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kelas</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mata Pelajaran</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih mata pelajaran" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subjects.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="teacherId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Guru</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih guru" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="day"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hari</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih hari" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day} value={day}>
                      {daysOfWeekIndonesian[day]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waktu Mulai</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waktu Selesai</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Tambah Jadwal'}</Button>
        </div>
      </form>
    </Form>
  );
}
