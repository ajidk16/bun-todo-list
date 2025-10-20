// src/modules/auth/model.ts
import { t } from "elysia";

export namespace AuthModel {
  // ---------- Request ----------
  export const loginBody = t.Object({
    email: t.String({ format: "email" }),
    password: t.String(),
  });
  export type LoginBody = typeof loginBody.static;

  // ---------- Response ----------
  export const loginResponse = t.Object({
    accessToken: t.String(),
    expiresIn: t.Number(),
  });
  export type LoginResponse = typeof loginResponse.static;

  // ---------- Logout ----------
  // logout tidak butuh body, hanya token di header
}
