import { Elysia, t } from "elysia";
import { and, count, eq, relations, sql } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { drizzle as drizzle$1 } from "drizzle-orm/postgres-js";
import { boolean, integer, pgEnum, pgTable, primaryKey, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import postgres from "postgres";
import * as bcrypt from "bcrypt";
import bearer from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import cors from "@elysiajs/cors";
import dayjs from "dayjs";
import z$1, { z } from "zod";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Resend } from "resend";
import { Button, Column, Container, Row, Section, Tailwind, Text } from "@react-email/components";
import { jsx, jsxs } from "react/jsx-runtime";

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
	statuses: () => statuses,
	statusesRelations: () => statusesRelations,
	tags: () => tags,
	tagsRelations: () => tagsRelations,
	todoPriority: () => todoPriority,
	todoStatus: () => todoStatus,
	todos: () => todos,
	todosRelations: () => todosRelations,
	todosTags: () => todosTags,
	todosTagsRelations: () => todosTagsRelations,
	users: () => users,
	usersRelations: () => usersRelations
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
	statusId: uuid("status_id").references(() => statuses.id, { onDelete: "set null" }),
	title: text("title").notNull(),
	description: text("description"),
	isCompleted: boolean("is_completed").default(false),
	priority: todoPriority("priority").default("medium"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow()
});
const statuses = pgTable("statuses", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 50 }).notNull().unique(),
	label: varchar("label", { length: 100 }).notNull(),
	color: varchar("color", { length: 7 }).default("#3b82f6"),
	sortOrder: integer("sort_order").default(0)
});
const tags = pgTable("tags", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
	name: varchar("name", { length: 50 }).notNull(),
	color: varchar("color", { length: 7 }).default("#3b82f6"),
	createdAt: timestamp("created_at").notNull().defaultNow()
});
const todosTags = pgTable("todos_tags", {
	todoId: uuid("todo_id").notNull().references(() => todos.id, { onDelete: "cascade" }),
	tagId: uuid("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").notNull().defaultNow()
}, (table) => ({ pk: primaryKey({ columns: [table.todoId, table.tagId] }) }));
const todosRelations = relations(todos, ({ one, many }) => ({
	user: one(users, {
		fields: [todos.userId],
		references: [users.id]
	}),
	status: one(statuses, {
		fields: [todos.statusId],
		references: [statuses.id]
	}),
	todosTags: many(todosTags)
}));
const statusesRelations = relations(statuses, ({ many }) => ({ todos: many(todos) }));
const usersRelations = relations(users, ({ many }) => ({
	todos: many(todos),
	tags: many(tags)
}));
const tagsRelations = relations(tags, ({ one, many }) => ({
	user: one(users, {
		fields: [tags.userId],
		references: [users.id]
	}),
	todosTags: many(todosTags)
}));
const todosTagsRelations = relations(todosTags, ({ one }) => ({
	todo: one(todos, {
		fields: [todosTags.todoId],
		references: [todos.id]
	}),
	tag: one(tags, {
		fields: [todosTags.tagId],
		references: [tags.id]
	})
}));

//#endregion
//#region src/db/clients/index.ts
const neonClient = neon(process.env.DATABASE_URL);
const postgresClient = postgres(process.env.DATABASE_URL, {
	max: 10,
	prepare: true
});
const isProduction = process.env.NODE_ENV === "production";
const db = isProduction ? drizzle(neonClient, { schema: schema_exports }) : drizzle$1(postgresClient, { schema: schema_exports });

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
	if (!user || !user.passwordHash) return status(404), {
		error: "Invalid credentials",
		message: "User not found"
	};
	const isValid = await verifyPassword(password, user.passwordHash);
	if (username !== user.username || !isValid) return status(404), {
		error: "Invalid credentials",
		message: "Username or password is incorrect"
	};
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
	cookie.auth.set({
		value: refreshToken,
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		secure: true,
		maxAge: 3600 * 24 * 7
	});
	return status(200), {
		status: 200,
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
		status: 200,
		message: "User registered successfully",
		data: newUser
	};
}, { body: registerBody }).post("/logout", async ({ jwt: jwt$1, cookie, bearer: bearer$1, status }) => {
	const verifyToken = await jwt$1.verify(bearer$1);
	if (!verifyToken) return status(401), { error: "Unauthorized" };
	if (cookie.auth) cookie.auth.remove();
	return status(200), {
		status: 200,
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
		status: 200,
		message: "Token refreshed",
		token: newAccessToken
	};
});

