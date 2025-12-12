"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, MoreHorizontal, Users, UserSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StaffForm } from "./_components/staff-form";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export type Staff = {
  id: string;
  name: string;
  role: 'teacher' | 'employee';
  nip?: string;
  subjectId?: string;
  subjectName?: string;
  jobTitle?: string;
  avatarUrl: string;
  avatarHint: string;
  taughtClassIds: string[];
};

export type Class = {
    id: string;
    name: string;
};

const ITEMS_PER_PAGE = 5;

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    try {
        const [staffRes, classesRes] = await Promise.all([
            fetch('/api/staff'),
            fetch('/api/classes'),
        ]);

        if (!staffRes.ok || !classesRes.ok) {
            throw new Error('Gagal memuat data');
        }

        const { staff: staffData } = await staffRes.json();
        const { classes: classData } = await classesRes.json();
        
        setStaff(staffData);
        setClasses(classData);

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
        });
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredStaff = useMemo(() => {
      if (activeTab === 'all') return staff;
      return staff.filter(s => s.role === activeTab);
  }, [staff, activeTab]);

  const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);

  const paginatedStaff = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredStaff.slice(startIndex, endIndex);
  }, [currentPage, filteredStaff]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleSuccess = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    fetchData();
  };

  const handleEditClick = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedStaff) return;
    
    try {
        const response = await fetch(`/api/staff/${selectedStaff.id}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Gagal menghapus data.');
        }
        toast({
            title: "Data Dihapus",
            description: `Data untuk "${selectedStaff.name}" telah dihapus.`,
        });
        fetchData();
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Gagal Menghapus',
            description: error.message,
        })
    } finally {
        setIsAlertOpen(false);
        setSelectedStaff(null);
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manajemen Guru & Karyawan</CardTitle>
            <CardDescription>
              Lihat dan kelola semua guru dan karyawan.
            </CardDescription>
          </div>
          <Button onClick={() => { setSelectedStaff(null); setIsAddDialogOpen(true); }}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah
          </Button>
        </CardHeader>
        <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                    <TabsTrigger value="all"><Users className="mr-2 h-4 w-4"/>Semua</TabsTrigger>
                    <TabsTrigger value="teacher"><UserSquare className="mr-2 h-4 w-4"/>Guru</TabsTrigger>
                    <TabsTrigger value="employee"><Users className="mr-2 h-4 w-4"/>Karyawan</TabsTrigger>
                </TabsList>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Detail</TableHead>
                <TableHead>Kelas yang Diajar</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                    </TableRow>
                ))
              ) : paginatedStaff.map((staffMember) => {
                return (
                    <TableRow key={staffMember.id}>
                    <TableCell>
                        <Avatar>
                        <AvatarImage
                            src={staffMember.avatarUrl}
                            alt={staffMember.name}
                            data-ai-hint={staffMember.avatarHint}
                        />
                        <AvatarFallback>{staffMember.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{staffMember.name}</TableCell>
                    <TableCell>
                        <Badge variant={staffMember.role === 'teacher' ? 'secondary' : 'outline'}>
                            {staffMember.role === 'teacher' ? 'Guru' : 'Karyawan'}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        {staffMember.role === 'teacher' ? (
                            <span>NIP: {staffMember.nip} | {staffMember.subjectName || 'N/A'}</span>
                        ) : (
                            <span>Jabatan: {staffMember.jobTitle}</span>
                        )}
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-1">
                        {staffMember.role === 'teacher' && staffMember.taughtClassIds && staffMember.taughtClassIds.map((classId) => {
                            const taughtClass = classes.find(
                            (c) => c.id === classId
                            );
                            return taughtClass ? (
                            <Badge variant="secondary" key={classId}>
                                {taughtClass.name}
                            </Badge>
                            ) : null;
                        })}
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                            {staffMember.role === 'teacher' && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/dashboard/staff/${staffMember.id}`}>
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        Jurnal
                                    </Link>
                                </Button>
                            )}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Buka menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditClick(staffMember)}>
                                    Ubah
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteClick(staffMember)}>
                                    Hapus
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </TableCell>
                    </TableRow>
                )
              })}
            </TableBody>
          </Table>
          </Tabs>
        </CardContent>
         <CardFooter className="flex items-center justify-between pt-6">
          <div className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Berikutnya
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={isEditDialogOpen ? setIsEditDialogOpen : setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditDialogOpen ? 'Ubah Data' : 'Tambah Guru atau Karyawan'}</DialogTitle>
            <DialogDescription>
              {isEditDialogOpen ? `Perbarui detail untuk ${selectedStaff?.name}.` : 'Isi formulir di bawah ini untuk mendaftarkan data baru.'}
            </DialogDescription>
          </DialogHeader>
          <StaffForm onSuccess={handleSuccess} existingStaff={selectedStaff} />
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data untuk
              "{selectedStaff?.name}" secara permanen beserta akun pengguna yang terkait.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Lanjutkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
