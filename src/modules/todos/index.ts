import { Elysia } from "elysia";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  listTodos,
  updateTodo,
} from "./service";
import { filterTodos, newTodo } from "./model";
import z from "zod";
import { jwtPlugin } from "../../plugin/jwt";
import bearer from "@elysiajs/bearer";

export const todoController = new Elysia({ prefix: "/todos" })
  .use(jwtPlugin)
  .use(bearer())
  .get(
    "/",
    async ({ query: { page, limit, search, dateFilter }, status, set }) => {
      const offset = (page - 1) * limit;
      const searchTerm = search.toLowerCase() ?? "";

      const { todos, total } = await listTodos({
        userId: String(set.headers["x-user-id"]),
        search: searchTerm,
        page: offset,
        limit,
        dateFilter,
      });

      return status(200, {
        message: "List of todos",
        data: todos,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    },
    {
      query: filterTodos,
    }
  )
  .get("/:id", async ({ params, status, set }) => {
    const todo = await getTodoById(String(set.headers["x-user-id"]), params.id);
    return status(200, {
      message: `Get todo with id ${params.id}`,
      data: todo,
    });
  })
  .post(
    "/",
    async ({
      body: {
        title,
        description,
        isCompleted,
        status: isStatus,
        priority,
        tags,
      },
      status,
      set,
    }) => {
      // Convert tags array to comma-separated string if it's an array

      const todo = await createTodo({
        title,
        description,
        userId: String(set.headers["x-user-id"]),
        isCompleted,
        status: isStatus,
        priority,
        tags,
      });
      return status(201, { message: "Todo created", data: todo });
    },
    {
      body: newTodo,
    }
  )
  .put(
    "/:id",
    async ({ params, body, status }) => {
      const id = params.id;
      const {
        title,
        description,
        isCompleted,
        status: isStatus,
        priority,
        tags,
      } = body;

      const updatedTodo = await updateTodo(id, {
        title,
        description,
        isCompleted,
        status: isStatus,
        priority,
        tags,
      });

      return status(200, { message: "Todo updated", data: updatedTodo });
    },
    {
      params: z.object({
        id: z.string(),
      }),
      body: newTodo.partial(),
    }
  )
  .delete("/:id", async ({ params: { id }, status, set }) => {
    const todo = await deleteTodo(String(set.headers["x-user-id"]), id);
    return (status(200), { message: "Todo deleted", data: todo });
  });
