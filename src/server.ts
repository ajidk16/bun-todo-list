// server.ts
import { Elysia } from "elysia";
import { authController } from "./modules/auth";
import cors from "@elysiajs/cors";
import bearer from "@elysiajs/bearer";
import { authGuard } from "./plugin/auth-guard";
import { otpController } from "./modules/otp";
import { todoController } from "./modules/todos";

export const app = new Elysia()
  .onError(({ code, error, set }) => {
    switch (code) {
      case "VALIDATION":
        set.status = 400;
        return {
          error: "Validation error",
          details: error.all || error.message,
        };
      case "NOT_FOUND":
        set.status = 404;
        return { error: `Todo not found` };
      default:
        set.status = 500;
        return { error: "Internal server error", message: error };
    }
  })
  .use(cors())
  .use(bearer())
  .get("/", () => {
    return { message: "selamat datang suraji" };
  })
  .get("/suraji", () => ({ message: "halo suraji!" }))
  .group("/api/v1", (app) =>
    app
      .use(authController)
      .use(otpController)
      .guard(authGuard)
      .use(todoController)
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
