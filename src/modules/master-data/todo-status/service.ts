import { count, eq } from "drizzle-orm";
import { db } from "../../../db/clients";
import {
  CreateTodoStatusSchema,
  QueryTags,
  UpdateTodoStatusSchema,
} from "./model";
import { statuses } from "../../../db/schema";

export const listOfTodoStatus = async ({
  page = 1,
  limit = 10,
  search,
}: QueryTags) => {
  const searchQuery = `%${search}%`;

  const payload = await db.query.statuses.findMany({
    with: {
      todos: {
        columns: {
          id: true,
          title: true,
          description: true,
          isCompleted: true,
          priority: true,
        },
        with: {
          user: {
            columns: {
              id: true,
              email: true,
              username: true,
            },
          },
          todosTags: {
            columns: {
              tagId: false,
              todoId: false,
              createdAt: false,
            },
            with: {
              tag: {
                columns: {
                  id: true,
                  name: true,
                  color: true,
                },
              },
            },
          },
        },
      },
    },
    offset: page,
    limit,
    where: (fields, { ilike, or }) =>
      or(ilike(fields.name, searchQuery), ilike(fields.label, searchQuery)),
  });

  // total count can be added if needed
  const total =
    (await db.select({ count: count() }).from(statuses)).at(0)?.count ?? 0;

  return { total, payload };
};

export const getTodoStatusById = async (id: string) => {
  const todoStatus = await db.query.statuses.findFirst({
    where: eq(statuses.id, id),
  });

  return todoStatus;
};

export const createTodoStatus = async ({
  name,
  label,
  color,
}: CreateTodoStatusSchema) => {
  const newTodoStatus = await db
    .insert(statuses)
    .values({
      name,
      label,
      color,
    })
    .returning();

  return newTodoStatus;
};

export const updateTodoStatus = async (
  id: string,
  { name, label, color }: UpdateTodoStatusSchema
) => {
  const updatedTodoStatus = await db
    .update(statuses)
    .set({
      name,
      label,
      color,
    })
    .where(eq(statuses.id, id))
    .returning();

  return updatedTodoStatus;
};

export const deleteTodoStatus = async (id: string) => {
  const deletedTodoStatus = await db
    .delete(statuses)
    .where(eq(statuses.id, id))
    .returning();

  return deletedTodoStatus;
};
