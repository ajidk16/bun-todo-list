import { Elysia, t } from "elysia";
import {
  createTodoStatus,
  deleteTodoStatus,
  getTodoStatusById,
  listOfTodoStatus,
  updateTodoStatus,
} from "./service";
import {
  createTodoStatusSchema,
  QueryTags,
  updateTodoStatusSchema,
} from "./model";
import z from "zod";

export const todoStatusController = new Elysia({ prefix: "/todo-status" })
  .get(
    "/",
    async ({ query: { page, limit, search }, status, set }) => {
      const offset = (Number(page) - 1) * Number(limit);
      const searchTerm = search?.toLowerCase() ?? "";

      const { total, payload: tags } = await listOfTodoStatus({
        limit,
        page: offset,
        search: searchTerm,
        userId: String(set.headers["x-user-id"]),
      });

      return (
        status(200),
        {
          status: 200,
          data: tags,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / Number(limit)),
          },
        }
      );
    },
    {
      query: QueryTags,
    }
  )
  .get(
    "/:id",
    async ({ params: { id }, status }) => {
      const tag = await getTodoStatusById(id);

      if (!tag) {
        return status(404, { message: "Todo status not found" });
      }

      return status(200, {
        message: `Get todo status with id ${id}`,
        data: tag,
      });
    },
    {
      params: z.object({
        id: z.string().uuid(),
      }),
    }
  )
  .post(
    "/",
    async ({ body: { name, label, color, sortOrder }, status, set }) => {
      const newStatus = await createTodoStatus({
        userId: String(set.headers["x-user-id"]),
        name,
        label,
        color,
        sortOrder,
      });

      if (!newStatus) {
        return status(400, { message: "Failed to create todo status" });
      }

      return status(201, {
        message: "Todo status created",
        data: newStatus,
      });
    },
    {
      body: createTodoStatusSchema,
    }
  )
  .put(
    "/:id",
    async ({
      body: { name, label, color, sortOrder },
      params: { id },
      status,
      set,
    }) => {
      const findStatus = await getTodoStatusById(id);

      if (!findStatus) {
        return status(404, { status: 404, message: "Todo status not found" });
      }

      const updatedStatus = await updateTodoStatus(id, {
        name,
        label,
        color,
        sortOrder,
        userId: String(set.headers["x-user-id"]),
      });

      if (!updatedStatus) {
        return status(400, { message: "Failed to update todo status" });
      }

      return status(200, {
        message: "Todo status updated",
        data: updatedStatus,
      });
    },
    {
      body: updateTodoStatusSchema,
    }
  )
  .delete("/:id", async ({ params: { id }, status }) => {
    const deletedStatus = await deleteTodoStatus(id);

    if (!deletedStatus) {
      return status(400, { message: "Failed to delete todo status" });
    }

    return status(200, {
      message: "Todo status deleted",
      data: deletedStatus,
    });
  });
