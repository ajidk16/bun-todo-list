import { t } from "elysia";

export const QueryTags = t.Object({
  userId: t.Optional(t.String()),
  page: t.Optional(t.Numeric({ default: 1 })),
  limit: t.Optional(t.Numeric({ default: 10 })),
  search: t.Optional(t.String()),
  status: t.Optional(t.Union([t.Boolean(), t.String()])),
});
export type QueryTags = typeof QueryTags.static;

export const BodyTag = t.Object({
  name: t.String(),
  color: t.String(),
  status: t.Optional(t.Union([t.Boolean(), t.String()], { default: true })),
});
export type BodyTag = typeof BodyTag.static;

export const UpdateBodyTag = t.Object({
  name: t.Optional(t.String()),
  color: t.Optional(t.String()),
  status: t.Optional(t.Union([t.Boolean(), t.String()])),
});
export type UpdateBodyTag = typeof UpdateBodyTag.static;
