
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// UPDATE a teacher
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ message: 'ID guru tidak ditemukan.' }, { status: 400 });
  }

  const connection = await db.getConnection();
  
  try {
    const { name, nip, subjectId, taughtClassIds } = await req.json();

    if (!name || !nip || !subjectId) {
      return NextResponse.json({ message: 'Nama, NIP, dan Mata Pelajaran harus diisi.' }, { status: 400 });
    }

    await connection.beginTransaction();

    // 1. Update the teacher's main details
    await connection.execute(
      'UPDATE teachers SET name = ?, nip = ?, subjectId = ? WHERE id = ?',
      [name, nip, subjectId, id]
    );

    // 2. Clear existing class associations for this teacher
    await connection.execute('DELETE FROM teacher_classes WHERE teacherId = ?', [id]);

    // 3. Insert new class associations if any are provided
    if (taughtClassIds && taughtClassIds.length > 0) {
      const classValues = taughtClassIds.map((classId: string) => [id, classId]);
      await connection.query('INSERT INTO teacher_classes (teacherId, classId) VALUES ?', [classValues]);
    }
    
    await connection.commit();

    return NextResponse.json({ message: 'Data guru berhasil diperbarui.' });

  } catch (error) {
    await connection.rollback();
    console.error(`Failed to update teacher ${id}:`, error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  } finally {
      connection.release();
  }
}


// DELETE a teacher
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ message: 'ID guru tidak ditemukan.' }, { status: 400 });
  }

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // 1. Remove teacher from any class they are a walikelas for
    await connection.execute('UPDATE classes SET walikelasId = NULL WHERE walikelasId = ?', [id]);
    
    // 2. Remove from teacher_classes association
    await connection.execute('DELETE FROM teacher_classes WHERE teacherId = ?', [id]);
    
    // 3. Remove user account associated with the teacher
    await connection.execute('DELETE FROM users WHERE teacherId = ?', [id]);

    // 4. Delete the teacher
    const [result]: any = await connection.execute('DELETE FROM teachers WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      connection.release();
      return NextResponse.json({ message: 'Guru tidak ditemukan.' }, { status: 404 });
    }

    await connection.commit();
    connection.release();

    return NextResponse.json({ message: 'Guru berhasil dihapus.' });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error(`Failed to delete teacher ${id}:`, error);
     if (error instanceof Error && 'code' in error && error.code === 'ER_ROW_IS_REFERENCED_2') {
        return NextResponse.json({ message: 'Gagal menghapus guru karena masih ada data jurnal atau jadwal yang terkait.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
