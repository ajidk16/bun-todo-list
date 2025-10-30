import z from "zod";

export const QueryTags = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  search: z.coerce.string().optional().default(""),
});
export type QueryTags = z.infer<typeof QueryTags>;


export const createTodoStatusSchema = z.object({
  name: z.string().min(1, "Name is required"),
  label: z.string().min(1, "Label is required"),
  color: z.string().min(1, "Color is required"),
});
export type CreateTodoStatusSchema = z.infer<typeof createTodoStatusSchema>;

export const updateTodoStatusSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  label: z.string().min(1, "Label is required").optional(),
  color: z.string().min(1, "Color is required").optional(),
});
export type UpdateTodoStatusSchema = z.infer<typeof updateTodoStatusSchema>;