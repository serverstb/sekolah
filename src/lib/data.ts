
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
  subjectId: string;
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
export type Gender = "Laki-laki" | "Perempuan";

export type NewStudentApplicant = {
  id: string;
  name: string;
  previousSchool: string;
  registrationDate: Date;
  status: AdmissionStatus;
  parentName: string;
  contact: string;
  birthPlace: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  academicYear: string;
};

export type TeachingJournal = {
  id: string;
  teacherId: string;
  classId: string;
  subjectId: string;
  date: Date;
  topic: string;
  notes: string;
  materialFile?: string;
};

export type Subject = {
  id: string;
  name: string;
};

export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

export type Schedule = {
    id: string;
    classId: string;
    subjectId: string;
    teacherId: string;
    day: DayOfWeek;
    startTime: string; // "HH:mm"
    endTime: string; // "HH:mm"
};


const placeholderAvatars = PlaceHolderImages.filter(img => img.id.startsWith("student-avatar-"));
const teacherPlaceHolderAvatars = PlaceHolderImages.filter(img => img.id.startsWith("teacher-avatar-"));
const employeePlaceHolderAvatars = PlaceHolderImages.filter(img => img.id.startsWith("employee-avatar-"));


export const subjects: Subject[] = [
    { id: "SUB-001", name: "Matematika" },
    { id: "SUB-002", name: "Fisika" },
    { id: "SUB-003", name: "Bahasa Indonesia" },
    { id: "SUB-004", name: "Ilmu Komputer" },
    { id: "SUB-005", name: "Biologi" },
    { id: "SUB-006", name: "Kimia" },
    { id: "SUB-007", name: "Sejarah" },
    { id: "SUB-008", name: "Bahasa Inggris" },
];

export const teachers: Teacher[] = [
    { id: "TCH-001", name: "Dr. Siti Aminah", nip: "198001012005012001", subjectId: "SUB-001", avatarUrl: teacherPlaceHolderAvatars[0]?.imageUrl || "", avatarHint: "woman portrait", taughtClassIds: ["CLS-001", "CLS-003", "CLS-005"] },
    { id: "TCH-002", name: "Drs. Bambang Wijoyo", nip: "197505102003121002", subjectId: "SUB-002", avatarUrl: teacherPlaceHolderAvatars[1]?.imageUrl || "", avatarHint: "man portrait", taughtClassIds: ["CLS-002", "CLS-004"] },
    { id: "TCH-003", name: "Retno Wulandari, S.Pd.", nip: "198811202010012003", subjectId: "SUB-003", avatarUrl: teacherPlaceHolderAvatars[2]?.imageUrl || "", avatarHint: "woman portrait", taughtClassIds: ["CLS-001", "CLS-002", "CLS-003"] },
    { id: "TCH-004", name: "Agus Setiawan, M.Kom.", nip: "198208152008031004", subjectId: "SUB-004", avatarUrl: teacherPlaceHolderAvatars[3]?.imageUrl || "", avatarHint: "man portrait", taughtClassIds: ["CLS-004", "CLS-005"] },
];

