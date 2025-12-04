import { PlaceHolderImages } from "./placeholder-images";
import { subDays } from "date-fns";


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

export type Employee = {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
    avatarHint: string;
}

export type TeacherAttendanceRecord = {
  id: string;
  teacherId: string;
  timestamp: Date;
  status: "Present" | "Late" | "Absent";
};

export type EmployeeAttendanceRecord = {
  id: string;
  employeeId: string;
  timestamp: Date;
  status: "Present" | "Late" | "Absent";
};

export type AdmissionStatus = "Pending" | "Accepted" | "Rejected";

export type NewStudentApplicant = {
  id: string;
  name: string;
  previousSchool: string;
  registrationDate: Date;
  status: AdmissionStatus;
  parentName: string;
  contact: string;
};

export type TeachingJournal = {
  id: string;
  teacherId: string;
  classId: string;
  date: Date;
  subjectMatter: string;
  notes: string;
};


const placeholderAvatars = PlaceHolderImages.filter(img => img.id.startsWith("student-avatar-"));
const teacherPlaceHolderAvatars = PlaceHolderImages.filter(img => img.id.startsWith("teacher-avatar-"));
const employeePlaceHolderAvatars = PlaceHolderImages.filter(img => img.id.startsWith("employee-avatar-"));


export const teachers: Teacher[] = [
    { id: "TCH-001", name: "Dr. Siti Aminah", nip: "198001012005012001", subject: "Mathematics", avatarUrl: teacherPlaceHolderAvatars[0]?.imageUrl || "", avatarHint: "woman portrait", taughtClassIds: ["CLS-001", "CLS-003", "CLS-005"] },
    { id: "TCH-002", name: "Drs. Bambang Wijoyo", nip: "197505102003121002", subject: "Physics", avatarUrl: teacherPlaceHolderAvatars[1]?.imageUrl || "", avatarHint: "man portrait", taughtClassIds: ["CLS-002", "CLS-004"] },
    { id: "TCH-003", name: "Retno Wulandari, S.Pd.", nip: "198811202010012003", subject: "Indonesian", avatarUrl: teacherPlaceHolderAvatars[2]?.imageUrl || "", avatarHint: "woman portrait", taughtClassIds: ["CLS-001", "CLS-002", "CLS-003"] },
    { id: "TCH-004", name: "Agus Setiawan, M.Kom.", nip: "198208152008031004", subject: "Computer Science", avatarUrl: teacherPlaceHolderAvatars[3]?.imageUrl || "", avatarHint: "man portrait", taughtClassIds: ["CLS-004", "CLS-005"] },
];

export const employees: Employee[] = [
    { id: "EMP-001", name: "Joko Susilo", role: "Administration", avatarUrl: employeePlaceHolderAvatars[0]?.imageUrl || "", avatarHint: "man portrait" },
    { id: "EMP-002", name: "Sri Rahayu", role: "Librarian", avatarUrl: employeePlaceHolderAvatars[1]?.imageUrl || "", avatarHint: "woman portrait" },
    { id: "EMP-003", name: "Teguh Santoso", role: "Security", avatarUrl: employeePlaceHolderAvatars[2]?.imageUrl || "", avatarHint: "man portrait" },
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

export const teacherAttendanceRecords: TeacherAttendanceRecord[] = [
    { id: "TREC-001", teacherId: "TCH-001", timestamp: getRandomTime(today, 7, 8), status: "Present" },
    { id: "TREC-002", teacherId: "TCH-002", timestamp: getRandomTime(today, 7, 8), status: "Present" },
    { id: "TREC-003", teacherId: "TCH-003", timestamp: getRandomTime(today, 7, 9), status: "Late" },
];

export const employeeAttendanceRecords: EmployeeAttendanceRecord[] = [
    { id: "EREC-001", employeeId: "EMP-001", timestamp: getRandomTime(today, 8, 9), status: "Present" },
    { id: "EREC-002", employeeId: "EMP-002", timestamp: getRandomTime(today, 8, 9), status: "Present" },
];

export const newStudentApplicants: NewStudentApplicant[] = [
  { id: "APP-001", name: "Indah Permatasari", previousSchool: "SMPN 1 Jakarta", registrationDate: subDays(today, 5), status: "Pending", parentName: "Haryono", contact: "081234567890" },
  { id: "APP-002", name: "Rizky Alamsyah", previousSchool: "SMP Bintang Harapan", registrationDate: subDays(today, 3), status: "Pending", parentName: "Susanti", contact: "081234567891" },
  { id: "APP-003", name: "Putri Anggraini", previousSchool: "SMP Cipta Karya", registrationDate: subDays(today, 10), status: "Accepted", parentName: "Budiarto", contact: "081234567892" },
  { id: "APP-004", name: "Doni Saputra", previousSchool: "SMPN 5 Bandung", registrationDate: subDays(today, 15), status: "Rejected", parentName: "Sari", contact: "081234567893" },
];

export const teachingJournals: TeachingJournal[] = [
    { id: "JNL-001", teacherId: "TCH-001", classId: "CLS-001", date: subDays(today, 1), subjectMatter: "Algebraic Expressions", notes: "Students had difficulty with factoring." },
    { id: "JNL-002", teacherId: "TCH-001", classId: "CLS-003", date: subDays(today, 1), subjectMatter: "Linear Equations", notes: "Most students understood the concept well." },
    { id: "JNL-003", teacherId: "TCH-002", classId: "CLS-002", date: subDays(today, 2), subjectMatter: "Newton's Laws of Motion", notes: "Practical examples helped understanding." },
    { id: "JNL-004", teacherId: "TCH-003", classId: "CLS-001", date: subDays(today, 3), subjectMatter: "Analyzing Poetry", notes: "Discussed the meaning behind 'Hujan Bulan Juni'." },
    { id: "JNL-005", teacherId: "TCH-004", classId: "CLS-004", date: subDays(today, 1), subjectMatter: "Introduction to HTML", notes: "Students created their first webpage." },
];
