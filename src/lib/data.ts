import { PlaceHolderImages } from "./placeholder-images";

export type Student = {
  id: string;
  name: string;
  class: string;
  avatarUrl: string;
  avatarHint: string;
};

export type AttendanceRecord = {
  id: string;
  studentId: string;
  timestamp: Date;
  status: "Present" | "Late" | "Absent";
};

export type Teacher = {
  id: string;
  name: string;
  nip: string;
  subject: string;
  avatarUrl: string;
  avatarHint: string;
};

export type Class = {
  id: string;
  name: string;
  walikelas: string;
  studentCount: number;
};


const placeholderAvatars = PlaceHolderImages.filter(img => img.id.startsWith("student-avatar-"));
const teacherPlaceHolderAvatars = PlaceHolderImages.filter(img => img.id.startsWith("teacher-avatar-"));

export const students: Student[] = [
  { id: "STU-001", name: "Ahmad Dahlan", class: "10-A", avatarUrl: placeholderAvatars[0]?.imageUrl || "", avatarHint: "person portrait" },
  { id: "STU-002", name: "Budi Santoso", class: "10-B", avatarUrl: placeholderAvatars[1]?.imageUrl || "", avatarHint: "person portrait" },
  { id: "STU-003", name: "Citra Lestari", class: "11-A", avatarUrl: placeholderAvatars[2]?.imageUrl || "", avatarHint: "person portrait" },
  { id: "STU-004", name: "Dewi Anggraini", class: "11-A", avatarUrl: placeholderAvatars[3]?.imageUrl || "", avatarHint: "person portrait" },
  { id: "STU-005", name: "Eko Prasetyo", class: "12-C", avatarUrl: placeholderAvatars[4]?.imageUrl || "", avatarHint: "person portrait" },
  { id: "STU-006", name: "Fitriani", class: "12-C", avatarUrl: placeholderAvatars[5]?.imageUrl || "", avatarHint: "person portrait" },
  { id: "STU-007", name: "Gilang Ramadhan", class: "10-B", avatarUrl: placeholderAvatars[6]?.imageUrl || "", avatarHint: "person portrait" },
  { id: "STU-008", name: "Herlina", class: "11-B", avatarUrl: placeholderAvatars[7]?.imageUrl || "", avatarHint: "person portrait" },
];

export const teachers: Teacher[] = [
    { id: "TCH-001", name: "Dr. Siti Aminah", nip: "198001012005012001", subject: "Mathematics", avatarUrl: teacherPlaceHolderAvatars[0]?.imageUrl || "", avatarHint: "woman portrait" },
    { id: "TCH-002", name: "Drs. Bambang Wijoyo", nip: "197505102003121002", subject: "Physics", avatarUrl: teacherPlaceHolderAvatars[1]?.imageUrl || "", avatarHint: "man portrait" },
    { id: "TCH-003", name: "Retno Wulandari, S.Pd.", nip: "198811202010012003", subject: "Indonesian", avatarUrl: teacherPlaceHolderAvatars[2]?.imageUrl || "", avatarHint: "woman portrait" },
    { id: "TCH-004", name: "Agus Setiawan, M.Kom.", nip: "198208152008031004", subject: "Computer Science", avatarUrl: teacherPlaceHolderAvatars[3]?.imageUrl || "", avatarHint: "man portrait" },
];

export const classes: Class[] = [
    { id: "CLS-001", name: "10-A", walikelas: "Dr. Siti Aminah", studentCount: 35 },
    { id: "CLS-002", name: "10-B", walikelas: "Drs. Bambang Wijoyo", studentCount: 34 },
    { id: "CLS-003", name: "11-A", walikelas: "Retno Wulandari, S.Pd.", studentCount: 32 },
    { id: "CLS-004", name: "11-B", walikelas: "Agus Setiawan, M.Kom.", studentCount: 33 },
    { id: "CLS-005", name: "12-A", walikelas: "Dr. Siti Aminah", studentCount: 30 },
];


function getRandomTime(date: Date, startHour: number, endHour: number): Date {
  const result = new Date(date);
  const randomHour = Math.floor(Math.random() * (endHour - startHour)) + startHour;
  const randomMinute = Math.floor(Math.random() * 60);
  result.setHours(randomHour, randomMinute, 0, 0);
  return result;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

export const attendanceRecords: AttendanceRecord[] = [
  { id: "REC-001", studentId: "STU-001", timestamp: getRandomTime(today, 7, 8), status: "Present" },
  { id: "REC-002", studentId: "STU-002", timestamp: getRandomTime(today, 7, 8), status: "Late" },
  { id: "REC-003", studentId: "STU-003", timestamp: getRandomTime(today, 7, 8), status: "Present" },
  { id: "REC-004", studentId: "STU-005", timestamp: getRandomTime(today, 7, 8), status: "Present" },
  { id: "REC-005", studentId: "STU-007", timestamp: getRandomTime(today, 7, 8), status: "Present" },
  { id: "REC-006", studentId: "STU-008", timestamp: getRandomTime(today, 7, 8), status: "Late" },
];
