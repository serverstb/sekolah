-- Skema Database MySQL untuk Aplikasi Manajemen Sekolah

-- Tabel untuk Mata Pelajaran
CREATE TABLE subjects (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    INDEX (name)
);

-- Tabel untuk Guru
-- 'walikelas' untuk kelas akan menunjuk ke tabel ini.
CREATE TABLE teachers (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    nip VARCHAR(255) NOT NULL UNIQUE,
    subject_id VARCHAR(255),
    avatar_url VARCHAR(255),
    avatar_hint VARCHAR(255),
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL
);

-- Tabel untuk Kelas
-- Setiap kelas memiliki satu guru wali (walikelas).
CREATE TABLE classes (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    walikelas_id VARCHAR(255) NOT NULL,
    student_count INT DEFAULT 0,
    FOREIGN KEY (walikelas_id) REFERENCES teachers(id) ON DELETE CASCADE,
    INDEX (name)
);

-- Tabel pivot untuk hubungan many-to-many antara Guru dan Kelas yang diajar
CREATE TABLE teacher_classes (
    teacher_id VARCHAR(255),
    class_id VARCHAR(255),
    PRIMARY KEY (teacher_id, class_id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- Tabel untuk Siswa
-- Setiap siswa terdaftar di satu kelas.
CREATE TABLE students (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    class_id VARCHAR(255),
    avatar_url VARCHAR(255),
    avatar_hint VARCHAR(255),
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
);

-- Tabel untuk Karyawan (non-guru)
CREATE TABLE employees (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    avatar_url VARCHAR(255),
    avatar_hint VARCHAR(255)
);

-- Tabel untuk Pendaftar Siswa Baru
CREATE TABLE new_student_applicants (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    previous_school VARCHAR(255),
    registration_date DATETIME NOT NULL,
    status ENUM('Pending', 'Accepted', 'Rejected') NOT NULL DEFAULT 'Pending',
    parent_name VARCHAR(255),
    contact VARCHAR(255),
    birth_place VARCHAR(255),
    birth_date DATE,
    gender ENUM('Laki-laki', 'Perempuan'),
    address TEXT,
    academic_year VARCHAR(10) NOT NULL
);

-- Tabel untuk Jadwal Pelajaran
CREATE TABLE schedules (
    id VARCHAR(255) PRIMARY KEY,
    class_id VARCHAR(255) NOT NULL,
    subject_id VARCHAR(255) NOT NULL,
    teacher_id VARCHAR(255) NOT NULL,
    day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    INDEX (class_id, day)
);

-- Tabel untuk Jurnal Mengajar Guru
CREATE TABLE teaching_journals (
    id VARCHAR(255) PRIMARY KEY,
    teacher_id VARCHAR(255) NOT NULL,
    class_id VARCHAR(255) NOT NULL,
    subject_id VARCHAR(255) NOT NULL,
    date DATETIME NOT NULL,
    topic VARCHAR(255) NOT NULL,
    notes TEXT,
    material_file VARCHAR(255),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- Tabel untuk Catatan Absensi (bisa untuk siswa, guru, atau karyawan)
CREATE TABLE attendance_records (
    id VARCHAR(255) PRIMARY KEY,
    student_id VARCHAR(255),
    teacher_id VARCHAR(255),
    employee_id VARCHAR(255),
    `timestamp` DATETIME NOT NULL,
    status ENUM('Present', 'Late', 'Absent') NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    INDEX (`timestamp`)
);
