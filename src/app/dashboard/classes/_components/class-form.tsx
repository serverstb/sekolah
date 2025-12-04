
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
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      walikelasId: "",
    },
  });

  const onSubmit = (values: ClassFormValues) => {
    console.log("Data Kelas Baru:", values);
    toast({
        title: "Kelas Ditambahkan",
        description: `Kelas ${values.name} telah berhasil dibuat.`,
    });
    onSuccess();
  };

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
          <Button type="submit">Tambah Kelas</Button>
        </div>
      </form>
    </Form>
  );
}
