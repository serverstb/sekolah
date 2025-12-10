
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

// GET all users
export async function GET(req: NextRequest) {
  try {
    const [rows]: any = await db.execute('SELECT id, email, role, teacherId FROM users ORDER BY email ASC');
    return NextResponse.json({ users: rows });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}

// CREATE a new user
export async function POST(req: NextRequest) {
  try {
    const { email, password, role = 'teacher', teacherId } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email dan password harus diisi.' }, { status: 400 });
    }
     // On registration, teacherId might not be available, so we don't validate it here.
     // It can be assigned later in the user management page.
     if (role === 'teacher' && !teacherId && req.url.includes('/api/users')) {
        // This validation can be more specific for backend-only operations if needed
     }

    // Check for existing email
    const [existing]:any = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
        return NextResponse.json({ message: 'Email sudah terdaftar.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `USR-${nanoid()}`;

    // Insert with teacherId as null if not provided
    await db.execute(
      'INSERT INTO users (id, email, password, role, teacherId) VALUES (?, ?, ?, ?, ?)',
      [userId, email, hashedPassword, role, teacherId || null]
    );

    return NextResponse.json({ message: 'Pengguna berhasil dibuat.', userId }, { status: 201 });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}

// UPDATE a user
export async function PUT(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ message: 'ID pengguna tidak ditemukan.' }, { status: 400 });
    }

    try {
        const { email, password, role, teacherId } = await req.json();

        if (!email || !role) {
            return NextResponse.json({ message: 'Email dan peran harus diisi.' }, { status: 400 });
        }
        if (role === 'teacher' && !teacherId) {
            return NextResponse.json({ message: 'Guru terkait harus dipilih untuk peran teacher.' }, { status: 400 });
        }

        // Check for existing email on another user
        const [existing]:any = await db.execute('SELECT id FROM users WHERE email = ? AND id != ?', [email, id]);
        if (existing.length > 0) {
            return NextResponse.json({ message: 'Email sudah digunakan oleh pengguna lain.' }, { status: 409 });
        }

        if (password) {
            // Update with password
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.execute(
                'UPDATE users SET email = ?, password = ?, role = ?, teacherId = ? WHERE id = ?',
                [email, hashedPassword, role, role === 'teacher' ? teacherId : null, id]
            );
        } else {
            // Update without password
            await db.execute(
                'UPDATE users SET email = ?, role = ?, teacherId = ? WHERE id = ?',
                [email, role, role === 'teacher' ? teacherId : null, id]
            );
        }
        
        return NextResponse.json({ message: 'Pengguna berhasil diperbarui.' });

    } catch (error) {
        console.error('Failed to update user:', error);
        return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
    }
}

// DELETE a user
export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ message: 'ID pengguna tidak ditemukan.' }, { status: 400 });
    }

    try {
        const [result]: any = await db.execute('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: 'Pengguna tidak ditemukan.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Pengguna berhasil dihapus.' });
    } catch (error) {
        console.error('Failed to delete user:', error);
        return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
    }
}
