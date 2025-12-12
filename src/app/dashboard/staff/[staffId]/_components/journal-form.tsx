
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
import { type Staff, type Class, type TeachingJournal, type Subject } from "@/lib/types";

const formSchema = z.object({
  classId: z.string().nonempty("Silakan pilih kelas."),
  topic: z.string().min(3, "Topik pelajaran minimal harus 3 karakter."),
  notes: z.string().optional(),
  materialFile: z.any().optional(),
});

type JournalFormValues = z.infer<typeof formSchema>;

interface JournalFormProps {
  teacher: Staff;
  subject: Subject | undefined;
  taughtClasses: Class[];
  onSuccess: () => void;
  existingJournal?: TeachingJournal | null;
}

export function JournalForm({ teacher, subject, taughtClasses, onSuccess, existingJournal }: JournalFormProps) {
  const { toast } = useToast();
  const isEditMode = !!existingJournal;

  const form = useForm<JournalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classId: existingJournal?.classId || "",
      topic: existingJournal?.topic || "",
      notes: existingJournal?.notes || "",
      materialFile: undefined,
    },
  });

  const onSubmit = (values: JournalFormValues) => {
     const submissionData = {
      ...values,
      materialFile: values.materialFile?.[0]?.name || existingJournal?.materialFile || undefined,
    };

    if (isEditMode) {
      console.log("Memperbarui Entri Jurnal:", { ...existingJournal, ...submissionData });
      toast({
        title: "Entri Jurnal Diperbarui",
        description: `Entri untuk kelas ${taughtClasses.find(c => c.id === values.classId)?.name} telah diperbarui.`,
      });
    } else {
      console.log("Entri Jurnal Baru:", { ...submissionData, teacherId: teacher.id, subjectId: teacher.subjectId, date: new Date() });
      toast({
        title: "Entri Jurnal Ditambahkan",
        description: `Entri baru untuk kelas ${taughtClasses.find(c => c.id === values.classId)?.name} telah disimpan.`,
      });
    }
    onSuccess();
  };
  
  const fileRef = form.register("materialFile");

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
        <FormItem>
            <FormLabel>Mata Pelajaran</FormLabel>
            <Input
                readOnly
                disabled
                value={subject?.name || "Mata pelajaran tidak ditemukan"}
                className="font-medium bg-muted"
            />
        </FormItem>
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topik Pelajaran</FormLabel>
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
         <FormField
          control={form.control}
          name="materialFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unggah Materi (Opsional)</FormLabel>
              <FormControl>
                <Input type="file" {...fileRef} />
              </FormControl>
              {existingJournal?.materialFile && !field.value?.length && (
                  <p className="text-xs text-muted-foreground mt-1">
                    File saat ini: {existingJournal.materialFile}
                  </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-2">
          <Button type="submit">{isEditMode ? "Simpan Perubahan" : "Simpan Entri"}</Button>
        </div>
      </form>
    </Form>
  );
}
