'use client';

import { supabase } from '@/lib/supabase-client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/icons';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Download } from 'lucide-react';

type Pendaftar = {
  id: number;
  created_at: string;
  nama_lengkap: string;
  sekolah_asal: string;
  status: 'pending' | 'diterima' | 'ditolak';
  url_akta_kelahiran: string;
  url_kartu_keluarga: string;
  url_rapor_terakhir: string;
};

export default function AdminDashboardPage() {
  const [pendaftar, setPendaftar] = useState<Pendaftar[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserAndData = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/admin/login');
        return;
      }
      setUser(session.user);
      await fetchPendaftar();
      setLoading(false);
    };

    fetchUserAndData();
  }, [router]);

  async function fetchPendaftar() {
    const { data, error } = await supabase
      .from('pendaftaran')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pendaftar:', error);
      toast({
        variant: 'destructive',
        title: 'Gagal Memuat Data',
        description: 'Tidak dapat mengambil data pendaftar dari server.',
      });
    } else if (data) {
      setPendaftar(data);
    }
  }

  const handleUpdateStatus = async (id: number, newStatus: 'diterima' | 'ditolak') => {
    const { error } = await supabase
      .from('pendaftaran')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Gagal Memperbarui Status',
        description: error.message,
      });
    } else {
      toast({
        title: 'Status Berhasil Diperbarui',
        description: `Status pendaftar telah diubah menjadi ${newStatus}.`,
      });
      await fetchPendaftar(); // Refresh data
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Memuat dasbor...</div>;
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'diterima':
        return 'default';
      case 'ditolak':
        return 'destructive';
      case 'pending':
      default:
        return 'secondary';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <AppLogo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold tracking-tight text-slate-800">Admin Sekolah Ceria</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:inline-block">
              Login sebagai {user?.email}
            </span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tight mb-8">Dasbor Pendaftaran Siswa Baru</h1>
          <div className="rounded-xl border shadow-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead className="hidden md:table-cell">Sekolah Asal</TableHead>
                  <TableHead className="hidden lg:table-cell">Tanggal Daftar</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendaftar.length > 0 ? (
                  pendaftar.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nama_lengkap}</TableCell>
                      <TableCell className="hidden md:table-cell">{item.sekolah_asal}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getStatusVariant(item.status)} className="capitalize">
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Buka menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleUpdateStatus(item.id, 'diterima')}>
                              Setujui
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(item.id, 'ditolak')}>
                              Tolak
                            </DropdownMenuItem>
                             <DropdownMenuItem asChild>
                                <a href={item.url_akta_kelahiran} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                <Download className="h-4 w-4" /> Akta
                                </a>
                            </DropdownMenuItem>
                             <DropdownMenuItem asChild>
                                 <a href={item.url_kartu_keluarga} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                <Download className="h-4 w-4" /> KK
                                </a>
                            </DropdownMenuItem>
                             <DropdownMenuItem asChild>
                                 <a href={item.url_rapor_terakhir} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                <Download className="h-4 w-4" /> Rapor
                                </a>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Belum ada pendaftar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
