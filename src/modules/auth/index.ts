import { Elysia, t } from "elysia";
import {
  createUser,
  findUserById,
  findUserByUsername,
  hashPassword,
  verifyPassword,
} from "./service";
import bearer from "@elysiajs/bearer";
import { jwtPlugin } from "../../plugin/jwt";
import { loginBody, registerBody } from "./model";
import { verifyOTP } from "../master-data/otp/model";
import { verifyOTPHandler } from "../master-data/otp/service";
export const authController = new Elysia({ prefix: "/auth" })
  .use(jwtPlugin)
  .use(bearer())
  .post(
    "/login",
    async ({ body: { username, password }, jwt, status }) => {
      const user = await findUserByUsername(username);

      if (!user || !user.passwordHash) {
        return (
          status(404),
          {
            error: "Invalid credentials",
            message: "User not found",
          }
        );
      }

      const isValid = await verifyPassword(password, user.passwordHash);

      if (username !== user.username || !isValid)
        return (
          status(404),
          {
            error: "Invalid credentials",
            message: "Username or password is incorrect",
          }
        );

      const token = await jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        verified: user.verifiedEmail,
      });

      const refreshToken = await jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        verified: user.verifiedEmail,
        type: "refresh",
        exp: "7d", // 7 days
      });

      // cookie.userProfile.set({
      //   value: JSON.stringify({
      //     id: user.id,
      //     username: user.username,
      //     email: user.email,
      //     verified: user.verifiedEmail,
      //   }),
      //   httpOnly: true,
      //   sameSite: "none",
      //   secure: true,
      //   partitioned: true,
      //   maxAge: 60 * 60 * 24 * 7,
      //   path: "/",
      // });

      // cookie.auth.set({
      //   value: refreshToken,
      //   httpOnly: true,
      //   sameSite: "none",
      //   secure: true,
      //   partitioned: true,
      //   maxAge: 60 * 60 * 24 * 7,
      //   path: "/",
      // });

      return (
        status(200),
        {
          status: 200,
          message: "Login successful",
          token,
          data: {
            id: user.id,
            username: user.username,
            email: user.email,
            verified: user.verifiedEmail,
          },
        }
      );
    },
    {
      body: loginBody,
    }
  )
  .post(
    "/register",
    async ({ body: { username, email, password }, status, jwt, cookie }) => {
      const existingUser = await findUserByUsername(username);
      if (existingUser) {
        return (status(400), { error: "Username already taken" });
      }

      const passwordHash = await hashPassword(password);

      const newUser = await createUser(username, email, passwordHash);

      return (
        status(200),
        {
          status: 200,
          message: "User registered successfully",
          data: newUser,
        }
      );
    },
    {
      body: registerBody,
    }
  )
  .post("/logout", async ({ jwt, cookie, bearer, status }) => {
    const verifyToken = await jwt.verify(bearer);
    if (!verifyToken) return (status(401), { error: "Unauthorized" });

    if (cookie.auth) {
      cookie.auth.remove();
    }

    return (
      status(200),
      {
        status: 200,
        message: "Logged out successfully",
        data: verifyToken,
      }
    );
  })
  .post("/refresh", async ({ jwt, cookie, status }) => {
    const token = cookie.auth?.value;

    if (!token) return (status(401), { error: "Missing refresh token" });

    const payload = await jwt.verify(String(token));
    if (!payload) return (status(401), { error: "Invalid refresh token" });

    const user = await findUserById(String(payload.id));
    if (!user) return (status(401), { error: "User not found" });

    const newAccessToken = await jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    const newRefreshToken = await jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email,
      type: "refresh",
      exp: "7d", // 7 days
    });

    if (cookie.refresh) {
      cookie.refresh.set({
        value: newRefreshToken,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
    }

    return (
      status(200),
      {
        status: 200,
        message: "Token refreshed",
        token: newAccessToken,
      }
    );
  })
  .get("/profile", async ({ jwt, bearer, status }) => {
    const verifyToken = await jwt.verify(String(bearer));
    if (!verifyToken) return (status(401), { error: "Unauthorized" });

    const user = await findUserById(String(verifyToken.id));
    if (!user) return (status(404), { error: "User not found" });

    return (
      status(200),
      {
        status: 200,
        message: "User profile fetched successfully",
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          verified: user.verifiedEmail,
        },
      }
    );
  })
  .post(
    "/verify-email",
    async ({ body: { otp, to } }) => {
      // Implement email verification logic here
      return await verifyOTPHandler(to, otp);
    },
    {
      body: verifyOTP,
    }
  );
