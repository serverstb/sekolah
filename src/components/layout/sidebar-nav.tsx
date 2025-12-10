
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ScanLine, Users, UserSquare, School, BookText, UserPlus, Library, Calendar, Shield } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const navItems = [
  {
    href: "/dashboard",
    label: "Dasbor",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/scan",
    label: "Pindai Absensi",
    icon: ScanLine,
  },
  {
    href: "/dashboard/admissions",
    label: "Penerimaan Siswa",
    icon: UserPlus,
  },
  {
    href: "/dashboard/students",
    label: "Siswa",
    icon: Users,
  },
  {
    href: "/dashboard/teachers",
    label: "Guru",
    icon: UserSquare,
  },
  {
    href: "/dashboard/classes",
    label: "Kelas",
    icon: School,
  },
   {
    href: "/dashboard/subjects",
    label: "Mata Pelajaran",
    icon: Library,
  },
  {
    href: "/dashboard/schedules",
    label: "Jadwal Pelajaran",
    icon: Calendar,
  },
  {
    href: "/dashboard/report",
    label: "Laporan Absensi",
    icon: BookText,
  },
  {
    href: "/dashboard/users",
    label: "Pengguna",
    icon: Shield,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(item.href) && (item.href === '/dashboard' ? pathname === item.href : true)}
            tooltip={item.label}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
