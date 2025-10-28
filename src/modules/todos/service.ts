import { and, eq, sql } from "drizzle-orm";
import { db } from "../../db/clients";
import dayjs from "dayjs";
import { tags, todos, todosTags } from "../../db/schema";
import { filterTodos, newTodo } from "./model";

const now = dayjs();

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
      sql`${todos.createdAt} >= ${now.startOf("day").toDate()}`,
      sql`${todos.createdAt} <= ${now.endOf("day").toDate()}`
    );
  } else if (dateFilter === "week") {
    dateCondition = and(
      sql`${todos.createdAt} >= ${now.startOf("week").toDate()}`,
      sql`${todos.createdAt} <= ${now.endOf("week").toDate()}`
    );
  } else if (dateFilter === "month") {
    dateCondition = and(
      sql`${todos.createdAt} >= ${now.startOf("month").toDate()}`,
      sql`${todos.createdAt} <= ${now.endOf("month").toDate()}`
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
    orderBy: (todo) => [sql`${todo.createdAt} DESC`],
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
  tags: todoTags,
}: newTodo) => {
  if (typeof userId !== "string") {
    throw new Error("userId is required and must be a string");
  }

  const tagNames: string[] = Array.isArray(todoTags)
    ? todoTags
    : typeof todoTags === "string"
      ? todoTags.split(",").map((t) => t.trim())
      : [];

  // First, insert the todo
  const [insertedTodo] = await db
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

  // Insert or update tags to ensure unique name per user
  for (const tagName of tagNames) {
    const randomColor =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");

    // Check if tag with same name and userId exists
    const [existingTag] = await db
      .select()
      .from(tags)
      .where(and(eq(tags.name, tagName), eq(tags.userId, String(userId))));

    let tagId: string;

    if (existingTag) {
      // Update color if tag exists
      const [updatedTag] = await db
        .update(tags)
        .set({ color: randomColor })
        .where(eq(tags.id, existingTag.id))
        .returning();
      tagId = updatedTag.id;
    } else {
      // Insert new tag
      const [newTag] = await db
        .insert(tags)
        .values({
          userId: String(userId),
          name: tagName,
          color: randomColor,
        })
        .returning();
      tagId = newTag.id;
    }

    // Relate the todo and tag
    await db.insert(todosTags).values({
      todoId: insertedTodo.id,
      tagId,
    });
  }

  return insertedTodo;
};

export const updateTodo = async (id: string, data: Partial<newTodo>) => {
  if (id === undefined) {
    throw new Error("Todo ID is required for update");
  }

  // console.log("Updating todo with data:", data);
  // return;

  const tagNames: string[] = Array.isArray(data.tags)
    ? data.tags
    : typeof data.tags === "string"
      ? data.tags.split(",").map((t) => t.trim())
      : [];

  const [updatedTodo] = await db
    .update(todos)
    .set(data)
    .where(eq(todos.id, id))
    .returning();

  if (tagNames.length > 0) {
    tagNames.map(async (tagName) => {
      const randomColor =
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0");
      const [newTag] = await db
        .update(tags)
        .set({
          name: tagName,
          color: randomColor,
        })
        .where(and(eq(tags.name, tagName), eq(tags.id, id)))
        .returning();
    });
  }

  return updatedTodo;
};

export const deleteTodo = async (userId: string, id: string) => {
  const del = await db
    .delete(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, String(userId))));

  return del;
};
