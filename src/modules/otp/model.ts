import { t } from "elysia";

export const verifyOTP = t.Object({
  to: t.String({ format: "email" }),
  otp: t.Optional(t.String()),
});
export type verifyOTP = typeof verifyOTP.static;
