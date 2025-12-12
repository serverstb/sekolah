CREATE TABLE subjects (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE staff (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role ENUM('teacher', 'employee') NOT NULL,
    nip VARCHAR(255) UNIQUE, -- Only for teachers
    jobTitle VARCHAR(255), -- Only for employees
    subjectId VARCHAR(255), -- Only for teachers
    avatarUrl VARCHAR(255),
    avatarHint VARCHAR(255),
    FOREIGN KEY (subjectId) REFERENCES subjects(id) ON DELETE SET NULL
);

CREATE TABLE classes (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    walikelasId VARCHAR(255) UNIQUE,
    FOREIGN KEY (walikelasId) REFERENCES staff(id) ON DELETE SET NULL
);

CREATE TABLE students (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    classId VARCHAR(255),
    avatarUrl VARCHAR(255),
    avatarHint VARCHAR(255),
    FOREIGN KEY (classId) REFERENCES classes(id) ON DELETE SET NULL
);

CREATE TABLE staff_classes (
    staffId VARCHAR(255),
    classId VARCHAR(255),
    PRIMARY KEY (staffId, classId),
    FOREIGN KEY (staffId) REFERENCES staff(id) ON DELETE CASCADE,
    FOREIGN KEY (classId) REFERENCES classes(id) ON DELETE CASCADE
);

CREATE TABLE schedules (
    id VARCHAR(255) PRIMARY KEY,
    classId VARCHAR(255) NOT NULL,
    subjectId VARCHAR(255) NOT NULL,
    teacherId VARCHAR(255) NOT NULL,
    day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday') NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    FOREIGN KEY (classId) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (subjectId) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (teacherId) REFERENCES staff(id) ON DELETE CASCADE,
    UNIQUE (classId, day, startTime)
);

CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'teacher') NOT NULL,
    staffId VARCHAR(255) UNIQUE,
    FOREIGN KEY (staffId) REFERENCES staff(id) ON DELETE SET NULL
);
