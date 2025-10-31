import { and, count, eq, ilike, or } from "drizzle-orm";
import { db } from "../../../db/clients";
import { QueryTags } from "./model";
import { tags } from "../../../db/schema";

export const listOfTags = async ({
  page = 1,
  limit = 10,
  search,
  userId,
}: QueryTags) => {
  const searchQuery = `%${search}%`;

  const filterUser = eq(tags.userId, String(userId));

  const whereCondition = and(
    filterUser,
    or(ilike(tags.name, searchQuery), ilike(tags.color, searchQuery))
  );

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
    orderBy: (tags, { desc }) => [desc(tags.createdAt)],
    where: () => whereCondition,
  });

  // total count can be added if needed
  const total =
    (await db.select({ count: count() }).from(tags)).at(0)?.count ?? 0;

  return { total, payload };
};

export const getTagById = async (id: string) => {
  const tag = await db.query.tags.findFirst({
    where: eq(tags.id, id),
  });

  return tag;
};

export const createTag = async (
  userId: string,
  name: string,
  color: string
) => {
  const [newTag] = await db
    .insert(tags)
    .values({ name, color, userId })
    .returning();

  return newTag;
};

export const updateTag = async (id: string, name: string, color: string) => {
  const [updatedTag] = await db
    .update(tags)
    .set({ name, color })
    .where(eq(tags.id, id))
    .returning();

  return updatedTag;
};

export const deleteTag = async (id: string) => {
  return await db.delete(tags).where(eq(tags.id, id));
};
