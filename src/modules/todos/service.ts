import { and, eq, sql } from "drizzle-orm";
import { db } from "../../db/clients";
import { todos } from "../../db/schema";
import { filterTodos, newTodo } from "./model";

export const listTodos = async ({
  userId,
  page,
  limit,
  search,
}: filterTodos) => {
  const searchQuery = `%${search}%`;

  const payload = await db.query.todos.findMany({
    with: {
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
    where: (todo, { sql }) =>
      and(
        eq(todo.userId, String(userId)),
        sql`(${todo.title} ILIKE ${searchQuery} OR ${todo.description} ILIKE ${searchQuery})`
      ),
  });

  const totalResult = await db
    .select({ count: sql`count(*)`.mapWith(Number) })
    .from(todos)
    .where(eq(todos.userId, String(userId)));

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
