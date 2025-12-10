// src/app/test-db/page.tsx

import db from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

async function testDbConnection() {
  try {
    await db.query('SELECT 1');
    // Jika tidak ada error, koneksi berhasil
    return { success: true, message: 'Koneksi ke database berhasil!' };
  } catch (error: any) {
    console.error('Database connection test failed:', error);
    return { success: false, message: 'Gagal terhubung ke database.', error: error.message };
  }
}

export default async function TestDbPage() {
  const { success, message, error } = await testDbConnection();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Uji Koneksi Database</CardTitle>
          <CardDescription className="text-center">
            Halaman ini memeriksa apakah aplikasi dapat terhubung ke database MySQL.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="flex flex-col items-center gap-4 text-center text-green-600">
              <CheckCircle className="h-16 w-16" />
              <p className="text-lg font-semibold">{message}</p>
              <p className="text-sm text-muted-foreground">
                Kredensial dari file `.env` Anda sudah benar.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center text-destructive">
              <XCircle className="h-16 w-16" />
              <p className="text-lg font-semibold">{message}</p>
              <div className="mt-2 w-full rounded-md bg-destructive/10 p-3 text-left text-xs">
                <p className="font-bold">Detail Error:</p>
                <pre className="mt-1 whitespace-pre-wrap font-mono">{error}</pre>
              </div>
               <p className="text-sm text-muted-foreground mt-2">
                Pastikan kredensial di file `.env` sudah benar dan database dapat diakses dari aplikasi ini.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <Button variant="link" asChild className="mt-6">
        <Link href="/">Kembali ke Halaman Login</Link>
      </Button>
    </div>
  );
}
