
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
  classId: z.string().nonempty("Please select a class."),
  subjectMatter: z.string().min(3, "Subject matter must be at least 3 characters."),
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
    console.log("New Journal Entry:", { ...values, teacherId: teacher.id, date: new Date() });
    toast({
      title: "Journal Entry Added",
      description: `New entry for class ${taughtClasses.find(c => c.id === values.classId)?.name} has been saved.`,
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
              <FormLabel>Class</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
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
              <FormLabel>Subject Matter</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Introduction to Algebra" {...field} />
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
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional notes about the class session..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-2">
          <Button type="submit">Save Entry</Button>
        </div>
      </form>
    </Form>
  );
}
