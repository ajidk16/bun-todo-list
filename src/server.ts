// server.ts
import { Elysia } from "elysia";
import { authController } from "./modules/auth";
import cors from "@elysiajs/cors";
import bearer from "@elysiajs/bearer";
import { authGuard } from "./plugin/auth-guard";
import { profileController } from "./modules/profiles";

export const app = new Elysia()
  .use(cors())
  .use(bearer())
  .get("/", () => {
    return { message: "selamat datang suraji" };
  })
  .get("/suraji", () => ({ message: "halo suraji!" }))
  .group("/api/v1", (app) =>
    app
      .use(authController)
      .guard(authGuard)
      .use(profileController)
      .get("/me", async ({ jwt, status, bearer }) => {
        const verifyToken = await jwt.verify(bearer);
        if (!verifyToken) return (status(401), { error: "Unauthorized" });

        return { message: "Authenticated", user: verifyToken };
      })
  );

// Development server
if (process.env.NODE_ENV !== "production") {
  app.listen(5016, () => {
    console.log("Server running at http://localhost:5016");
  });
}
