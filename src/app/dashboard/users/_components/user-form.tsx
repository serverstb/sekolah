
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
import { teachers } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { User } from "../page";

const formSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  password: z.string().optional(),
  role: z.enum(["admin", "teacher"], { required_error: "Peran harus dipilih." }),
  teacherId: z.string().optional(),
}).refine(data => {
    if (data.role === 'teacher') {
        return !!data.teacherId;
    }
    return true;
}, {
    message: "Guru harus dipilih untuk peran 'teacher'.",
    path: ["teacherId"],
});


type UserFormValues = z.infer<typeof formSchema>;

interface UserFormProps {
    onSuccess: () => void;
    existingUser?: User | null;
}

export function UserForm({ onSuccess, existingUser }: UserFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!existingUser;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: existingUser?.email || "",
      password: "",
      role: existingUser?.role || undefined,
      teacherId: existingUser?.teacherId || "",
    },
  });

  const onSubmit = async (values: UserFormValues) => {
    setIsLoading(true);

    // Make sure teacherId is null if role is not teacher
    if (values.role !== 'teacher') {
        values.teacherId = undefined;
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
        setIsLoading(false);
    }
  };

  const selectedRole = form.watch("role");

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
                name="teacherId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Guru Terkait</FormLabel>
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
        )}
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : (isEditMode ? "Simpan Perubahan" : "Tambah Pengguna")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
