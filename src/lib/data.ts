import { PlaceHolderImages } from "./placeholder-images";

export type Student = {
  id: string;
  name: string;
  classId: string; // Changed from class
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
  taughtClassIds: string[];
};

export type Class = {
  id: string;
  name: string;
  walikelasId: string; // Changed from walikelas
  studentCount: number;
};


const placeholderAvatars = PlaceHolderImages.filter(img => img.id.startsWith("student-avatar-"));
const teacherPlaceHolderAvatars = PlaceHolderImages.filter(img => img.id.startsWith("teacher-avatar-"));

export const teachers: Teacher[] = [
    { id: "TCH-001", name: "Dr. Siti Aminah", nip: "198001012005012001", subject: "Mathematics", avatarUrl: teacherPlaceHolderAvatars[0]?.imageUrl || "", avatarHint: "woman portrait", taughtClassIds: ["CLS-001", "CLS-003", "CLS-005"] },
    { id: "TCH-002", name: "Drs. Bambang Wijoyo", nip: "197505102003121002", subject: "Physics", avatarUrl: teacherPlaceHolderAvatars[1]?.imageUrl || "", avatarHint: "man portrait", taughtClassIds: ["CLS-002", "CLS-004"] },
    { id: "TCH-003", name: "Retno Wulandari, S.Pd.", nip: "198811202010012003", subject: "Indonesian", avatarUrl: teacherPlaceHolderAvatars[2]?.imageUrl || "", avatarHint: "woman portrait", taughtClassIds: ["CLS-001", "CLS-002", "CLS-003"] },
    { id: "TCH-004", name: "Agus Setiawan, M.Kom.", nip: "198208152008031004", subject: "Computer Science", avatarUrl: teacherPlaceHolderAvatars[3]?.imageUrl || "", avatarHint: "man portrait", taughtClassIds: ["CLS-004", "CLS-005"] },
];

export const classes: Class[] = [
    { id: "CLS-001", name: "10-A", walikelasId: "TCH-001", studentCount: 35 },
    { id: "CLS-002", name: "10-B", walikelasId: "TCH-002", studentCount: 34 },
    { id: "CLS-003", name: "11-A", walikelasId: "TCH-003", studentCount: 32 },
    { id: "CLS-004", name: "11-B", walikelasId: "TCH-004", studentCount: 33 },
    { id: "CLS-005", name: "12-A", walikelasId: "TCH-001", studentCount: 30 },
];

export const students: Student[] = [
  { id: "STU-001", name: "Ahmad Dahlan", classId: "CLS-001", avatarUrl: placeholderAvatars[0]?.imageUrl || "", avatarHint: "person portrait" },
  { id: "STU-002", name: "Budi Santoso", classId: "CLS-002", avatarUrl: placeholderAvatars[1]?.imageUrl || "", avatarHint: "person portrait" },
  { id: "STU-003", name: "Citra Lestari", classId: "CLS-003", avatarUrl: placeholderAvatars[2]?.imageUrl || "", avatarHint: "person portrait" },
  { id: "STU-004", name: "Dewi Anggraini", classId: "CLS-003", avatarUrl: placeholderAvatars[3]?.imageUrl || "", avatarHint: "person portrait" },
  { id: "STU-005", name: "Eko Prasetyo", classId: "CLS-005", avatarUrl: placeholderAvatars[4]?.imageUrl || "", avatarHint: "person portrait" },
  { id: "STU-006", name: "Fitriani", classId: "CLS-005", avatarUrl: placeholderAvatars[5]?.imageUrl || "", avatarHint: "person portrait" },
  { id: "STU-007", name: "Gilang Ramadhan", classId: "CLS-002", avatarUrl: placeholderAvatars[6]?.imageUrl || "", avatarHint: "person portrait" },
  { id: "STU-008", name: "Herlina", classId: "CLS-004", avatarUrl: placeholderAvatars[7]?.imageUrl || "", avatarHint: "person portrait" },
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