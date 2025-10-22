import { Elysia, t } from "elysia";
import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { boolean, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import bcrypt from "bcrypt";
import bearer from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import cors from "@elysiajs/cors";
import { renderToStaticMarkup } from "react-dom/server";
import * as React from "react";
import { Button, Column, Container, Row, Section, Tailwind, Text } from "@react-email/components";
import { jsx, jsxs } from "react/jsx-runtime";
import { Resend } from "resend";

//#region rolldown:runtime
var __defProp = Object.defineProperty;
var __export = (all) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	return target;
};

//#endregion
//#region src/db/schema.ts
var schema_exports = /* @__PURE__ */ __export({
	TodoInsertSchema: () => TodoInsertSchema,
	TodoSelectSchema: () => TodoSelectSchema,
	UserInsertSchema: () => UserInsertSchema,
	UserSelectSchema: () => UserSelectSchema,
	todoPriority: () => todoPriority,
	todoStatus: () => todoStatus,
	todos: () => todos,
	users: () => users
});
const todoStatus = pgEnum("todo_status", [
	"pending",
	"in_progress",
	"completed",
	"archived"
]);
const todoPriority = pgEnum("todo_priority", [
	"low",
	"medium",
	"high",
	"urgent"
]);
const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	username: varchar("username").notNull().unique(),
	email: text("email").notNull().unique(),
	verifiedEmail: boolean("verified_email").notNull().default(false),
	passwordHash: text("password_hash").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow()
});
const todos = pgTable("todos", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	description: text("description"),
	isCompleted: boolean("is_completed").notNull().default(false),
	status: todoStatus("status").notNull().default("pending"),
	priority: todoPriority("priority").notNull().default("medium"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow()
});
const UserInsertSchema = createInsertSchema(users);
const UserSelectSchema = createSelectSchema(users);
const TodoInsertSchema = createInsertSchema(todos);
const TodoSelectSchema = createSelectSchema(todos);

//#endregion
//#region src/db/clients/index.ts
const sql = neon(process.env.DATABASE_URL);
const db = drizzle({
	client: sql,
	schema: schema_exports
});

//#endregion
//#region src/modules/auth/service.ts
const createUser = async (username, email, passwordHash) => {
	return await db.insert(users).values({
		username,
		email,
		passwordHash
	});
};
const findUserByEmail = async (email) => {
	return await db.query.users.findFirst({ where: (users$1, { eq: eq$1 }) => eq$1(users$1.email, email) });
};
const verifyEmail = async (email) => {
	if (!await findUserByEmail(email)) return {
		success: false,
		error: "Email not registered"
	};
	const [respon] = await db.update(users).set({ verifiedEmail: true }).where(eq(users.email, email)).returning();
	return { data: respon };
};
const findUserByUsername = async (username) => {
	return await db.query.users.findFirst({ where: (users$1, { eq: eq$1 }) => eq$1(users$1.username, username) });
};
const findUserById = async (id) => {
	return await db.query.users.findFirst({ where: (users$1, { eq: eq$1 }) => eq$1(users$1.id, id) });
};
const hashPassword = async (password) => {
	return await bcrypt.hash(password, 12);
};
const verifyPassword = async (password, hashedPassword) => {
	try {
		return await bcrypt.compare(password, hashedPassword);
	} catch {
		return false;
	}
};

//#endregion
//#region src/plugin/jwt.ts
const jwtPlugin = jwt({
	secret: process.env.JWT_SECRET,
	alg: "HS256",
	exp: "15m"
});

//#endregion
//#region src/modules/auth/model.ts
const loginBody = t.Object({
	username: t.String(),
	password: t.String()
});
const registerBody = t.Object({
	username: t.String(),
	email: t.String(),
	password: t.String()
});

