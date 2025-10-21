import jwt from "@elysiajs/jwt";

export const jwtPlugin = jwt({
  secret: process.env.JWT_SECRET!,
  alg: "HS256",
  exp: "15m",
});
