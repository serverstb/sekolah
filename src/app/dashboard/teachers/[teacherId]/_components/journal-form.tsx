
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { type Teacher, type Class } from "@/lib/data";

const formSchema = z.object({
  classId: z.string().nonempty("Silakan pilih kelas."),
  subjectMatter: z.string().min(3, "Materi pelajaran minimal harus 3 karakter."),
  notes: z.string().optional(),
});

type JournalFormValues = z.infer<typeof formSchema>;

interface JournalFormProps {
  teacher: Teacher;
  taughtClasses: Class[];
  onSuccess: () => void;
}

export function JournalForm({ teacher, taughtClasses, onSuccess }: JournalFormProps) {
  const { toast } = useToast();
  const form = useForm<JournalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classId: "",
      subjectMatter: "",
      notes: "",
    },
  });

  const onSubmit = (values: JournalFormValues) => {
    console.log("Entri Jurnal Baru:", { ...values, teacherId: teacher.id, date: new Date() });
    toast({
      title: "Entri Jurnal Ditambahkan",
      description: `Entri baru untuk kelas ${taughtClasses.find(c => c.id === values.classId)?.name} telah disimpan.`,
    });
    onSuccess();
  };

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
                  {taughtClasses.map((cls) => (
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
          name="subjectMatter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Materi Pelajaran</FormLabel>
              <FormControl>
                <Input placeholder="contoh, Pengenalan Aljabar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Catatan tambahan mengenai sesi kelas..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-2">
          <Button type="submit">Simpan Entri</Button>
        </div>
      </form>
    </Form>
  );
}