//#endregion
//#region src/modules/auth/index.ts
const authController = new Elysia({ prefix: "/auth" }).use(jwtPlugin).use(bearer()).post("/login", async ({ body: { username, password }, jwt: jwt$1, status, cookie }) => {
	const user = await findUserByUsername(username);
	if (!user || !user.passwordHash) return { error: "Invalid credentials" };
	const isValid = await verifyPassword(password, user.passwordHash);
	if (username !== user.username || !isValid) return { error: "Invalid credentials" };
	const token = await jwt$1.sign({
		id: user.id,
		username: user.username,
		email: user.email
	});
	const refreshToken = await jwt$1.sign({
		id: user.id,
		username: user.username,
		email: user.email,
		type: "refresh",
		exp: "7d"
	});
	if (cookie.auth) cookie.auth.set({
		value: refreshToken,
		httpOnly: true,
		sameSite: "lax",
		maxAge: 3600 * 24 * 7,
		path: "/"
	});
	return status(200), {
		message: "Login successful",
		token,
		data: {
			id: user.id,
			username: user.username,
			email: user.email
		}
	};
}, { body: loginBody }).post("/register", async ({ body: { username, email, password }, status, jwt: jwt$1, cookie }) => {
	if (await findUserByUsername(username)) return status(400), { error: "Username already taken" };
	const newUser = await createUser(username, email, await hashPassword(password));
	console.log("New User Created:", newUser);
	return status(200), {
		message: "User registered successfully",
		data: newUser
	};
}, { body: registerBody }).post("/logout", async ({ jwt: jwt$1, cookie, bearer: bearer$1, status }) => {
	const verifyToken = await jwt$1.verify(bearer$1);
	if (!verifyToken) return status(401), { error: "Unauthorized" };
	if (cookie.auth) cookie.auth.remove();
	return status(200), {
		message: "Logged out successfully",
		data: verifyToken
	};
}).post("/refresh", async ({ jwt: jwt$1, cookie, status }) => {
	const token = cookie.auth?.value;
	if (!token) return status(401), { error: "Missing refresh token" };
	const payload = await jwt$1.verify(String(token));
	if (!payload) return status(401), { error: "Invalid refresh token" };
	const user = await findUserById(String(payload.id));
	if (!user) return status(401), { error: "User not found" };
	const newAccessToken = await jwt$1.sign({
		id: user.id,
		username: user.username,
		email: user.email
	});
	const newRefreshToken = await jwt$1.sign({
		id: user.id,
		username: user.username,
		email: user.email,
		type: "refresh",
		exp: "7d"
	});
	if (cookie.refresh) cookie.refresh.set({
		value: newRefreshToken,
		httpOnly: true,
		sameSite: "lax",
		maxAge: 3600 * 24 * 7,
		path: "/"
	});
	return status(200), {
		message: "Token refreshed",
		token: newAccessToken
	};
});

//#endregion
//#region src/plugin/auth-guard.ts
const authGuard = { beforeHandle: [async ({ jwt: jwt$1, bearer: bearer$1, status }) => {
	if (!await jwt$1.verify(bearer$1)) return status(401, { error: "Unauthorized" });
}] };

