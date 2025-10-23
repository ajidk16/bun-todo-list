import { findUserById } from "../modules/auth/service";

export const authGuard = {
  beforeHandle: [
    async ({ jwt, bearer, status, set }: any) => {
      const token = await jwt.verify(bearer);
      if (!token) return status(401, { error: "Missing or invalid token" });

      const user = await findUserById(token.id);
      if (!user) return status(401, { error: "User not found" });

      if (user.verifiedEmail === false) {
        return status(403, { error: "Email not verified" });
      }

      set.headers["x-user-id"] = token.id;
      set.headers["x-user-email"] = token.email;
      set.headers["x-user-username"] = token.username;
      set.headers["x-user-verifiedEmail"] = token.verifiedEmail;
    },
  ],
};
