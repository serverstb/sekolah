
"use client";

import Link from "next/link";
import Image from "next/image";
import { AppLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


const formSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(1, "Password tidak boleh kosong."),
});

type LoginFormValues = z.infer<typeof formSchema>;


export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });


  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan.');
      }

      toast({
        title: "Login Berhasil",
        description: "Anda akan diarahkan ke dasbor.",
      });

      router.push('/dashboard');

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086&auto=format&fit=crop"
          alt="Gedung sekolah"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.7]"
          data-ai-hint="school building"
        />
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
             <div className="mb-4 flex justify-center">
              <AppLogo className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Sekolah</h1>
            <p className="text-balance text-muted-foreground">
              Login untuk Manajemen Sekolah
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="pengguna@sekolah.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Password"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                {isLoading ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>
          </Form>
           <div className="mt-4 text-center text-sm">
            Belum punya akun?{" "}
            <Link href="/register" className="underline">
              Daftar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
