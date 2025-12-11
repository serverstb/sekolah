
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

// GET all teachers
export async function GET() {
  try {
    const [rows]: any = await db.execute(`
      SELECT 
        t.id, t.name, t.nip, t.subjectId, t.avatarUrl, t.avatarHint,
        s.name as subjectName,
        (SELECT GROUP_CONCAT(tc.classId) FROM teacher_classes tc WHERE tc.teacherId = t.id) as taughtClassIds
      FROM teachers t
      LEFT JOIN subjects s ON t.subjectId = s.id
      ORDER BY t.name ASC
    `);
    
    // Convert taughtClassIds from string to array
    const teachers = rows.map((teacher: any) => ({
      ...teacher,
      taughtClassIds: teacher.taughtClassIds ? teacher.taughtClassIds.split(',') : [],
    }));

    return NextResponse.json({ teachers });
  } catch (error) {
    console.error('Failed to fetch teachers:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}

// CREATE a new teacher
export async function POST(req: NextRequest) {
  try {
    const { name, nip, subjectId, taughtClassIds = [], avatarUrl, avatarHint } = await req.json();

    if (!name || !nip || !subjectId) {
      return NextResponse.json({ message: 'Nama, NIP, dan Mata Pelajaran harus diisi.' }, { status: 400 });
    }

    const teacherId = `TCH-${nanoid()}`;

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        await connection.execute(
            'INSERT INTO teachers (id, name, nip, subjectId, avatarUrl, avatarHint) VALUES (?, ?, ?, ?, ?, ?)',
            [teacherId, name, nip, subjectId, avatarUrl || `https://picsum.photos/seed/${teacherId}/100/100`, avatarHint || 'person portrait']
        );

        // Insert into teacher_classes table if there are any classes
        if (taughtClassIds && taughtClassIds.length > 0) {
            const classValues = taughtClassIds.map((classId: string) => [teacherId, classId]);
            await connection.query('INSERT INTO teacher_classes (teacherId, classId) VALUES ?', [classValues]);
        }

        await connection.commit();
        connection.release();

        return NextResponse.json({ message: 'Guru berhasil ditambahkan.', teacherId }, { status: 201 });
    } catch (error) {
        await connection.rollback();
        connection.release();
        console.error('Transaction Error:', error);
        return NextResponse.json({ message: 'Gagal menambahkan guru ke database.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Failed to create teacher:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
