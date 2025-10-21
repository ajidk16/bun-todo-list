// src/middlewares/authGuard.ts
import type { Context } from "elysia";

export const authGuard = {
  beforeHandle({ jwt, headers, set, status }: Context) {
    const authHeader = headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      set.headers[
        "WWW-Authenticate"
      ] = `Bearer realm="access", error="invalid_token"`;
      return status(401, "Missing or malformed token");
    }

    const token = authHeader.slice(7);

    const payload = jwt.verify(token);
    if (!payload) {
      set.headers[
        "WWW-Authenticate"
      ] = `Bearer realm="access", error="invalid_token"`;
      return status(401, "Invalid token");
    }

    this.user = payload;
  },
};
