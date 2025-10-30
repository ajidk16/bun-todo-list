import { count } from "drizzle-orm";
import { db } from "../../../db/clients";
import { QueryTags } from "./model";
import { tags } from "../../../db/schema";

export const listOfTags = async ({
  page = 1,
  limit = 10,
  search,
}: QueryTags) => {
  const searchQuery = `%${search}%`;

  const payload = await db.query.tags.findMany({
    with: {
      todosTags: {
        with: {
          todo: {
            columns: {
              id: true,
              title: true,
              description: true,
              isCompleted: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
    },
    offset: page,
    limit,
    where: (fields, { ilike, or }) =>
      or(ilike(fields.name, searchQuery), ilike(fields.color, searchQuery)),
  });

  // total count can be added if needed
  const total =
    (await db.select({ count: count() }).from(tags)).at(0)?.count ?? 0;

  return { total, payload };
};
