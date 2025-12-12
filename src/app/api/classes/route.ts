
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890', 3);

// GET all classes
export async function GET() {
  try {
    const [rows] = await db.execute(`
      SELECT 
        c.id, 
        c.name, 
        c.walikelasId, 
        st.name AS walikelasName,
        (SELECT COUNT(*) FROM students s WHERE s.classId = c.id) as studentCount
      FROM classes c
      LEFT JOIN staff st ON c.walikelasId = st.id
      ORDER BY c.name ASC
    `);
    return NextResponse.json({ classes: rows });
  } catch (error) {
    console.error('Failed to fetch classes:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}

// CREATE a new class
export async function POST(req: NextRequest) {
  try {
    const { name, walikelasId } = await req.json();

    if (!name || !walikelasId) {
      return NextResponse.json({ message: 'Nama kelas dan wali kelas harus diisi.' }, { status: 400 });
    }
    
    const [maxIdResult]: any = await db.execute('SELECT MAX(CAST(SUBSTRING(id, 5) AS UNSIGNED)) as maxId FROM classes');
    const newIdNumber = (maxIdResult[0].maxId || 0) + 1;
    const classId = `CLS-${String(newIdNumber).padStart(3, '0')}`;

    await db.execute(
      'INSERT INTO classes (id, name, walikelasId) VALUES (?, ?, ?)',
      [classId, name, walikelasId]
    );

    return NextResponse.json({ message: 'Kelas berhasil dibuat.', classId }, { status: 201 });
  } catch (error) {
    console.error('Failed to create class:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
