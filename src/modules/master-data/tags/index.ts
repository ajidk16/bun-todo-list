import { Elysia, t } from "elysia";
import { listOfTags } from "./service";
import { QueryTags } from "./model";

export const tagsController = new Elysia({ prefix: "/tags" }).get(
  "/",
  async ({ query: { page, limit, search }, status }) => {
    const offset = (page - 1) * limit;
    const searchTerm = search?.toLowerCase() ?? "";

    const { total, payload: tags } = await listOfTags({
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
);
