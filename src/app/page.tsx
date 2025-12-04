
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

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=2070&auto=format&fit=crop"
          alt="Anak-anak di dalam kelas"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.7]"
          data-ai-hint="children classroom"
        />
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
             <div className="mb-4 flex justify-center">
              <AppLogo className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Absensi Sekolah</h1>
            <p className="text-balance text-muted-foreground">
              Login Admin untuk Manajemen Absensi
            </p>
          </div>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@sekolah.com"
                required
                defaultValue="admin@sekolah.com"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Lupa password?
                </Link>
              </div>
              <Input id="password" type="password" required defaultValue="password" />
            </div>
            <Button asChild type="submit" className="w-full">
              <Link href="/dashboard">Masuk</Link>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
