import { eq, sql } from "drizzle-orm";
import { db } from "../../db/clients";
import { todos } from "../../db/schema";
import { filterTodos, newTodo } from "./model";

export const listTodos = async ({ page, limit, search }: filterTodos) => {
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
      sql`${todo.title} ILIKE ${searchQuery} OR ${todo.description} ILIKE ${searchQuery}`,
  });

  const totalResult = await db
    .select({ count: sql`count(*)`.mapWith(Number) })
    .from(todos);

  const total = totalResult[0]?.count || 0;

  return { todos: payload, total };
};

export const getTodoById = async (id: string) => {
  const todo = await db.query.todos.findFirst({
    where: eq(todos.id, id),
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
  const [insert] = await db
    .insert(todos)
    .values({
      userId,
      title,
      description,
      isCompleted,
      status,
      priority,
    })
    .returning();
  console.log("Inserted todo:", insert);

  return insert;
};

export const updateTodo = async (id: string, data: Partial<newTodo>) => {
  const [update] = await db
    .update(todos)
    .set(data)
    .where(eq(todos.id, id))
    .returning();
  console.log("Updated todo:", update);

  return update;
};

export const deleteTodo = async (id: string) => {
  const del = await db.delete(todos).where(eq(todos.id, id));
  console.log("Deleted todo with id:", id);

  return del;
};
