// src/middlewares/authGuard.ts
import type { Context } from "elysia";

export const authGuard = {
  beforeHandle({ jwt, headers, set, status }: Context) {
    // Bearer token biasanya dikirim lewat Header Authorization: Bearer <token>
    const authHeader = headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      set.headers[
        "WWW-Authenticate"
      ] = `Bearer realm="access", error="invalid_token"`;
      return status(401, "Missing or malformed token");
    }

    const token = authHeader.slice(7); // strip "Bearer "

    // `jwt.verify` mengembalikan payload atau `null` bila tidak valid
    const payload = jwt.verify(token);
    if (!payload) {
      set.headers[
        "WWW-Authenticate"
      ] = `Bearer realm="access", error="invalid_token"`;
      return status(401, "Invalid token");
    }

    // Simpan payload ke context agar handler dapat menggunakannya
    // (misal: ctx.user = payload)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.user = payload;
  },
};
