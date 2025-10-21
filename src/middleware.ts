import bearer from "@elysiajs/bearer";
import { jwtPlugin } from "./plugin/jwt";

export const authMiddleware = [jwtPlugin, bearer()];
