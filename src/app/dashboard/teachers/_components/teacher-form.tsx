
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
import { classes } from "@/lib/data";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  nip: z.string().regex(/^\d+$/, "NIP must be a number.").min(10, "NIP must be at least 10 digits."),
  subject: z.string().min(3, "Subject must be at least 3 characters."),
  taughtClassIds: z.array(z.string()).refine(value => value.some(item => item), {
    message: "You have to select at least one class.",
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
      subject: "",
      taughtClassIds: [],
    },
  });

  const onSubmit = (values: TeacherFormValues) => {
    console.log("New Teacher Data:", values);
    toast({
        title: "Teacher Added",
        description: `${values.name} has been successfully registered.`,
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
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter teacher's full name" {...field} />
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
                <Input placeholder="Enter teacher's NIP" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Mathematics" {...field} />
              </FormControl>
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
                <FormLabel className="text-base">Classes Taught</FormLabel>
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
          <Button type="submit">Add Teacher</Button>
        </div>
      </form>
    </Form>
  );
}
