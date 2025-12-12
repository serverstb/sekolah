
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
import { useState, useEffect } from "react";
import type { User } from "../page";
import type { Staff } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  password: z.string().optional(),
  role: z.enum(["admin", "teacher"], { required_error: "Peran harus dipilih." }),
  staffId: z.string().optional(),
}).refine(data => {
    if (data.role === 'teacher') {
        return !!data.staffId;
    }
    return true;
}, {
    message: "Data guru harus dipilih untuk peran 'teacher'.",
    path: ["staffId"],
});


type UserFormValues = z.infer<typeof formSchema>;

interface UserFormProps {
    onSuccess: () => void;
    existingUser?: User | null;
}

export function UserForm({ onSuccess, existingUser }: UserFormProps) {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Staff[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!existingUser;
  
  useEffect(() => {
    async function fetchTeachers() {
      setIsLoadingData(true);
      try {
        const res = await fetch('/api/staff');
        const data = await res.json();
        if (!res.ok) throw new Error('Gagal memuat data staf');
        setTeachers((data.staff || []).filter((s: Staff) => s.role === 'teacher'));
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Tidak bisa memuat daftar guru.',
        });
      } finally {
        setIsLoadingData(false);
      }
    }
    fetchTeachers();
  }, [toast]);


  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: existingUser?.email || "",
      password: "",
      role: existingUser?.role || undefined,
      staffId: existingUser?.staffId || "",
    },
  });

  const onSubmit = async (values: UserFormValues) => {
    setIsSubmitting(true);

    // Make sure staffId is null if role is not teacher
    if (values.role !== 'teacher') {
        values.staffId = undefined;
    }
    
    // In edit mode, if password is empty, don't send it
    const payload: any = { ...values };
    if (isEditMode && !payload.password) {
        delete payload.password;
    }

    try {
        const response = await fetch(`/api/users${isEditMode ? `?id=${existingUser.id}` : ''}`, {
            method: isEditMode ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Terjadi kesalahan.');
        }

        toast({
            title: isEditMode ? "Pengguna Diperbarui" : "Pengguna Ditambahkan",
            description: `${values.email} telah berhasil ${isEditMode ? 'diperbarui' : 'ditambahkan'}.`,
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
  
  if (isLoadingData) {
      return <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="flex justify-end pt-2">
            <Skeleton className="h-10 w-32" />
          </div>
      </div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contoh@sekolah.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder={isEditMode ? "Kosongkan jika tidak ingin mengubah" : "Masukkan password"} {...field} />
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
                    <SelectValue placeholder="Pilih peran pengguna" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {selectedRole === 'teacher' && (
             <FormField
                control={form.control}
                name="staffId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Data Guru Terkait</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih data guru" />
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
        )}
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : (isEditMode ? "Simpan Perubahan" : "Tambah Pengguna")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
