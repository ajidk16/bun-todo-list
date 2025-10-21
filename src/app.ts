// app.ts
import { Elysia, t } from "elysia";
import { authController } from "./modules/auth";
import cors from "@elysiajs/cors";
import bearer from "@elysiajs/bearer";
import { authGuard } from "./plugin/auth-guard";

new Elysia()
  .use(cors())
  .use(bearer())
  .get("/", () => {
    console.log("Elysia API accessed");
    return "Elysia API is running!";
  })
  .group("/api/v1", (app) =>
    app
      .use(authController)
      .guard(authGuard)
      .get("/ayam", () => "Welcome to the Elysia API!")
      .get("/me", async ({ jwt, status, bearer }) => {
        const verifyToken = await jwt.verify(bearer);
        if (!verifyToken) return status(401), { error: "Unauthorized" };

        return { message: "Authenticated", user: verifyToken };
      })
  )

  .listen(3000);

console.log("🚀 Server running on http://localhost:3000");
