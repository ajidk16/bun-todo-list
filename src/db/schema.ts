import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  pgEnum,
  varchar,
  primaryKey,
} from "drizzle-orm/pg-core";
import { t } from "elysia";

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

// Tabel tags (setiap user punya tags sendiri)
export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 50 }).notNull(),
  color: varchar("color", { length: 7 }).default("#3b82f6"), // hex color
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Tabel junction untuk relasi many-to-many todos <-> tags
export const todosTags = pgTable(
  "todos_tags",
  {
    todoId: uuid("todo_id")
      .notNull()
      .references(() => todos.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.todoId, table.tagId] }),
  })
);

export const todosRelations = relations(todos, ({ one, many }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id],
  }),
  todosTags: many(todosTags),
}));

export const usersRelations = relations(users, ({ many }) => ({
  todos: many(todos),
  tags: many(tags),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(users, {
    fields: [tags.userId],
    references: [users.id],
  }),
  todosTags: many(todosTags),
}));

export const todosTagsRelations = relations(todosTags, ({ one }) => ({
  todo: one(todos, {
    fields: [todosTags.todoId],
    references: [todos.id],
  }),
  tag: one(tags, {
    fields: [todosTags.tagId],
    references: [tags.id],
  }),
}));
