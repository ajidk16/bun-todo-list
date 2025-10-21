import { Elysia, t } from "elysia";
import { renderToStaticMarkup } from "react-dom/server";
import * as React from "react";
import OTPEmail from "../../emails/otp";
import { Resend } from "resend";
import { verifyEmail } from "../auth/service";

const resend = new Resend(process.env.RESEND_API_KEY!);

const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export const profileController = new Elysia({ prefix: "/profile" })
  .get(
    "/otp",
    async ({ query, server }) => {
      const to = query.to;
      const baseURL = server.url.origin;

      const otp = (Math.floor(Math.random() * 900000) + 100000).toString();

      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 menit dalam ms
      otpStore.set(to, { otp, expiresAt });

      // Render email JSX jadi HTML string
      const html = renderToStaticMarkup(
        React.createElement(OTPEmail, {
          otp,
          verifyUrl: `${baseURL}/api/v1/profile/otp/verify?email=${to}`,
          supportEmail: "surajidk12@gmail.com",
          brandName: "Todo List",
          expiresInMin: 10,
        })
      );

      // Kirim email OTP
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to,
        subject: "Your verification code",
        html,
      });

      return { success: true, message: "OTP sent" };
    },
    {
      query: t.Object({ to: t.String({ format: "email" }) }),
    }
  )
  .get("/otp/verify", async ({ query, status }) => {
    const email = query.email;
    // Di sini Anda bisa menampilkan halaman verifikasi atau mengarahkan user
    const user = await verifyEmail(email?.toString() || "");
    if (!user) {
      return (status(400), { error: "Email not registered" });
    }
    return (status(200), { message: `Verify email: ${email}` });
  })
  // Endpoint verifikasi OTP yang diterima user
  .post(
    "/otp/verify",
    async ({ body }) => {
      const { to, otp: otpInput } = body;

      // Cek apakah ada data OTP dan belum expired
      const record = otpStore.get(to);
      if (!record) {
        return { success: false, error: "OTP not found or expired" };
      }

      const isExpired = Date.now() > record.expiresAt;
      if (isExpired) {
        otpStore.delete(to);
        return { success: false, error: "OTP expired" };
      }

      if (record.otp !== otpInput) {
        return { success: false, error: "Invalid OTP" };
      }

      const user = await verifyEmail(to);
      if (!user) {
        return { success: false, error: "Email not registered" };
      }

      // OTP valid, hapus dari store
      otpStore.delete(to);

      return { success: true, message: "OTP verified" };
    },
    {
      body: t.Object({
        to: t.String({ format: "email" }),
        otp: t.String(),
      }),
    }
  );
