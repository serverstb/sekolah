
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const currentYear = new Date().getFullYear();
const academicYears = Array.from({ length: 3 }, (_, i) => `${currentYear + i}/${currentYear + i + 1}`);

const formSchema = z.object({
  name: z.string().min(2, "Nama harus memiliki minimal 2 karakter."),
  previousSchool: z.string().min(3, "Sekolah asal harus diisi."),
  birthPlace: z.string().min(2, "Tempat lahir harus diisi."),
  birthDate: z.date({
    required_error: "Tanggal lahir harus diisi.",
  }),
  gender: z.string().nonempty("Jenis kelamin harus dipilih."),
  address: z.string().min(10, "Alamat harus diisi."),
  parentName: z.string().min(2, "Nama orang tua harus diisi."),
  contact: z.string().min(10, "Nomor kontak harus diisi."),
  academicYear: z.string().nonempty("Tahun ajaran harus dipilih."),
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
      birthPlace: "",
      gender: "",
      address: "",
      parentName: "",
      contact: "",
      academicYear: "",
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap Pendaftar</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama lengkap" {...field} />
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
            name="academicYear"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Tahun Ajaran</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih tahun ajaran" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {academicYears.map(year => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="birthPlace"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Tempat Lahir</FormLabel>
                <FormControl>
                    <Input placeholder="contoh, Jakarta" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel className="mb-1.5">Tanggal Lahir</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP", { locale: id })
                            ) : (
                                <span>Pilih tanggal</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Jenis Kelamin</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                        <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat Lengkap</FormLabel>
              <FormControl>
                <Textarea placeholder="Masukkan alamat lengkap" {...field} />
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
              <FormLabel>Nama Orang Tua / Wali</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama orang tua atau wali" {...field} />
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
              <FormLabel>Nomor Kontak Orang Tua / Wali</FormLabel>
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

    