
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
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Teacher, Class } from "../page";

type Subject = { id: string, name: string };

const formSchema = z.object({
  name: z.string().min(2, "Nama minimal harus 2 karakter."),
  nip: z.string().regex(/^\d+$/, "NIP harus berupa angka.").min(10, "NIP minimal harus 10 digit."),
  subjectId: z.string().nonempty("Silakan pilih mata pelajaran."),
  taughtClassIds: z.array(z.string()).optional(),
});

type TeacherFormValues = z.infer<typeof formSchema>;

interface TeacherFormProps {
    onSuccess: () => void;
    existingTeacher?: Teacher | null;
}

export function TeacherForm({ onSuccess, existingTeacher }: TeacherFormProps) {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!existingTeacher;

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [subjectsRes, classesRes] = await Promise.all([
                fetch('/api/subjects'),
                fetch('/api/classes'),
            ]);
            
            const subjectsData = await subjectsRes.json();
            const classesData = await classesRes.json();
            setSubjects(subjectsData.subjects);
            setClasses(classesData.classes);

        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Gagal memuat data',
                description: 'Tidak bisa memuat daftar mata pelajaran dan kelas.'
            })
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, [toast]);


  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditMode ? {
        name: existingTeacher?.name,
        nip: existingTeacher?.nip,
        subjectId: existingTeacher?.subjectId,
        taughtClassIds: existingTeacher?.taughtClassIds || [],
    } : {
      name: "",
      nip: "",
      subjectId: "",
      taughtClassIds: [],
    },
  });
  
  // Sync form with `existingTeacher` prop when it changes
  useEffect(() => {
      if (isEditMode && existingTeacher) {
          form.reset({
              name: existingTeacher.name,
              nip: existingTeacher.nip,
              subjectId: existingTeacher.subjectId,
              taughtClassIds: existingTeacher.taughtClassIds || [],
          })
      }
  }, [existingTeacher, isEditMode, form]);

  const onSubmit = async (values: TeacherFormValues) => {
    setIsSubmitting(true);
    
    const url = isEditMode ? `/api/teachers/${existingTeacher.id}` : '/api/teachers';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Gagal menyimpan data guru.');
        }

        toast({
            title: isEditMode ? "Guru Diperbarui" : "Guru Ditambahkan",
            description: `${values.name} telah berhasil ${isEditMode ? 'diperbarui' : 'terdaftar'}.`,
        });
        onSuccess();

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Gagal",
            description: error.message,
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
        <div className="space-y-8">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="flex justify-end">
                <Skeleton className="h-10 w-24" />
            </div>
        </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama lengkap guru" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIP</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan NIP guru" {...field} />
              </FormControl>
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
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEditMode && (
          <FormField
            control={form.control}
            name="taughtClassIds"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Kelas yang Diajar</FormLabel>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {classes.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="taughtClassIds"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.name}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : (isEditMode ? 'Simpan Perubahan' : 'Tambah Guru')}
            </Button>
        </div>
      </form>
    </Form>
  );
}