//#endregion
//#region src/plugin/auth-guard.ts
const authGuard = { beforeHandle: [async ({ jwt: jwt$1, bearer: bearer$1, status, set }) => {
	const token = await jwt$1.verify(bearer$1);
	if (!token) return status(401, {
		status: 401,
		message: "Missing or invalid token"
	});
	const user = await findUserById(token.id);
	if (!user) return status(401, {
		status: 401,
		message: "User not found"
	});
	if (user.verifiedEmail === false) return status(403, {
		status: 403,
		message: "Email not verified"
	});
	set.headers["x-user-id"] = token.id;
	set.headers["x-user-email"] = token.email;
	set.headers["x-user-username"] = token.username;
	set.headers["x-user-verifiedEmail"] = token.verifiedEmail;
}] };

//#endregion
//#region src/modules/todos/service.ts
const now = dayjs();
const listTodos = async ({ userId, page = 0, limit = 10, search = "", dateFilter }) => {
	const searchQuery = `%${search}%`;
	let dateCondition;
	const getDateRange = () => {
		switch (dateFilter) {
			case "day": return {
				from: now.startOf("day").toISOString(),
				to: now.endOf("day").toISOString()
			};
			case "week": return {
				from: now.startOf("week").toISOString(),
				to: now.endOf("week").toISOString()
			};
			case "month": return {
				from: now.startOf("month").toISOString(),
				to: now.endOf("month").toISOString()
			};
			default: return null;
		}
	};
	const dateRange = getDateRange();
	if (dateRange) dateCondition = and(sql`${todos.createdAt} >= ${dateRange.from}`, sql`${todos.createdAt} <= ${dateRange.to}`);
	const baseCondition = and(eq(todos.userId, String(userId)), sql`(${todos.title} ILIKE ${searchQuery} OR ${todos.description} ILIKE ${searchQuery})`);
	const whereCondition = dateCondition ? and(baseCondition, dateCondition) : baseCondition;
	const [payload, totalResult] = await Promise.all([db.query.todos.findMany({
		with: {
			todosTags: { with: { tag: { columns: {
				id: true,
				name: true,
				color: true
			} } } },
			user: { columns: {
				id: true,
				username: true,
				email: true,
				verifiedEmail: true
			} },
			status: { columns: {
				id: true,
				name: true,
				label: true,
				color: true
			} }
		},
		limit,
		offset: page,
		orderBy: (todo) => [sql`${todo.createdAt} DESC`],
		where: () => whereCondition
	}), db.select({ count: sql`count(*)`.mapWith(Number) }).from(todos).where(() => whereCondition)]);
	return {
		todos: payload,
		total: totalResult[0]?.count || 0
	};
};
const getTodoById = async (userId, id) => {
	return await db.query.todos.findFirst({ where: and(eq(todos.id, id), eq(todos.userId, String(userId))) });
};
const createTodo = async ({ title, description, userId, isCompleted, status, priority, tags: todoTags }) => {
	if (typeof userId !== "string") throw new Error("userId is required and must be a string");
	const tagNames = Array.isArray(todoTags) ? todoTags : typeof todoTags === "string" ? todoTags.split(",").map((t$1) => t$1.trim()) : [];
	const [insertedTodo] = await db.insert(todos).values({
		userId: String(userId),
		title,
		description,
		isCompleted,
		statusId: status,
		priority
	}).returning();
	for (const tagName of tagNames) {
		const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
		const [existingTag] = await db.select().from(tags).where(and(eq(tags.name, tagName), eq(tags.userId, String(userId))));
		let tagId;
		if (existingTag) {
			const [updatedTag] = await db.update(tags).set({ color: randomColor }).where(eq(tags.id, existingTag.id)).returning();
			tagId = updatedTag.id;
		} else {
			const [newTag] = await db.insert(tags).values({
				userId: String(userId),
				name: tagName,
				color: randomColor
			}).returning();
			tagId = newTag.id;
		}
		await db.insert(todosTags).values({
			todoId: insertedTodo.id,
			tagId
		});
	}
	return insertedTodo;
};
const updateTodo = async (id, data) => {
	if (id === void 0) throw new Error("Todo ID is required for update");
	const tagNames = Array.isArray(data.tags) ? data.tags : typeof data.tags === "string" ? data.tags.split(",").map((t$1) => t$1.trim()) : [];
	const [updatedTodo] = await db.update(todos).set({
		title: data.title,
		description: data.description,
		isCompleted: data.isCompleted,
		statusId: data.status,
		priority: data.priority,
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(todos.id, id)).returning();
	if (data.tags !== void 0) {
		await db.delete(todosTags).where(eq(todosTags.todoId, id));
		for (const tagName of tagNames) {
			const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
			const [existingTag] = await db.select().from(tags).where(and(eq(tags.name, tagName), eq(tags.userId, String(updatedTodo.userId))));
			let tagId;
			if (existingTag) {
				const [updatedTag] = await db.update(tags).set({ color: randomColor }).where(eq(tags.id, existingTag.id)).returning();
				tagId = updatedTag.id;
			} else {
				const [newTag] = await db.insert(tags).values({
					userId: String(updatedTodo.userId),
					name: tagName,
					color: randomColor
				}).returning();
				tagId = newTag.id;
			}
			await db.insert(todosTags).values({
				todoId: updatedTodo.id,
				tagId
			});
		}
	}
	return updatedTodo;
};
const deleteTodo = async (userId, id) => {
	return await db.delete(todos).where(and(eq(todos.id, id), eq(todos.userId, String(userId))));
};

//#endregion
//#region src/modules/todos/model.ts
const newTodo = z.object({
	userId: z.string().optional(),
	title: z.string().min(1).max(255),
	description: z.string().optional(),
	isCompleted: z.coerce.boolean().optional(),
	status: z.string().optional(),
	priority: z.enum([
		"low",
		"medium",
		"high",
		"urgent"
	]).optional(),
	tags: z.string().optional()
});
const filterTodos = z.object({
	page: z.coerce.number().optional().default(1),
	limit: z.coerce.number().optional().default(10),
	search: z.string().optional().default(""),
	userId: z.string().optional(),
	dateFilter: z.enum([
		"",
		"day",
		"week",
		"month"
	]).optional()
});

//#endregion
//#region src/modules/todos/index.ts
const todoController = new Elysia({ prefix: "/todos" }).use(jwtPlugin).use(bearer()).get("/", async ({ query: { page, limit, search, dateFilter }, status, set }) => {
	const offset = (page - 1) * limit;
	const searchTerm = search.toLowerCase() ?? "";
	const { todos: todos$1, total } = await listTodos({
		userId: String(set.headers["x-user-id"]),
		search: searchTerm,
		page: offset,
		limit,
		dateFilter
	});
	return status(200, {
		message: "List of todos",
		data: todos$1,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit)
		}
	});
}, { query: filterTodos }).get("/:id", async ({ params, status, set }) => {
	const todo = await getTodoById(String(set.headers["x-user-id"]), params.id);
	return status(200, {
		message: `Get todo with id ${params.id}`,
		data: todo
	});
}).post("/", async ({ body: { title, description, isCompleted, status: isStatus, priority, tags: tags$1 }, status, set }) => {
	return status(201, {
		message: "Todo created",
		data: await createTodo({
			title,
			description,
			userId: String(set.headers["x-user-id"]),
			isCompleted,
			status: isStatus,
			priority,
			tags: tags$1
		})
	});
}, { body: newTodo }).put("/:id", async ({ params, body, status }) => {
	const id = params.id;
	const { title, description, isCompleted, status: isStatus, priority, tags: tags$1 } = body;
	return status(200, {
		message: "Todo updated",
		data: await updateTodo(id, {
			title,
			description,
			isCompleted,
			status: isStatus,
			priority,
			tags: tags$1
		})
	});
}, {
	params: z$1.object({ id: z$1.string() }),
	body: newTodo.partial()
}).delete("/:id", async ({ params: { id }, status, set }) => {
	const todo = await deleteTodo(String(set.headers["x-user-id"]), id);
	return status(200), {
		message: "Todo deleted",
		data: todo
	};
});

