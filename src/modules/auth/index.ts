import { Elysia, t } from "elysia";
import { addToBlacklist } from "../../app";
export const authController = new Elysia({ prefix: "/auth" })

  .post(
    "/login",
    async ({ body, jwt }: any) => {
      const { username, password } = body;
      if (username !== "admin" || password !== "rahasia")
        return { error: "Invalid credentials" };

      const token = await jwt.sign({ sub: username, role: "admin" });
      // cookie.auth.set({
      //   value: token,
      //   httpOnly: true,
      //   sameSite: "lax",
      //   maxAge: 7,
      //   path: "/",
      // });
      return { token };
    },
    {
      body: t.Object({ username: t.String(), password: t.String() }),
    }
  )
  .get("/me", async ({ jwt, user, status, bearer }: any) => {
    if (!user) return status(401), { error: "Unauthorized" };
    if (bearer) {
      const payload = await jwt.verify(String(bearer));
      if (!payload) return status(401), { error: "Unauthorized" };
      user = payload;
    } else {
      console.log("Accessed with Cookie");
    }
    return { user };
  })
  .post("/logout", ({ cookie, bearer }: any) => {
    if (cookie?.auth) cookie.auth.set({ value: "", maxAge: 0 });
    if (bearer) addToBlacklist(bearer);
    return { message: "Logged out" };
  });
