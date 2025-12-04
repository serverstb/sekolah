
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

const formSchema = z.object({
  name: z.string().min(2, "Nama harus memiliki minimal 2 karakter."),
  previousSchool: z.string().min(3, "Sekolah asal harus diisi."),
  parentName: z.string().min(2, "Nama orang tua harus diisi."),
  contact: z.string().min(10, "Nomor kontak harus diisi."),
});

type AdmissionFormValues = z.infer<typeof formSchema>;

interface AdmissionFormProps {
    onSuccess: () => void;
}

export function AdmissionForm({ onSuccess }: AdmissionFormProps) {
  const { toast } = useToast();
  const form = useForm<AdmissionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      previousSchool: "",
      parentName: "",
      contact: "",
    },
  });

  const onSubmit = (values: AdmissionFormValues) => {
    console.log("Data Pendaftar Baru:", values);
    toast({
        title: "Pendaftar Ditambahkan",
        description: `${values.name} telah berhasil terdaftar.`,
    });
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Pendaftar</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama lengkap pendaftar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="previousSchool"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sekolah Asal</FormLabel>
              <FormControl>
                <Input placeholder="contoh, SMPN 1 Jakarta" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="parentName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Orang Tua</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama orang tua" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Kontak</FormLabel>
              <FormControl>
                <Input placeholder="contoh, 081234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit">Tambah Pendaftar</Button>
        </div>
      </form>
    </Form>
  );
}
