import { z } from "zod";

export const newTodo = z.object({
  userId: z.string().optional(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  isCompleted: z.coerce.boolean().optional(),
  status: z
    .enum(["pending", "in_progress", "completed", "archived"])
    .optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
});

export type newTodo = z.infer<typeof newTodo>;

export const filterTodos = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  search: z.string().optional().default(""),
  userId: z.string().optional(),
});
export type filterTodos = z.infer<typeof filterTodos>;