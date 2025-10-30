import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Resend } from "resend";
import OTPEmail from "../../../emails/otp";
import { verifyEmail } from "../../auth/service";


export const otpStore = new Map<string, { otp: string; expiresAt: number }>();
export const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendOTP(to: string, baseURL: string) {
  const otp = (Math.floor(Math.random() * 900000) + 100000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 menit
  otpStore.set(to, { otp, expiresAt });

  const html = renderToStaticMarkup(
    React.createElement(OTPEmail, {
      otp,
      verifyUrl: `${process.env.FRONTEND_URL}/todo?to=${to}&otp=${otp}`,
      supportEmail: "surajidk12@gmail.com",
      brandName: "Todo List",
      expiresInMin: 10,
    })
  );

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject: "Your verification code",
    html,
  });

  return { success: true, message: "OTP sent" };
}

export async function verifyOTPHandler(to?: string, otpInput?: string) {
  const record = otpStore.get(to ?? "");
  if (!record) {
    return { success: false, error: "OTP not found or expired" };
  }

  const isExpired = Date.now() > record.expiresAt;
  if (isExpired) {
    otpStore.delete(to ?? "");
    return { success: false, error: "OTP expired" };
  }

  if (record.otp !== otpInput) {
    return { success: false, error: "Invalid OTP" };
  }

  const user = await verifyEmail(to ?? "");
  if (!user) {
    return { success: false, error: "Email not registered" };
  }

  otpStore.delete(to ?? "");
  return { success: true, message: "OTP verified" };
}
