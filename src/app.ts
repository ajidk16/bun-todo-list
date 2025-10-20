// app.ts
import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { bearer } from "@elysiajs/bearer";
import { authController } from "./modules/auth";
import cors from "@elysiajs/cors";

const blacklist = new Set<string>();
export const addToBlacklist = (t: string) => blacklist.add(t);
export const isBlacklisted = (t: string) => blacklist.has(t);

const app = new Elysia({ prefix: "/api/v1" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
      exp: "1m", // 1 minute
    })
  )
  .use(bearer())
  .use(cors())
  .derive(async ({ jwt, cookie, bearer }) => {
    const raw = cookie?.auth?.value ?? bearer;
    if (!raw || isBlacklisted(String(raw))) return { user: null };

    const payload = await jwt.verify(String(raw));
    if (!payload) return { user: null };

    return { user: payload };
  })
  .use(authController)
  .listen(3000);

console.log("🚀 Server running on http://localhost:3000");
