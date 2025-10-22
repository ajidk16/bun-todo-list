import { Elysia } from "elysia";
import { verifyOTP } from "./model";
import { sendOTP, verifyOTPHandler } from "./service";

export const otpController = new Elysia({ prefix: "/otp" })
  .get(
    "/send",
    async ({ query, request }) => {
      const to = query.to;
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
    async ({ query }) => {
      const { to, otp: otpInput } = query;
      return await verifyOTPHandler(to, otpInput);
    },
    {
      query: verifyOTP,
    }
  );
