
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
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Staff } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(2, "Nama kelas minimal harus 2 karakter."),
  walikelasId: z.string().nonempty("Silakan pilih wali kelas."),
});

type ClassFormValues = z.infer<typeof formSchema>;

interface ClassFormProps {
    onSuccess: () => void;
}

export function ClassForm({ onSuccess }: ClassFormProps) {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/staff');
            const data = await response.json();
            // Filter for teachers only
            setTeachers((data.staff || []).filter((s: Staff) => s.role === 'teacher'));
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Gagal memuat data guru',
                description: 'Tidak bisa memuat daftar guru untuk wali kelas.'
            });
        } finally {
            setIsLoading(false);
        }
    }
    fetchTeachers();
  },[toast]);

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      walikelasId: "",
    },
  });

  const onSubmit = async (values: ClassFormValues) => {
    setIsSubmitting(true);
    try {
        const response = await fetch('/api/classes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Gagal membuat kelas.');
        }
        toast({
            title: "Kelas Ditambahkan",
            description: `Kelas ${values.name} telah berhasil dibuat.`,
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
            <div className="flex justify-end">
                <Skeleton className="h-10 w-28" />
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
              <FormLabel>Nama Kelas</FormLabel>
              <FormControl>
                <Input placeholder="contoh, 10-A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="walikelasId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wali Kelas</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih seorang guru" />
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
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Tambah Kelas'}</Button>
        </div>
      </form>
    </Form>
  );
}
