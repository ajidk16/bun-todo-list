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
      verifyUrl: `${process.env.FRONTEND_URL}/dashboard?to=${to}&otp=${otp}`,
      supportEmail: "surajidk12@gmail.com",
      brandName: "Todo List",
      expiresInMin: 10,
    })
  );

  const res = await resend.emails.send({
    from: "Todo List <noreply@todo-list.dkaji.my.id>",
    to,
    subject: "Your OTP Code",
    html,
  });

  return { status: 200, message: "OTP sent", data: res };
}

export async function verifyOTPHandler(to?: string, otpInput?: string) {
  const record = otpStore.get(to ?? "");
  // if (!record) {
  //   return { status: false, error: "OTP not found or expired" };
  // }

  // const isExpired = Date.now() > record.expiresAt;
  // if (isExpired) {
  //   otpStore.delete(to ?? "");
  //   return { status: false, error: "OTP expired" };
  // }

  // if (record.otp !== otpInput) {
  //   return { status: false, error: "Invalid OTP" };
  // }

  const user = await verifyEmail(to ?? "");
  if (!user) {
    return { status: false, error: "Email not registered" };
  }

  otpStore.delete(to ?? "");
  return { status: 200, message: "OTP verified", data: user };
}
