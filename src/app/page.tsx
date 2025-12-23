'use client';

import { useEffect, useState } from 'react';
import { checkSupabaseConnection } from '@/lib/supabase-client';

export default function HomePage() {
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'successful' | 'failed'
  >('connecting');

  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await checkSupabaseConnection();
      setConnectionStatus(isConnected ? 'successful' : 'failed');
    };

    checkConnection();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Aplikasi Manajemen Sekolah
        </h1>
        <p className="text-lg text-muted-foreground">
          Selamat datang di sistem manajemen sekolah terpadu Anda.
        </p>
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 p-3 border rounded-lg bg-card">
            <span>Status Koneksi Database:</span>
            {connectionStatus === 'connecting' && (
              <span className="text-muted-foreground">Menghubungkan...</span>
            )}
            {connectionStatus === 'successful' && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span className="font-medium text-green-600">Berhasil</span>
              </div>
            )}
            {connectionStatus === 'failed' && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="font-medium text-red-600">Gagal</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Jika status koneksi <span className="text-red-600 font-semibold">Gagal</span>, pastikan Anda telah mengisi kredensial Supabase di file `.env` dan logika koneksi di `src/lib/supabase-client.ts` sudah benar.
        </p>
      </div>
    </div>
  );
}
