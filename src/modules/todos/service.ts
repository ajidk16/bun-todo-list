import { and, eq, sql, inArray } from "drizzle-orm";
import { db } from "../../db/clients";
import dayjs from "dayjs";
import { tags, todos, todosTags } from "../../db/schema";
import { filterTodos, newTodo } from "./model";

const now = dayjs();

export const listTodos = async ({
  userId,
  page = 0,
  limit = 10,
  search = "",
  dateFilter,
}: filterTodos) => {
  const searchQuery = `%${search}%`;
  let dateCondition;

  // Function to get date range based on dateFilter
  const getDateRange = () => {
    switch (dateFilter) {
      case "day":
        return {
          from: now.startOf("day").toISOString(),
          to: now.endOf("day").toISOString(),
        };
      case "week":
        return {
          from: now.startOf("week").toISOString(),
          to: now.endOf("week").toISOString(),
        };
      case "month":
        return {
          from: now.startOf("month").toISOString(),
          to: now.endOf("month").toISOString(),
        };
      default:
        return null;
    }
  };

  // Build date condition if dateFilter is provided
  const dateRange = getDateRange();
  if (dateRange) {
    dateCondition = and(
      sql`${todos.createdAt} >= ${dateRange.from}`,
      sql`${todos.createdAt} <= ${dateRange.to}`
    );
  }

  // Combine base condition with date condition if applicable
  const baseCondition = and(
    eq(todos.userId, String(userId)),
    sql`(${todos.title} ILIKE ${searchQuery} OR ${todos.description} ILIKE ${searchQuery})`
  );

  const whereCondition = dateCondition
    ? and(baseCondition, dateCondition)
    : baseCondition;

  const [payload, totalResult] = await Promise.all([
    db.query.todos.findMany({
      with: {
        todosTags: {
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
        user: {
          columns: {
            id: true,
            username: true,
            email: true,
            verifiedEmail: true,
          },
        },
        status: {
          columns: {
            id: true,
            name: true,
            label: true,
            color: true,
          },
        },
      },
      limit,
      offset: page,
      orderBy: (todo) => [sql`${todo.createdAt} DESC`],
      where: () => whereCondition,
    }),
    db
      .select({ count: sql`count(*)`.mapWith(Number) })
      .from(todos)
      .where(() => whereCondition),
  ]);

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
      statusId: status,
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

  const tagNames: string[] = Array.isArray(data.tags)
    ? data.tags
    : typeof data.tags === "string"
      ? data.tags.split(",").map((t) => t.trim())
      : [];

  const [updatedTodo] = await db
    .update(todos)
    .set({
      title: data.title,
      description: data.description,
      isCompleted: data.isCompleted,
      statusId: data.status,
      priority: data.priority,
      updatedAt: new Date(),
    })
    .where(eq(todos.id, id))
    .returning();

  // filter tags ketika ada data tags yang dikirmkan pada update, apabila data tags tidak dikirimkan, maka tags tidak diupdate
  if (data.tags !== undefined) {
    // Hapus relasi tags lama
    await db.delete(todosTags).where(eq(todosTags.todoId, id));

    // Masukkan relasi tags baru
    for (const tagName of tagNames) {
      const randomColor =
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0");

      // Cek apakah tag dengan nama dan userId yang sama sudah ada
      const [existingTag] = await db
        .select()
        .from(tags)
        .where(
          and(
            eq(tags.name, tagName),
            eq(tags.userId, String(updatedTodo.userId))
          )
        );

      let tagId: string;

      if (existingTag) {
        // Update warna jika tag sudah ada
        const [updatedTag] = await db
          .update(tags)
          .set({ color: randomColor })
          .where(eq(tags.id, existingTag.id))
          .returning();
        tagId = updatedTag.id;
      } else {
        // Masukkan tag baru
        const [newTag] = await db
          .insert(tags)
          .values({
            userId: String(updatedTodo.userId),
            name: tagName,
            color: randomColor,
          })
          .returning();
        tagId = newTag.id;
      }

      // Relasikan todo dan tag
      await db.insert(todosTags).values({
        todoId: updatedTodo.id,
        tagId,
      });
    }
  }

  return updatedTodo;
};

export const deleteTodo = async (userId: string, id: string) => {
  const del = await db
    .delete(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, String(userId))));

  return del;
};
