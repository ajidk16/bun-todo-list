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
export const authController = new Elysia({ prefix: "/auth" })
  .use(jwtPlugin)
  .use(bearer())
  .post(
    "/login",
    async ({ body: { username, password }, jwt, status, cookie }) => {
      const user = await findUserByUsername(username);

      if (!user || !user.passwordHash) {
        return { error: "Invalid credentials" };
      }

      const isValid = await verifyPassword(password, user.passwordHash);

      if (username !== user.username || !isValid)
        return { error: "Invalid credentials" };

      const token = await jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email,
      });

      const refreshToken = await jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        type: "refresh",
        exp: "7d", // 7 days
      });

      if (cookie.auth) {
        cookie.auth.set({
          value: refreshToken,
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
        });
      }
      return (
        status(200),
        {
          message: "Login successful",
          token,
          data: { id: user.id, username: user.username, email: user.email },
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
        return status(400), { error: "Username already taken" };
      }

      const passwordHash = await hashPassword(password);

      const newUser = await createUser(username, email, passwordHash);
      console.log("New User Created:", newUser);

      return (
        status(200),
        {
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
    if (!verifyToken) return status(401), { error: "Unauthorized" };

    if (cookie.auth) {
      cookie.auth.remove();
    }

    return (
      status(200), { message: "Logged out successfully", data: verifyToken }
    );
  })
  .post("/refresh", async ({ jwt, cookie, status }) => {
    const token = cookie.auth?.value;

    if (!token) return status(401), { error: "Missing refresh token" };

    const payload = await jwt.verify(String(token));
    if (!payload) return status(401), { error: "Invalid refresh token" };

    const user = await findUserById(String(payload.id));
    if (!user) return status(401), { error: "User not found" };

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

    return status(200), { message: "Token refreshed", token: newAccessToken };
  });