export const employees: Employee[] = [
    { id: "EMP-001", name: "Joko Susilo", role: "Administrasi", avatarUrl: employeePlaceHolderAvatars[0]?.imageUrl || "", avatarHint: "man portrait" },
    { id: "EMP-002", name: "Sri Rahayu", role: "Pustakawan", avatarUrl: employeePlaceHolderAvatars[1]?.imageUrl || "", avatarHint: "woman portrait" },
    { id: "EMP-003", name: "Teguh Santoso", role: "Keamanan", avatarUrl: employeePlaceHolderAvatars[2]?.imageUrl || "", avatarHint: "man portrait" },
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
  { id: "APP-001", name: "Indah Permatasari", previousSchool: "SMPN 1 Jakarta", registrationDate: subDays(today, 5), status: "Pending", parentName: "Haryono", contact: "081234567890", birthPlace: "Jakarta", birthDate: new Date("2008-05-15"), gender: "Perempuan", address: "Jl. Merdeka No. 10, Jakarta", academicYear: "2024/2025" },
  { id: "APP-002", name: "Rizky Alamsyah", previousSchool: "SMP Bintang Harapan", registrationDate: subDays(today, 3), status: "Pending", parentName: "Susanti", contact: "081234567891", birthPlace: "Bandung", birthDate: new Date("2008-08-20"), gender: "Laki-laki", address: "Jl. Kemerdekaan No. 25, Bandung", academicYear: "2024/2025" },
  { id: "APP-003", name: "Putri Anggraini", previousSchool: "SMP Cipta Karya", registrationDate: subDays(today, 10), status: "Accepted", parentName: "Budiarto", contact: "081234567892", birthPlace: "Surabaya", birthDate: new Date("2008-02-10"), gender: "Perempuan", address: "Jl. Pahlawan No. 5, Surabaya", academicYear: "2023/2024" },
  { id: "APP-004", name: "Doni Saputra", previousSchool: "SMPN 5 Bandung", registrationDate: subDays(today, 15), status: "Rejected", parentName: "Sari", contact: "081234567893", birthPlace: "Medan", birthDate: new Date("2008-11-30"), gender: "Laki-laki", address: "Jl. Sudirman No. 1, Medan", academicYear: "2023/2024" },
];

export const teachingJournals: TeachingJournal[] = [
    { id: "JNL-001", teacherId: "TCH-001", classId: "CLS-001", subjectId: "SUB-001", date: subDays(today, 1), topic: "Ekspresi Aljabar", notes: "Siswa kesulitan dalam faktorisasi.", materialFile: "latihan-faktorisasi.pdf" },
    { id: "JNL-002", teacherId: "TCH-001", classId: "CLS-003", subjectId: "SUB-001", date: subDays(today, 1), topic: "Persamaan Linear", notes: "Sebagian besar siswa memahami konsep dengan baik." },
    { id: "JNL-003", teacherId: "TCH-002", classId: "CLS-002", subjectId: "SUB-002", date: subDays(today, 2), topic: "Hukum Gerak Newton", notes: "Contoh praktis membantu pemahaman.", materialFile: "simulasi-newton.zip" },
    { id: "JNL-004", teacherId: "TCH-003", classId: "CLS-001", subjectId: "SUB-003", date: subDays(today, 3), topic: "Menganalisis Puisi", notes: "Membahas makna di balik 'Hujan Bulan Juni'." },
    { id: "JNL-005", teacherId: "TCH-004", classId: "CLS-004", subjectId: "SUB-004", date: subDays(today, 1), topic: "Pengenalan HTML", notes: "Siswa membuat halaman web pertama mereka." },
];

export const schedules: Schedule[] = [
    // Class 10-A
    { id: "SCH-001", classId: "CLS-001", subjectId: "SUB-001", teacherId: "TCH-001", day: "Monday", startTime: "07:30", endTime: "09:00" },
    { id: "SCH-002", classId: "CLS-001", subjectId: "SUB-003", teacherId: "TCH-003", day: "Monday", startTime: "09:30", endTime: "11:00" },
    { id: "SCH-003", classId: "CLS-001", subjectId: "SUB-008", teacherId: "TCH-003", day: "Tuesday", startTime: "07:30", endTime: "09:00" },

    // Class 10-B
    { id: "SCH-004", classId: "CLS-002", subjectId: "SUB-002", teacherId: "TCH-002", day: "Monday", startTime: "07:30", endTime: "09:00" },
    { id: "SCH-005", classId: "CLS-002", subjectId: "SUB-003", teacherId: "TCH-003", day: "Tuesday", startTime: "09:30", endTime: "11:00" },

    // Class 11-A
    { id: "SCH-006", classId: "CLS-003", subjectId: "SUB-001", teacherId: "TCH-001", day: "Wednesday", startTime: "07:30", endTime: "09:00" },
];

    