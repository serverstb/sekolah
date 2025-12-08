-- Skema Database Sekolah (MySQL)
-- Versi: 1.0

-- Menghapus tabel jika sudah ada untuk setup ulang yang bersih
DROP TABLE IF EXISTS `attendance_records`;
DROP TABLE IF EXISTS `teaching_journals`;
DROP TABLE IF EXISTS `schedules`;
DROP TABLE IF EXISTS `new_student_applicants`;
DROP TABLE IF EXISTS `students`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `teachers`;
DROP TABLE IF EXISTS `classes`;
DROP TABLE IF EXISTS `subjects`;
DROP TABLE IF EXISTS `employees`;

-- Tabel untuk Mata Pelajaran
CREATE TABLE `subjects` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel untuk Guru
CREATE TABLE `teachers` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `nip` VARCHAR(255) NOT NULL,
  `subjectId` VARCHAR(255) NOT NULL,
  `avatarUrl` VARCHAR(255) NULL,
  `avatarHint` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nip` (`nip`),
  FOREIGN KEY (`subjectId`) REFERENCES `subjects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel untuk Kelas
CREATE TABLE `classes` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `walikelasId` VARCHAR(255) NOT NULL,
  `studentCount` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`walikelasId`) REFERENCES `teachers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel 'taught_classes' untuk relasi many-to-many antara guru dan kelas
CREATE TABLE `taught_classes` (
  `teacherId` VARCHAR(255) NOT NULL,
  `classId` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`teacherId`, `classId`),
  FOREIGN KEY (`teacherId`) REFERENCES `teachers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`classId`) REFERENCES `classes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel untuk Siswa
CREATE TABLE `students` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `classId` VARCHAR(255) NOT NULL,
  `avatarUrl` VARCHAR(255) NULL,
  `avatarHint` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`classId`) REFERENCES `classes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel untuk pendaftar siswa baru
CREATE TABLE `new_student_applicants` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `previousSchool` VARCHAR(255) NOT NULL,
  `registrationDate` DATETIME NOT NULL,
  `status` ENUM('Pending', 'Accepted', 'Rejected') NOT NULL,
  `parentName` VARCHAR(255) NOT NULL,
  `contact` VARCHAR(255) NOT NULL,
  `birthPlace` VARCHAR(255) NOT NULL,
  `birthDate` DATE NOT NULL,
  `gender` ENUM('Laki-laki', 'Perempuan') NOT NULL,
  `address` TEXT NOT NULL,
  `academicYear` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel untuk Catatan Absensi (untuk siswa)
CREATE TABLE `attendance_records` (
  `id` VARCHAR(255) NOT NULL,
  `studentId` VARCHAR(255) NOT NULL,
  `timestamp` DATETIME NOT NULL,
  `status` ENUM('Present', 'Late', 'Absent') NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel untuk Jurnal Mengajar
CREATE TABLE `teaching_journals` (
  `id` VARCHAR(255) NOT NULL,
  `teacherId` VARCHAR(255) NOT NULL,
  `classId` VARCHAR(255) NOT NULL,
  `subjectId` VARCHAR(255) NOT NULL,
  `date` DATETIME NOT NULL,
  `topic` VARCHAR(255) NOT NULL,
  `notes` TEXT NULL,
  `materialFile` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`teacherId`) REFERENCES `teachers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`classId`) REFERENCES `classes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`subjectId`) REFERENCES `subjects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel untuk Jadwal Pelajaran
CREATE TABLE `schedules` (
  `id` VARCHAR(255) NOT NULL,
  `classId` VARCHAR(255) NOT NULL,
  `subjectId` VARCHAR(255) NOT NULL,
  `teacherId` VARCHAR(255) NOT NULL,
  `day` ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday') NOT NULL,
  `startTime` TIME NOT NULL,
  `endTime` TIME NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`classId`) REFERENCES `classes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`subjectId`) REFERENCES `subjects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`teacherId`) REFERENCES `teachers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel untuk Karyawan (non-guru)
CREATE TABLE `employees` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(255) NOT NULL,
  `avatarUrl` VARCHAR(255) NULL,
  `avatarHint` VARCHAR(255) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel untuk pengguna sistem (admin, guru)
CREATE TABLE `users` (
  `id` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL, -- Harus disimpan dalam bentuk hash
  `role` ENUM('admin', 'teacher') NOT NULL,
  `teacherId` VARCHAR(255) NULL, -- Relasi ke tabel teachers jika rolenya adalah 'teacher'
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  FOREIGN KEY (`teacherId`) REFERENCES `teachers`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- === Data Awal (Seeder) ===

-- Menambahkan pengguna admin
-- Password untuk akun admin adalah 'password'
INSERT INTO `users` (`id`, `email`, `password`, `role`, `teacherId`) VALUES
('user-admin-01', 'admin@sekolah.com', '$2a$10$w2G.E2.b1nFgaADeM8k8A.t6sHkLVkS0g5zrj20xH14.eW94p.M5W', 'admin', NULL);
