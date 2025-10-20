// src/modules/auth/service.ts
import { sql } from "@elysiajs/sql"; // contoh, ganti dengan ORM/DB milikmu
import bcrypt from "bcryptjs";

export abstract class AuthService {
  /** Cari user berdasarkan email, return null bila tidak ada */
  static async findUserByEmail(email: string) {
    const rows = await sql`
      SELECT id, email, password_hash
      FROM users
      WHERE email = ${email}
      LIMIT 1`;
    return rows[0] ?? null;
  }

  /** Verifikasi password & buat JWT payload */
  static async validatePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  /** Generate token (payload bisa ditambah field lain) */
  static async generateToken(userId: number) {
    // payload standar: sub = user id
    return {
      sub: userId,
      // tambahkan field lain bila diperlukan, contoh:
      // role: 'admin'
    };
  }

  /** Logout tidak memerlukan logika di server jika memakai stateless JWT.
   *  Namun bila ingin “blacklist” token, simpan token ke DB/Redis dan cek di middleware.
   */
}
