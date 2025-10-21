import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  pgEnum,
  varchar
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// ENUM untuk status dan prioritas
export const todoStatus = pgEnum("todo_status", [
  "pending",
  "in_progress",
  "completed",
  "archived",
]);

export const todoPriority = pgEnum("todo_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

// Tabel users
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(), // simpan password hash, bukan plaintext
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Tabel todos dengan relasi ke users
export const todos = pgTable("todos", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  isCompleted: boolean("is_completed").notNull().default(false),
  status: todoStatus("status").notNull().default("pending"),
  priority: todoPriority("priority").notNull().default("medium"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Schema Zod untuk validasi
export const UserInsertSchema = createInsertSchema(users);
export const UserSelectSchema = createSelectSchema(users);

export const TodoInsertSchema = createInsertSchema(todos);
export const TodoSelectSchema = createSelectSchema(todos);

// Tipe TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
