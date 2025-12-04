
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
  name: z.string().min(2, "Class name must be at least 2 characters."),
  walikelasId: z.string().nonempty("Please select a wali kelas."),
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
    console.log("New Class Data:", values);
    toast({
        title: "Class Added",
        description: `Class ${values.name} has been successfully created.`,
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
              <FormLabel>Class Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 10-A" {...field} />
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
              <FormLabel>Wali Kelas (Homeroom Teacher)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a teacher" />
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
          <Button type="submit">Add Class</Button>
        </div>
      </form>
    </Form>
  );
}
