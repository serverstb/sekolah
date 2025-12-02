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

const placeholderAvatars = PlaceHolderImages.filter(img => img.id.startsWith("student-avatar-"));

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
