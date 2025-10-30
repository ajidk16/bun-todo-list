import { Elysia } from "elysia";
import { verifyOTP } from "./model";
import { sendOTP, verifyOTPHandler } from "./service";

export const otpController = new Elysia({ prefix: "/otp" })
  .get(
    "/send",
    async ({ request, set }) => {
      const to = set.headers["x-user-email"] as string;

      const url = new URL(request.url);
      const baseURL = url.origin;

      return await sendOTP(to, baseURL);
    },
    {
      query: verifyOTP,
    }
  )
  .get(
    "/verify",
    async ({ query, set }) => {
      const to = set.headers["x-user-email"] as string;
      const { otp: otpInput } = query;

      return await verifyOTPHandler(to, otpInput);
    },
    {
      query: verifyOTP,
    }
  );
