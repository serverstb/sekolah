
export type Student = {
  id: string;
  name: string;
  classId: string;
  className?: string;
  avatarUrl: string;
  avatarHint: string;
};

export type AttendanceRecord = {
  id: string;
  studentId: string;
  staffId: string;
  timestamp: Date | string;
  status: "Present" | "Late" | "Absent";
};

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
  walikelasId: string; 
  walikelasName?: string;
  studentCount: number;
};

export type AdmissionStatus = "Pending" | "Accepted" | "Rejected";
export type Gender = "Laki-laki" | "Perempuan";

export type NewStudentApplicant = {
  id: string;
  name: string;
  previousSchool: string;
  registrationDate: Date | string;
  status: AdmissionStatus;
  parentName: string;
  contact: string;
  birthPlace: string;
  birthDate: Date | string;
  gender: Gender;
  address: string;
  academicYear: string;
};

export type TeachingJournal = {
  id: string;
  teacherId: string;
  classId: string;
  subjectId: string;
  date: Date | string;
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

// This will be removed, just to make other files happy for now
export const newStudentApplicants: any[] = [];
export const students: any[] = [];
export const classes: any[] = [];
export const attendanceRecords: any[] = [];
export const staff: any[] = [];
export const subjects: any[] = [];
export const teachingJournals: any[] = [];
export const schedules: any[] = [];
export const staffAttendanceRecords: any[] = [];
