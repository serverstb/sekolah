
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
import type { Staff, Class } from "../page";

type Subject = { id: string, name: string };

const formSchema = z.object({
  name: z.string().min(2, "Nama minimal harus 2 karakter."),
  role: z.enum(['teacher', 'employee'], { required_error: 'Peran harus dipilih' }),
  nip: z.string().optional(),
  subjectId: z.string().optional(),
  jobTitle: z.string().optional(),
  taughtClassIds: z.array(z.string()).optional(),
}).refine(data => data.role !== 'teacher' || (data.nip && data.nip.length >= 10), {
    message: "NIP minimal harus 10 digit untuk guru.",
    path: ["nip"],
}).refine(data => data.role !== 'teacher' || !!data.subjectId, {
    message: "Mata pelajaran harus dipilih untuk guru.",
    path: ["subjectId"],
}).refine(data => data.role !== 'employee' || (data.jobTitle && data.jobTitle.length > 0), {
    message: "Jabatan harus diisi untuk karyawan.",
    path: ["jobTitle"],
});

type StaffFormValues = z.infer<typeof formSchema>;

interface StaffFormProps {
    onSuccess: () => void;
    existingStaff?: Staff | null;
}

export function StaffForm({ onSuccess, existingStaff }: StaffFormProps) {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!existingStaff;

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: undefined,
      nip: "",
      subjectId: "",
      jobTitle: "",
      taughtClassIds: [],
    },
  });

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
  
  useEffect(() => {
      if (isEditMode && existingStaff) {
          form.reset({
              name: existingStaff.name,
              role: existingStaff.role,
              nip: existingStaff.nip || "",
              subjectId: existingStaff.subjectId || "",
              jobTitle: existingStaff.jobTitle || "",
              taughtClassIds: existingStaff.taughtClassIds || [],
          })
      }
  }, [existingStaff, isEditMode, form]);

  const onSubmit = async (values: StaffFormValues) => {
    setIsSubmitting(true);
    
    const url = isEditMode ? `/api/staff/${existingStaff.id}` : '/api/staff';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Gagal menyimpan data.');
        }

        toast({
            title: isEditMode ? "Data Diperbarui" : "Data Ditambahkan",
            description: `${values.name} telah berhasil ${isEditMode ? 'diperbarui' : 'ditambahkan'}.`,
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
  
  const selectedRole = form.watch("role");

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama lengkap" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peran</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih peran" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value="teacher">Guru</SelectItem>
                    <SelectItem value="employee">Karyawan</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {selectedRole === 'teacher' && (
            <>
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
            </>
        )}
        
        {selectedRole === 'employee' && (
             <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Jabatan</FormLabel>
                    <FormControl>
                        <Input placeholder="contoh, Staf Tata Usaha" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        )}


        {isEditMode && selectedRole === 'teacher' && (
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
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : (isEditMode ? 'Simpan Perubahan' : 'Tambah Data')}
            </Button>
        </div>
      </form>
    </Form>
  );
}
