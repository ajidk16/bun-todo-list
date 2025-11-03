import { and, asc, count, eq, ilike, or } from "drizzle-orm";
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
  userId,
  status,
}: QueryTags) => {
  const searchQuery = `%${search}%`;

  let seachCondition;
  if (search) {
    seachCondition = or(
      ilike(statuses.name, searchQuery),
      ilike(statuses.label, searchQuery),
      ilike(statuses.color, searchQuery)
    );
  }

  let statusCondition;
  if (status !== undefined) {
    const statusBoolean =
      typeof status === "string" ? status.toLowerCase() === "true" : status;
    statusCondition = eq(statuses.status, statusBoolean);
  }

  const baseCondition = eq(statuses.userId, String(userId));

  const whereCondition = and(seachCondition, baseCondition, statusCondition);

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
    orderBy: (fields) => [asc(fields.sortOrder)],
    where: () => whereCondition,
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
  userId,
  sortOrder,
  status,
}: CreateTodoStatusSchema) => {
  const newTodoStatus = await db
    .insert(statuses)
    .values({
      userId: String(userId),
      name,
      label,
      color,
      sortOrder,
      status: Boolean(status),
    })
    .returning();

  return newTodoStatus;
};

export const updateTodoStatus = async (
  id: string,
  { name, label, color, userId, sortOrder, status }: UpdateTodoStatusSchema
) => {
  const updatedTodoStatus = await db
    .update(statuses)
    .set({
      name,
      label,
      color,
      userId,
      sortOrder,
      status: Boolean(status),
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
