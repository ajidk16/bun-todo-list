import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  pgEnum,
  varchar,
} from "drizzle-orm/pg-core";

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
  verifiedEmail: boolean("verified_email").notNull().default(false),
  passwordHash: text("password_hash").notNull(),
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
  isCompleted: boolean("is_completed").default(false),
  status: todoStatus("status").default("pending"),
  priority: todoPriority("priority").default("medium"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const todosRelations = relations(todos, ({ one }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  todos: many(todos),
}));
