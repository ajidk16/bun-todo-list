// server.ts
import { Elysia } from "elysia";
import { authController } from "./modules/auth";
import cors from "@elysiajs/cors";
import { authGuard } from "./plugin/auth-guard";
import { todoController } from "./modules/todos";
import {
  otpController,
  tagsController,
  todoStatusController,
} from "./modules/master-data";

export const app = new Elysia()
  .use(
    cors({
      origin: "http://localhost:5173",
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      preflight: true, // Ensure OPTIONS requests are handled
    })
  )
  .onError(({ code, error, set, status }) => {
    switch (code) {
      case "VALIDATION":
        set.status = 400;
        return {
          error: "Validation error",
          details: error.all || error.message,
        };
      case "NOT_FOUND":
        set.status = 404;
        return status(404, {
          status: 404,
          error: "Resource not found",
        });
      default:
        set.status = 500;
        return {
          status: "error",
          error: "Internal server error",
          message: error,
        };
    }
  })
  .get("/", () => {
    return { message: "selamat datang suraji" };
  })
  .get("/suraji", () => ({ message: "halo suraji!" }))
  .group("/api/v1", (app) =>
    app
      .use(authController)
      .onBeforeHandle(async ({ jwt, bearer, set, status, cookie }) => {
        const isToken = cookie.auth?.value || bearer;

        const token = await jwt.verify(String(isToken));
        if (!token) return (status(401), { error: "Unauthorized" });

        set.headers["x-user-id"] = String(token.id);
        set.headers["x-user-email"] = String(token.email);
        set.headers["x-user-username"] = String(token.username);
        set.headers["x-user-verifiedEmail"] = String(token.verifiedEmail);
      })
      .use(otpController)
      .guard(authGuard)
      .use(todoController)
      .use(tagsController)
      .use(todoStatusController)
      .get("/me", async ({ jwt, status, bearer, cookie }) => {
        const verifyToken = await jwt.verify(bearer);
        if (!verifyToken) return (status(401), { error: "Unauthorized" });

        return { message: "Authenticated", user: verifyToken, cookie };
      })
  );

// Development server
if (process.env.NODE_ENV !== "production") {
  app.listen(5016, () => {
    console.log("Server running at http://localhost:5016");
  });
}
