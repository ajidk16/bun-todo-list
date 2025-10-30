import z from "zod";

export const QueryTags = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  search: z.coerce.string().optional().default(""),
});
export type QueryTags = z.infer<typeof QueryTags>;