//#endregion
//#region src/emails/otp.tsx
function OTPEmail({ otp, username, verifyUrl, supportEmail, brandName, expiresInMin }) {
	const digits = [...otp.toString()];
	return /* @__PURE__ */ jsx(Tailwind, { children: /* @__PURE__ */ jsx(Section, {
		className: "bg-slate-100 py-8",
		children: /* @__PURE__ */ jsxs(Container, {
			className: "mx-auto w-full max-w-[560px] px-4",
			children: [/* @__PURE__ */ jsxs(Section, {
				className: "overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200",
				children: [
					/* @__PURE__ */ jsx(Section, {
						className: "bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5",
						children: /* @__PURE__ */ jsx(Row, { children: /* @__PURE__ */ jsx(Column, { children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 text-white",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex h-9 w-9 items-center justify-center rounded-xl bg-white/10",
								children: /* @__PURE__ */ jsx("svg", {
									xmlns: "http://www.w3.org/2000/svg",
									viewBox: "0 0 24 24",
									fill: "currentColor",
									className: "h-5 w-5",
									children: /* @__PURE__ */ jsx("path", { d: "M12 3l8.66 5v8L12 21l-8.66-5V8L12 3zm0 2.309L5.34 9 12 12.691 18.66 9 12 5.309z" })
								})
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Text, {
								className: "m-0 text-[11px] uppercase tracking-wider text-white/70",
								children: "Keamanan Akun"
							}), /* @__PURE__ */ jsx(Text, {
								className: "m-0 text-base font-semibold text-white",
								children: "Verifikasi Kode OTP"
							})] })]
						}) }) })
					}),
					/* @__PURE__ */ jsxs(Section, {
						className: "px-6 py-6",
						children: [
							/* @__PURE__ */ jsxs(Text, {
								className: "m-0 text-slate-700",
								children: ["Halo, ", username]
							}),
							/* @__PURE__ */ jsx(Text, {
								className: "mt-3 text-slate-700",
								children: "Kami menerima permintaan untuk memverifikasi akun Anda. Masukkan kode OTP berikut pada aplikasi atau situs kami:"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-5 flex justify-center gap-2",
								children: digits.map((d, i) => /* @__PURE__ */ jsx("span", {
									className: "flex h-12 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xl font-semibold tracking-widest text-slate-800",
									children: d
								}, `${d}-${i}`))
							}),
							/* @__PURE__ */ jsxs(Text, {
								className: "mt-4 text-sm text-slate-600",
								children: [
									"Kode berlaku selama",
									" ",
									/* @__PURE__ */ jsxs("span", {
										className: "font-semibold text-slate-800",
										children: [expiresInMin, " menit"]
									}),
									". Jangan bagikan OTP kepada siapa pun."
								]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-6 text-center",
								children: /* @__PURE__ */ jsx(Button, {
									href: verifyUrl,
									className: "inline-block rounded-xl bg-indigo-600 px-5 py-3 text-center text-sm font-semibold text-white no-underline shadow",
									children: "Verifikasi Sekarang"
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-6 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200",
								children: /* @__PURE__ */ jsxs(Text, {
									className: "m-0 text-sm text-slate-700",
									children: [
										"Tidak meminta verifikasi? Abaikan email ini. Jika Anda punya pertanyaan, hubungi",
										" ",
										/* @__PURE__ */ jsx("a", {
											href: `mailto:${supportEmail}`,
											className: "text-indigo-600 underline",
											children: supportEmail
										}),
										"."
									]
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-6",
								children: [/* @__PURE__ */ jsx(Text, {
									className: "m-0 text-[12px] text-slate-500",
									children: "Jika tombol tidak berfungsi, salin dan tempel kode ini:"
								}), /* @__PURE__ */ jsx("code", {
									className: "mt-1 inline-block rounded-lg bg-slate-100 px-2 py-1 text-sm font-semibold text-slate-800",
									children: otp
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs(Section, {
						className: "border-t border-slate-200 bg-white px-6 py-5",
						children: [/* @__PURE__ */ jsx(Text, {
							className: "m-0 text-[12px] text-slate-500",
							children: "Anda menerima email ini karena ada aktivitas masuk atau pendaftaran pada akun Anda."
						}), /* @__PURE__ */ jsxs(Text, {
							className: "m-0 mt-1 text-[12px] text-slate-500",
							children: [
								"© 2025 ",
								brandName,
								", All rights reserved."
							]
						})]
					})
				]
			}), /* @__PURE__ */ jsx(Text, {
				className: "mt-4 text-center text-[11px] leading-5 text-slate-500",
				children: "Harap jangan membalas email ini. Kotak masuk ini tidak dipantau."
			})]
		})
	}) });
}
OTPEmail.PreviewProps = {
	otp: "832374",
	username: "Budi",
	verifyUrl: "https://example.com/verify",
	supportEmail: "support@example.com",
	brandName: "Desa Harmoni",
	expiresInMin: 10
};

//#endregion
//#region src/modules/profiles/index.ts
const resend = new Resend(process.env.RESEND_API_KEY);
const otpStore = /* @__PURE__ */ new Map();
const profileController = new Elysia({ prefix: "/profile" }).get("/otp", async ({ query, server }) => {
	const to = query.to;
	const baseURL = server.url.origin;
	const otp = (Math.floor(Math.random() * 9e5) + 1e5).toString();
	const expiresAt = Date.now() + 600 * 1e3;
	otpStore.set(to, {
		otp,
		expiresAt
	});
	const html = renderToStaticMarkup(React.createElement(OTPEmail, {
		otp,
		verifyUrl: `${baseURL}/api/v1/profile/otp/verify?email=${to}`,
		supportEmail: "surajidk12@gmail.com",
		brandName: "Todo List",
		expiresInMin: 10
	}));
	await resend.emails.send({
		from: "onboarding@resend.dev",
		to,
		subject: "Your verification code",
		html
	});
	return {
		success: true,
		message: "OTP sent"
	};
}, { query: t.Object({ to: t.String({ format: "email" }) }) }).get("/otp/verify", async ({ query, status }) => {
	const email = query.email;
	if (!await verifyEmail(email?.toString() || "")) return status(400), { error: "Email not registered" };
	return status(200), { message: `Verify email: ${email}` };
}).post("/otp/verify", async ({ body }) => {
	const { to, otp: otpInput } = body;
	const record = otpStore.get(to);
	if (!record) return {
		success: false,
		error: "OTP not found or expired"
	};
	if (Date.now() > record.expiresAt) {
		otpStore.delete(to);
		return {
			success: false,
			error: "OTP expired"
		};
	}
	if (record.otp !== otpInput) return {
		success: false,
		error: "Invalid OTP"
	};
	if (!await verifyEmail(to)) return {
		success: false,
		error: "Email not registered"
	};
	otpStore.delete(to);
	return {
		success: true,
		message: "OTP verified"
	};
}, { body: t.Object({
	to: t.String({ format: "email" }),
	otp: t.String()
}) });

//#endregion
//#region src/server.ts
const app = new Elysia().use(cors()).use(bearer()).get("/", () => {
	return "selamat datang suraji";
}).get("/suraji", () => "halo suraji!").group("/api/v1", (app$1) => app$1.use(authController).guard(authGuard).use(profileController).get("/me", async ({ jwt: jwt$1, status, bearer: bearer$1 }) => {
	const verifyToken = await jwt$1.verify(bearer$1);
	if (!verifyToken) return status(401), { error: "Unauthorized" };
	return {
		message: "Authenticated",
		user: verifyToken
	};
}));
var server_default = app;

//#endregion
export { server_default as default };