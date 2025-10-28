import { t } from "elysia";

export const verifyOTP = t.Object({
  otp: t.Optional(t.String()),
});
export type verifyOTP = typeof verifyOTP.static;