//#endregion
//#region src/modules/master-data/otp/model.ts
const verifyOTP = t.Object({ otp: t.Optional(t.String()) });

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
//#region src/modules/master-data/otp/service.ts
const otpStore = /* @__PURE__ */ new Map();
const resend = new Resend(process.env.RESEND_API_KEY);
async function sendOTP(to, baseURL) {
	const otp = (Math.floor(Math.random() * 9e5) + 1e5).toString();
	const expiresAt = Date.now() + 600 * 1e3;
	otpStore.set(to, {
		otp,
		expiresAt
	});
	const html = renderToStaticMarkup(React.createElement(OTPEmail, {
		otp,
		verifyUrl: `${process.env.FRONTEND_URL}/todo?to=${to}&otp=${otp}`,
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
}
async function verifyOTPHandler(to, otpInput) {
	const record = otpStore.get(to ?? "");
	if (!record) return {
		success: false,
		error: "OTP not found or expired"
	};
	if (Date.now() > record.expiresAt) {
		otpStore.delete(to ?? "");
		return {
			success: false,
			error: "OTP expired"
		};
	}
	if (record.otp !== otpInput) return {
		success: false,
		error: "Invalid OTP"
	};
	if (!await verifyEmail(to ?? "")) return {
		success: false,
		error: "Email not registered"
	};
	otpStore.delete(to ?? "");
	return {
		success: true,
		message: "OTP verified"
	};
}

//#endregion
//#region src/modules/master-data/otp/index.ts
const otpController = new Elysia({ prefix: "/otp" }).get("/send", async ({ request, set }) => {
	const to = set.headers["x-user-email"];
	const baseURL = new URL(request.url).origin;
	return await sendOTP(to, baseURL);
}, { query: verifyOTP }).get("/verify", async ({ query, set }) => {
	const to = set.headers["x-user-email"];
	const { otp: otpInput } = query;
	return await verifyOTPHandler(to, otpInput);
}, { query: verifyOTP });

//#endregion
//#region src/modules/master-data/tags/service.ts
const listOfTags = async ({ page = 1, limit = 10, search }) => {
	const searchQuery = `%${search}%`;
	const payload = await db.query.tags.findMany({
		with: { todosTags: { with: { todo: { columns: {
			id: true,
			title: true,
			description: true,
			isCompleted: true,
			createdAt: true,
			updatedAt: true
		} } } } },
		offset: page,
		limit,
		where: (fields, { ilike, or }) => or(ilike(fields.name, searchQuery), ilike(fields.color, searchQuery))
	});
	return {
		total: (await db.select({ count: count() }).from(tags)).at(0)?.count ?? 0,
		payload
	};
};

//#endregion
//#region src/modules/master-data/tags/model.ts
const QueryTags$1 = z$1.object({
	page: z$1.coerce.number().optional().default(1),
	limit: z$1.coerce.number().optional().default(10),
	search: z$1.coerce.string().optional().default("")
});

//#endregion
//#region src/modules/master-data/tags/index.ts
const tagsController = new Elysia({ prefix: "/tags" }).get("/", async ({ query: { page, limit, search }, status }) => {
	const { total, payload: tags$1 } = await listOfTags({
		limit,
		page: (page - 1) * limit,
		search: search?.toLowerCase() ?? ""
	});
	return status(200), {
		status: 200,
		data: tags$1,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit)
		}
	};
}, { query: QueryTags$1 });

//#endregion
//#region src/modules/master-data/todo-status/service.ts
const listOfTodoStatus = async ({ page = 1, limit = 10, search }) => {
	const searchQuery = `%${search}%`;
	const payload = await db.query.statuses.findMany({
		with: { todos: {
			columns: {
				id: true,
				title: true,
				description: true,
				isCompleted: true,
				priority: true
			},
			with: {
				user: { columns: {
					id: true,
					email: true,
					username: true
				} },
				todosTags: {
					columns: {
						tagId: false,
						todoId: false,
						createdAt: false
					},
					with: { tag: { columns: {
						id: true,
						name: true,
						color: true
					} } }
				}
			}
		} },
		offset: page,
		limit,
		where: (fields, { ilike, or }) => or(ilike(fields.name, searchQuery), ilike(fields.label, searchQuery))
	});
	return {
		total: (await db.select({ count: count() }).from(statuses)).at(0)?.count ?? 0,
		payload
	};
};
const createTodoStatus = async ({ name, label, color }) => {
	return await db.insert(statuses).values({
		name,
		label,
		color
	}).returning();
};

//#endregion
//#region src/modules/master-data/todo-status/model.ts
const QueryTags = z$1.object({
	page: z$1.coerce.number().optional().default(1),
	limit: z$1.coerce.number().optional().default(10),
	search: z$1.coerce.string().optional().default("")
});
const createTodoStatusSchema = z$1.object({
	name: z$1.string().min(1, "Name is required"),
	label: z$1.string().min(1, "Label is required"),
	color: z$1.string().min(1, "Color is required")
});
const updateTodoStatusSchema = z$1.object({
	name: z$1.string().min(1, "Name is required").optional(),
	label: z$1.string().min(1, "Label is required").optional(),
	color: z$1.string().min(1, "Color is required").optional()
});

//#endregion
//#region src/modules/master-data/todo-status/index.ts
const todoStatusController = new Elysia({ prefix: "/todo-status" }).get("/", async ({ query: { page, limit, search }, status }) => {
	const { total, payload: tags$1 } = await listOfTodoStatus({
		limit,
		page: (page - 1) * limit,
		search: search?.toLowerCase() ?? ""
	});
	return status(200), {
		status: 200,
		data: tags$1,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit)
		}
	};
}, { query: QueryTags }).post("/", async ({ body: { name, label, color }, status }) => {
	const newStatus = await createTodoStatus({
		name,
		label,
		color
	});
	if (!newStatus) return status(400, { message: "Failed to create todo status" });
	return status(201, {
		message: "Todo status created",
		data: newStatus
	});
}, { body: createTodoStatusSchema });

