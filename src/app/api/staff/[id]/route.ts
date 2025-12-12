
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// UPDATE a staff member
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ message: 'ID staf tidak ditemukan.' }, { status: 400 });
  }

  const connection = await db.getConnection();
  
  try {
    const { name, role, nip, subjectId, jobTitle, taughtClassIds } = await req.json();

    if (!name || !role) {
      return NextResponse.json({ message: 'Nama dan peran harus diisi.' }, { status: 400 });
    }
    if (role === 'teacher' && (!nip || !subjectId)) {
      return NextResponse.json({ message: 'NIP dan Mata Pelajaran harus diisi untuk guru.' }, { status: 400 });
    }
    if (role === 'employee' && !jobTitle) {
        return NextResponse.json({ message: 'Jabatan harus diisi untuk karyawan.' }, { status: 400 });
    }

    await connection.beginTransaction();

    // 1. Update the staff member's main details
    if (role === 'teacher') {
         await connection.execute(
            'UPDATE staff SET name = ?, role = ?, nip = ?, subjectId = ?, jobTitle = NULL WHERE id = ?',
            [name, role, nip, subjectId, id]
        );
    } else { // employee
        await connection.execute(
            'UPDATE staff SET name = ?, role = ?, nip = NULL, subjectId = NULL, jobTitle = ? WHERE id = ?',
            [name, role, jobTitle, id]
        );
    }


    // 2. Clear existing class associations for this teacher
    await connection.execute('DELETE FROM staff_classes WHERE staffId = ?', [id]);

    // 3. Insert new class associations if role is teacher and any are provided
    if (role === 'teacher' && taughtClassIds && taughtClassIds.length > 0) {
      const classValues = taughtClassIds.map((classId: string) => [id, classId]);
      await connection.query('INSERT INTO staff_classes (staffId, classId) VALUES ?', [classValues]);
    }
    
    await connection.commit();

    return NextResponse.json({ message: 'Data staf berhasil diperbarui.' });

  } catch (error) {
    await connection.rollback();
    console.error(`Failed to update staff ${id}:`, error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  } finally {
      connection.release();
  }
}


// DELETE a staff member
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ message: 'ID staf tidak ditemukan.' }, { status: 400 });
  }

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // 1. Remove staff from any class they are a walikelas for
    await connection.execute('UPDATE classes SET walikelasId = NULL WHERE walikelasId = ?', [id]);
    
    // 2. Remove from staff_classes association
    await connection.execute('DELETE FROM staff_classes WHERE staffId = ?', [id]);
    
    // 3. Remove user account associated with the staff member
    await connection.execute('DELETE FROM users WHERE staffId = ?', [id]);

    // 4. Delete the staff member
    const [result]: any = await connection.execute('DELETE FROM staff WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      connection.release();
      return NextResponse.json({ message: 'Staf tidak ditemukan.' }, { status: 404 });
    }

    await connection.commit();
    connection.release();

    return NextResponse.json({ message: 'Staf berhasil dihapus.' });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error(`Failed to delete staff ${id}:`, error);
     if (error instanceof Error && 'code' in error && error.code === 'ER_ROW_IS_REFERENCED_2') {
        return NextResponse.json({ message: 'Gagal menghapus staf karena masih ada data jurnal atau jadwal yang terkait.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
