import { Elysia, t } from "elysia";
import { createTag, getTagById, listOfTags, updateTag } from "./service";
import { BodyTag, QueryTags, UpdateBodyTag } from "./model";

export const tagsController = new Elysia({ prefix: "/tags" })
  .get(
    "/",
    async ({ query: { page, limit, search }, status, set }) => {
      const offset = (Number(page) - 1) * Number(limit);
      const searchTerm = search?.toLowerCase() ?? "";

      const { total, payload: tags } = await listOfTags({
        limit,
        page: offset,
        search: searchTerm,
        userId: String(set.headers["x-user-id"]),
      });

      return (
        status(200),
        {
          status: 200,
          message: "Tags retrieved successfully",
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
  .get(":id", async ({ params, status }) => {
    // Logic to get a tag by ID
    const tag = await getTagById(params.id); // Assume this function is defined in service.ts
    if (!tag) {
      return status(404, { status: 404, message: "Tag not found" });
    }
    return status(200, { data: tag });
  })
  .post(
    "/",
    async ({ body: { name, color }, status, set }) => {
      const newTag = await createTag(
        String(set.headers["x-user-id"]),
        name,
        color
      );

      if (!newTag) {
        return status(500, {
          status: 500,
          message: "Failed to create tag",
        });
      }

      return status(201, {
        status: 201,
        message: "Tag created successfully",
        data: newTag,
      });
    },
    {
      body: BodyTag,
    }
  )
  .put(
    "/:id",
    async ({ params: { id }, body: { name, color }, status }) => {
      if (!id) {
        return status(400, {
          status: 400,
          message: "Tag ID is required",
        });
      }

      const findedTag = await getTagById(id);
      if (!findedTag) {
        return status(404, {
          status: 404,
          message: "Tag not found",
        });
      }

      const updatedTag = await updateTag(id, String(name), String(color));

      if (!updatedTag) {
        return status(404, {
          status: 404,
          message: "Tag not found",
        });
      }

      return status(200, {
        status: 200,
        message: "Tag updated successfully",
        data: updatedTag,
      });
    },
    {
      params: t.Object({ id: t.String() }),
      body: UpdateBodyTag,
    }
  )
  .delete(
    "/:id",
    async ({ params: { id }, status }) => {
      // Logic to delete a tag by ID
      return status(200, { message: "Tag deleted successfully" });
    },
    {
      params: t.Object({ id: t.String() }),
    }
  );
