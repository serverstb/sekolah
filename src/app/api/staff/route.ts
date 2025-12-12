
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

// GET all staff
export async function GET() {
  try {
    const [rows]: any = await db.execute(`
      SELECT 
        st.id, st.name, st.role, st.nip, st.jobTitle, st.subjectId, st.avatarUrl, st.avatarHint,
        s.name as subjectName,
        (SELECT GROUP_CONCAT(sc.classId) FROM staff_classes sc WHERE sc.staffId = st.id) as taughtClassIds
      FROM staff st
      LEFT JOIN subjects s ON st.subjectId = s.id
      ORDER BY st.name ASC
    `);
    
    // Convert taughtClassIds from string to array
    const staff = rows.map((person: any) => ({
      ...person,
      taughtClassIds: person.taughtClassIds ? person.taughtClassIds.split(',') : [],
    }));

    return NextResponse.json({ staff });
  } catch (error) {
    console.error('Failed to fetch staff:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}

// CREATE a new staff member
export async function POST(req: NextRequest) {
  try {
    const { name, role, nip, subjectId, jobTitle, avatarUrl, avatarHint } = await req.json();

    if (!name || !role) {
      return NextResponse.json({ message: 'Nama dan Peran harus diisi.' }, { status: 400 });
    }
    if (role === 'teacher' && (!nip || !subjectId)) {
        return NextResponse.json({ message: 'Nama, NIP, dan Mata Pelajaran harus diisi untuk guru.' }, { status: 400 });
    }
    if (role === 'employee' && !jobTitle) {
        return NextResponse.json({ message: 'Jabatan harus diisi untuk karyawan.' }, { status: 400 });
    }

    const staffId = `STF-${nanoid()}`;

    const query = 'INSERT INTO staff (id, name, role, nip, subjectId, jobTitle, avatarUrl, avatarHint) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [
        staffId, 
        name, 
        role, 
        role === 'teacher' ? nip : null,
        role === 'teacher' ? subjectId : null,
        role === 'employee' ? jobTitle : null,
        avatarUrl || `https://picsum.photos/seed/${staffId}/100/100`, 
        avatarHint || 'person portrait'
    ];

    await db.execute(query, params);

    return NextResponse.json({ message: 'Staf berhasil ditambahkan.', staffId }, { status: 201 });

  } catch (error) {
    console.error('Failed to create staff:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