//#endregion
//#region src/server.ts
const app = new Elysia().use(cors({
	origin: "http://localhost:5173",
	allowedHeaders: ["Content-Type", "Authorization"],
	methods: [
		"GET",
		"POST",
		"PUT",
		"DELETE",
		"OPTIONS"
	],
	credentials: true,
	preflight: true
})).onError(({ code, error, set }) => {
	switch (code) {
		case "VALIDATION":
			set.status = 400;
			return {
				error: "Validation error",
				details: error.all || error.message
			};
		case "NOT_FOUND":
			set.status = 404;
			return { error: `Todo not found` };
		default:
			set.status = 500;
			return {
				error: "Internal server error",
				message: error
			};
	}
}).get("/", () => {
	return { message: "selamat datang suraji" };
}).get("/suraji", () => ({ message: "halo suraji!" })).group("/api/v1", (app$1) => app$1.use(authController).onBeforeHandle(async ({ jwt: jwt$1, bearer: bearer$1, set, status, cookie }) => {
	const isToken = cookie.auth?.value || bearer$1;
	const token = await jwt$1.verify(String(isToken));
	if (!token) return status(401), { error: "Unauthorized" };
	set.headers["x-user-id"] = String(token.id);
	set.headers["x-user-email"] = String(token.email);
	set.headers["x-user-username"] = String(token.username);
	set.headers["x-user-verifiedEmail"] = String(token.verifiedEmail);
}).use(otpController).guard(authGuard).use(todoController).use(tagsController).use(todoStatusController).get("/me", async ({ jwt: jwt$1, status, bearer: bearer$1, cookie }) => {
	const verifyToken = await jwt$1.verify(bearer$1);
	if (!verifyToken) return status(401), { error: "Unauthorized" };
	return {
		message: "Authenticated",
		user: verifyToken,
		cookie
	};
}));
if (process.env.NODE_ENV !== "production") app.listen(5016, () => {
	console.log("Server running at http://localhost:5016");
});

//#endregion
//#region src/index.ts
var src_default = app;

//#endregion
export { src_default as default };