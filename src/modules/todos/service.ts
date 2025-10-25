import { and, eq, sql } from "drizzle-orm";
import { db } from "../../db/clients";
import { todos } from "../../db/schema";
import { filterTodos, newTodo } from "./model";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

export const listTodos = async ({
  userId,
  page,
  limit,
  search,
  dateFilter,
}: filterTodos) => {
  const searchQuery = `%${search}%`;
  let dateCondition = undefined;

  if (dateFilter === "day") {
    dateCondition = and(
      sql`${todos.createdAt} >= ${startOfDay(new Date())}`,
      sql`${todos.createdAt} <= ${endOfDay(new Date())}`
    );
  } else if (dateFilter === "week") {
    dateCondition = and(
      sql`${todos.createdAt} >= ${startOfWeek(new Date())}`,
      sql`${todos.createdAt} <= ${endOfWeek(new Date())}`
    );
  } else if (dateFilter === "month") {
    dateCondition = and(
      sql`${todos.createdAt} >= ${startOfMonth(new Date())}`,
      sql`${todos.createdAt} <= ${endOfMonth(new Date())}`
    );
  }

  const payload = await db.query.todos.findMany({
    with: {
      todosTags: {
        with: {
          tag: true,
        },
      },
      user: {
        columns: {
          id: true,
          username: true,
          email: true,
          verifiedEmail: true,
        },
      },
    },
    limit,
    offset: page,
    where: (todo, { sql }) => {
      const baseCondition = and(
        eq(todo.userId, String(userId)),
        sql`(${todo.title} ILIKE ${searchQuery} OR ${todo.description} ILIKE ${searchQuery})`
      );
      if (dateCondition) {
        return and(baseCondition, dateCondition);
      }
      return baseCondition;
    },
  });

  const totalResult = await db
    .select({ count: sql`count(*)`.mapWith(Number) })
    .from(todos)
    .where(() => {
      const baseCondition = and(
        eq(todos.userId, String(userId)),
        sql`(${todos.title} ILIKE ${searchQuery} OR ${todos.description} ILIKE ${searchQuery})`
      );
      if (dateCondition) {
        return and(baseCondition, dateCondition);
      }
      return baseCondition;
    });

  const total = totalResult[0]?.count || 0;

  return { todos: payload, total };
};

export const getTodoById = async (userId: string, id: string) => {
  const todo = await db.query.todos.findFirst({
    where: and(eq(todos.id, id), eq(todos.userId, String(userId))),
  });

  return todo;
};

export const createTodo = async ({
  title,
  description,
  userId,
  isCompleted,
  status,
  priority,
}: newTodo) => {
  if (typeof userId !== "string") {
    throw new Error("userId is required and must be a string");
  }
  const [insert] = await db
    .insert(todos)
    .values({
      userId: String(userId),
      title,
      description,
      isCompleted,
      status,
      priority,
    })
    .returning();

  return insert;
};

export const updateTodo = async (id: string, data: Partial<newTodo>) => {
  const [update] = await db
    .update(todos)
    .set(data)
    .where(eq(todos.id, id))
    .returning();

  return update;
};

export const deleteTodo = async (userId: string, id: string) => {
  const del = await db
    .delete(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, String(userId))));

  return del;
};
