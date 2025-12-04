
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
import { Checkbox } from "@/components/ui/checkbox";
import { classes, subjects } from "@/lib/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, "Nama minimal harus 2 karakter."),
  nip: z.string().regex(/^\d+$/, "NIP harus berupa angka.").min(10, "NIP minimal harus 10 digit."),
  subjectId: z.string().nonempty("Silakan pilih mata pelajaran."),
  taughtClassIds: z.array(z.string()).refine(value => value.some(item => item), {
    message: "Anda harus memilih setidaknya satu kelas.",
  }),
});

type TeacherFormValues = z.infer<typeof formSchema>;

interface TeacherFormProps {
    onSuccess: () => void;
}

export function TeacherForm({ onSuccess }: TeacherFormProps) {
  const { toast } = useToast();
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      nip: "",
      subjectId: "",
      taughtClassIds: [],
    },
  });

  const onSubmit = (values: TeacherFormValues) => {
    console.log("Data Guru Baru:", values);
    toast({
        title: "Guru Ditambahkan",
        description: `${values.name} telah berhasil terdaftar.`,
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
                                  ? field.onChange([...field.value, item.id])
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
        <div className="flex justify-end">
          <Button type="submit">Tambah Guru</Button>
        </div>
      </form>
    </Form>
  );
}
