import { Elysia, t } from "elysia";
import { createTodoStatus, listOfTodoStatus } from "./service";
import { createTodoStatusSchema, QueryTags } from "./model";

export const todoStatusController = new Elysia({ prefix: "/todo-status" })
  .get(
    "/",
    async ({ query: { page, limit, search }, status }) => {
      const offset = (page - 1) * limit;
      const searchTerm = search?.toLowerCase() ?? "";

      const { total, payload: tags } = await listOfTodoStatus({
        limit,
        page: offset,
        search: searchTerm,
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
            totalPages: Math.ceil(total / limit),
          },
        }
      );
    },
    {
      query: QueryTags,
    }
  )
  .post(
    "/",
    async ({ body: { name, label, color }, status }) => {
      const newStatus = await createTodoStatus({ name, label, color });

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
  );
