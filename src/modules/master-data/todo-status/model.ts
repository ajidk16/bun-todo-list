import { t } from "elysia";
import z from "zod";

export const QueryTags = t.Object({
  page: t.Optional(t.Numeric()),
  limit: t.Optional(t.Numeric()),
  search: t.Optional(t.String()),
  userId: t.Optional(t.String()),
});

export type QueryTags = typeof QueryTags.static;

export const createTodoStatusSchema = t.Object({
  userId: t.Optional(t.String()),
  name: t.String(),
  label: t.String(),
  color: t.String(),
  sortOrder: t.Numeric(),
});
export type CreateTodoStatusSchema = typeof createTodoStatusSchema.static;

export const updateTodoStatusSchema = t.Object({
  userId: t.Optional(t.String()),
  name: t.Optional(t.String()),
  label: t.Optional(t.String()),
  color: t.Optional(t.String()),
  sortOrder: t.Optional(t.Numeric()),
});

export type UpdateTodoStatusSchema = typeof updateTodoStatusSchema.static;
