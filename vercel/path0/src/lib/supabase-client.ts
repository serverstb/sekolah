
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

// Inisialisasi klien Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);


/**
 * Checks the connection to Supabase by performing a simple query.
 * 
 * TODO: You MUST replace this placeholder logic with a real Supabase query.
 * For example, try to fetch data from a public table to verify the connection.
 * 
 * @returns {Promise<boolean>} - True if the connection is successful, false otherwise.
 */
export async function checkSupabaseConnection(): Promise<boolean> {
  console.log('Attempting to check Supabase connection...');
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key is not defined in environment variables.');
    return false;
  }
  
  try {
    // =================================================================
    // KODE UNTUK MEMERIKSA KONEKSI
    // Anda bisa mengganti 'pendaftaran' dengan nama tabel publik lain jika ada.
    // Query ini hanya mengambil 1 baris dan tidak mengembalikan datanya,
    // hanya untuk memastikan koneksi dan RLS (Row Level Security) memperbolehkan.
    // =================================================================
    
    const { error } = await supabase.from('pendaftaran').select('*').limit(1);

    if (error) {
      console.error('Supabase connection error:', error.message);
      // Jika error karena tabel tidak ditemukan, itu bukan error koneksi
      if (error.code === '42P01') {
         console.warn("Connection successful, but table 'pendaftaran' not found. Please create it.");
         return true;
      }
      return false;
    }
    
    console.log('Supabase connection successful!');
    return true;
  } catch (error) {
    console.error('An unexpected error occurred during connection check:', error);
    return false;
  }
}
