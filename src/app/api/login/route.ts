
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email dan password harus diisi.' }, { status: 400 });
    }

    // Mengambil hash password langsung dari kolom 'password'
    const [rows]: any = await db.execute(
      'SELECT id, email, password, role, staffId FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Email atau password salah.' }, { status: 401 });
    }

    const user = rows[0];
    
    // Membandingkan password yang diberikan dengan hash yang ada di database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Email atau password salah.' }, { status: 401 });
    }
    
    // Menghapus password dari objek user sebelum mengirimkannya kembali
    const { password: userPassword, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan koneksi pada server.' }, { status: 500 });
  }
}
