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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { teachers } from "@/lib/data";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "teacher" | undefined>();
  const [teacherId, setTeacherId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!role) {
      toast({
        variant: "destructive",
        title: "Pendaftaran Gagal",
        description: "Silakan pilih peran terlebih dahulu.",
      });
      setIsLoading(false);
      return;
    }
     if (role === 'teacher' && !teacherId) {
      toast({
        variant: "destructive",
        title: "Pendaftaran Gagal",
        description: "Silakan pilih guru yang terkait.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, teacherId: role === 'teacher' ? teacherId : null }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan saat mendaftar.');
      }

      toast({
        title: "Pendaftaran Berhasil",
        description: `Akun untuk ${email} telah dibuat. Silakan masuk.`,
      });

      router.push('/');

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Pendaftaran Gagal",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[380px] gap-6">
          <div className="grid gap-2 text-center">
             <div className="mb-4 flex justify-center">
              <AppLogo className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Buat Akun Baru</h1>
            <p className="text-balance text-muted-foreground">
              Isi form di bawah untuk mendaftar
            </p>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="pengguna@sekolah.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="role">Peran</Label>
                <Select value={role} onValueChange={(value) => setRole(value as any)}>
                    <SelectTrigger id="role">
                        <SelectValue placeholder="Pilih peran pengguna" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {role === 'teacher' && (
                <div className="grid gap-2">
                    <Label htmlFor="teacherId">Guru Terkait</Label>
                    <Select value={teacherId} onValueChange={setTeacherId}>
                        <SelectTrigger id="teacherId">
                            <SelectValue placeholder="Pilih guru" />
                        </SelectTrigger>
                        <SelectContent>
                        {teachers.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Daftar'}
            </Button>
            <div className="mt-4 text-center text-sm">
                Sudah punya akun?{" "}
                <Link href="/" className="underline">
                    Masuk
                </Link>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
          alt="Siswa sedang belajar bersama"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.7]"
          data-ai-hint="students studying"
        />
      </div>
    </div>
  );
}
