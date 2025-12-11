-- Skema Database untuk Aplikasi Manajemen Sekolah

-- Tabel untuk Mata Pelajaran
CREATE TABLE `subjects` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

-- Tabel untuk Guru
CREATE TABLE `teachers` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `nip` varchar(255) NOT NULL,
  `subjectId` varchar(255) DEFAULT NULL,
  `avatarUrl` varchar(255) DEFAULT NULL,
  `avatarHint` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nip` (`nip`),
  KEY `subjectId` (`subjectId`),
  CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabel untuk Kelas
CREATE TABLE `classes` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `walikelasId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `walikelasId` (`walikelasId`),
  CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`walikelasId`) REFERENCES `teachers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabel untuk Siswa
CREATE TABLE `students` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `classId` varchar(255) DEFAULT NULL,
  `avatarUrl` varchar(255) DEFAULT NULL,
  `avatarHint` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `classId` (`classId`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabel untuk Akun Pengguna
CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','teacher') NOT NULL DEFAULT 'teacher',
  `teacherId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `teacherId` (`teacherId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabel Relasi Guru dan Kelas (Many-to-Many)
CREATE TABLE `teacher_classes` (
  `teacherId` varchar(255) NOT NULL,
  `classId` varchar(255) NOT NULL,
  PRIMARY KEY (`teacherId`,`classId`),
  KEY `classId` (`classId`),
  CONSTRAINT `teacher_classes_ibfk_1` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teacher_classes_ibfk_2` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabel untuk Jadwal Pelajaran
CREATE TABLE `schedules` (
  `id` varchar(255) NOT NULL,
  `classId` varchar(255) NOT NULL,
  `subjectId` varchar(255) NOT NULL,
  `teacherId` varchar(255) NOT NULL,
  `day` enum('Monday','Tuesday','Wednesday','Thursday','Friday') NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  PRIMARY KEY (`id`),
  KEY `classId` (`classId`),
  KEY `subjectId` (`subjectId`),
  KEY `teacherId` (`teacherId`),
  CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `schedules_ibfk_2` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `schedules_ibfk_3` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`) ON DELETE CASCADE
);

-- Tabel untuk Jurnal Mengajar
CREATE TABLE `teaching_journals` (
  `id` varchar(255) NOT NULL,
  `teacherId` varchar(255) NOT NULL,
  `classId` varchar(255) NOT NULL,
  `subjectId` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `topic` varchar(255) NOT NULL,
  `notes` text,
  `materialFile` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `teacherId` (`teacherId`),
  KEY `classId` (`classId`),
  KEY `subjectId` (`subjectId`),
  CONSTRAINT `teaching_journals_ibfk_1` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `teaching_journals_ibfk_2` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `teaching_journals_ibfk_3` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE
);

-- Tabel untuk Pendaftar Siswa Baru
CREATE TABLE `new_student_applicants` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `previousSchool` varchar(255) NOT NULL,
  `registrationDate` datetime NOT NULL,
  `status` enum('Pending','Accepted','Rejected') NOT NULL,
  `parentName` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `birthPlace` varchar(255) NOT NULL,
  `birthDate` date NOT NULL,
  `gender` enum('Laki-laki','Perempuan') NOT NULL,
  `address` text NOT NULL,
  `academicYear` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

-- Tabel untuk Catatan Absensi
CREATE TABLE `attendance_records` (
  `id` varchar(255) NOT NULL,
  `studentId` varchar(255) DEFAULT NULL,
  `teacherId` varchar(255) DEFAULT NULL,
  `employeeId` varchar(255) DEFAULT NULL,
  `timestamp` datetime NOT NULL,
  `status` enum('Present','Late','Absent') NOT NULL,
  `classId` varchar(255) DEFAULT NULL, -- Digunakan untuk mempermudah query absensi per kelas
  PRIMARY KEY (`id`),
  KEY `studentId` (`studentId`),
  KEY `teacherId` (`teacherId`),
  KEY `classId_idx` (`classId`),
  CONSTRAINT `attendance_records_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `attendance_records_ibfk_2` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `attendance_records_ibfk_3` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE SET NULL
);
