import { t } from "elysia";

export const loginBody = t.Object({
  username: t.String(),
  password: t.String(),
});
export type LoginBody = typeof loginBody.static;

export const registerBody = t.Object({
  username: t.String(),
  email: t.String(),
  password: t.String(),
});
export type RegisterBody = typeof registerBody.static;
