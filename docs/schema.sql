-- This is the schema for the database.
-- It's written in SQL and can be used to create the database.

-- Create the subjects table
CREATE TABLE `subjects` (
  `id` varchar(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create the teachers table
CREATE TABLE `teachers` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `nip` varchar(255) NOT NULL,
  `subjectId` varchar(10) DEFAULT NULL,
  `avatarUrl` varchar(255) DEFAULT NULL,
  `avatarHint` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nip` (`nip`),
  KEY `subjectId` (`subjectId`),
  CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create the classes table
CREATE TABLE `classes` (
  `id` varchar(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `walikelasId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `walikelasId` (`walikelasId`),
  CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`walikelasId`) REFERENCES `teachers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create the students table
CREATE TABLE `students` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `classId` varchar(10) DEFAULT NULL,
  `avatarUrl` varchar(255) DEFAULT NULL,
  `avatarHint` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `classId` (`classId`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create the teacher_classes join table
CREATE TABLE `teacher_classes` (
  `teacherId` varchar(255) NOT NULL,
  `classId` varchar(10) NOT NULL,
  PRIMARY KEY (`teacherId`,`classId`),
  KEY `classId` (`classId`),
  CONSTRAINT `teacher_classes_ibfk_1` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `teacher_classes_ibfk_2` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create the users table
CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','teacher') NOT NULL,
  `teacherId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `teacherId` (`teacherId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create the schedules table
CREATE TABLE `schedules` (
  `id` varchar(255) NOT NULL,
  `classId` varchar(10) NOT NULL,
  `subjectId` varchar(10) NOT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create the employees table
CREATE TABLE `employees` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `avatarUrl` varchar(255) DEFAULT NULL,
  `avatarHint` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
