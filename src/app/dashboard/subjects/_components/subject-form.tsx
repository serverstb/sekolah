
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
  name: z.string().min(2, "Nama mata pelajaran minimal harus 2 karakter."),
});

type SubjectFormValues = z.infer<typeof formSchema>;

interface SubjectFormProps {
    onSuccess: () => void;
}

export function SubjectForm({ onSuccess }: SubjectFormProps) {
  const { toast } = useToast();
  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: SubjectFormValues) => {
    console.log("Data Mata Pelajaran Baru:", values);
    toast({
        title: "Mata Pelajaran Ditambahkan",
        description: `Mata pelajaran ${values.name} telah berhasil dibuat.`,
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
              <FormLabel>Nama Mata Pelajaran</FormLabel>
              <FormControl>
                <Input placeholder="contoh, Matematika" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Tambah Mata Pelajaran</Button>
        </div>
      </form>
    </Form>
  );
}
