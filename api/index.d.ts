import * as elysia0 from "elysia";
import { Elysia } from "elysia";
import * as _sinclair_typebox_errors0 from "@sinclair/typebox/errors";
import * as elysia_error0 from "elysia/error";

//#region src/server.d.ts
declare const app: Elysia<"", {
  decorator: {};
  store: {};
  derive: {};
  resolve: {};
}, {
  typebox: {};
  error: {};
}, {
  schema: {};
  standaloneSchema: {};
  macro: {};
  macroFn: {};
  parser: {};
  response: {};
}, {
  get: {
    body: unknown;
    params: {};
    query: unknown;
    headers: unknown;
    response: {
      200: {
        error: string;
        details: ({
          summary: undefined;
        } | {
          summary: string;
        } | {
          summary: string;
          type: _sinclair_typebox_errors0.ValueErrorType;
          schema: elysia0.TSchema;
          path: string;
          value: unknown;
          message: string;
          errors: _sinclair_typebox_errors0.ValueErrorIterator[];
        })[];
        status?: undefined;
        message?: undefined;
      } | {
        status: string;
        error: string;
        message: Readonly<Error> | Readonly<elysia0.ParseError> | Readonly<elysia0.InternalServerError> | Readonly<elysia0.InvalidCookieSignature> | Readonly<elysia_error0.InvalidFileType> | Readonly<elysia0.ElysiaCustomStatusResponse<number, number, number>>;
        details?: undefined;
      } | {
        message: string;
      };
      404: {
        readonly status: 404;
        readonly error: "Resource not found";
      };
    };
  };
} & {
  suraji: {
    get: {
      body: unknown;
      params: {};
      query: unknown;
      headers: unknown;
      response: {
        200: {
          error: string;
          details: ({
            summary: undefined;
          } | {
            summary: string;
          } | {
            summary: string;
            type: _sinclair_typebox_errors0.ValueErrorType;
            schema: elysia0.TSchema;
            path: string;
            value: unknown;
            message: string;
            errors: _sinclair_typebox_errors0.ValueErrorIterator[];
          })[];
          status?: undefined;
          message?: undefined;
        } | {
          status: string;
          error: string;
          message: Readonly<Error> | Readonly<elysia0.ParseError> | Readonly<elysia0.InternalServerError> | Readonly<elysia0.InvalidCookieSignature> | Readonly<elysia_error0.InvalidFileType> | Readonly<elysia0.ElysiaCustomStatusResponse<number, number, number>>;
          details?: undefined;
        } | {
          message: string;
        };
        404: {
          readonly status: 404;
          readonly error: "Resource not found";
        };
      };
    };
  };
} & {
  api: {
    v1: {
      auth: {};
    } & {
      auth: {
        login: {
          post: {
            body: {
              username: string;
              password: string;
            };
            params: {};
            query: unknown;
            headers: unknown;
            response: {
              [x: string]: any;
              [x: number]: any;
              [x: symbol]: any;
            };
          };
        };
      };
    } & {
      auth: {
        register: {
          post: {
            body: {
              username: string;
              password: string;
              email: string;
            };
            params: {};
            query: unknown;
            headers: unknown;
            response: {
              [x: string]: any;
              [x: number]: any;
              [x: symbol]: any;
            };
          };
        };
      };
    } & {
      auth: {
        logout: {
          post: {
            body: unknown;
            params: {};
            query: unknown;
            headers: unknown;
            response: {
              [x: string]: any;
              [x: number]: any;
              [x: symbol]: any;
            };
          };
        };
      };
    } & {
      auth: {
        refresh: {
          post: {
            body: unknown;
            params: {};
            query: unknown;
            headers: unknown;
            response: {
              [x: string]: any;
              [x: number]: any;
              [x: symbol]: any;
            };
          };
        };
      };
    };
  };
} & {
  api: {
    v1: {
      otp: {
        send: {
          get: {
            body: unknown;
            params: {};
            query: {
              otp?: string | undefined;
            };
            headers: unknown;
            response: {
              200: {
                status: boolean;
                message: string;
                data: string;
              };
              422: {
                type: "validation";
                on: string;
                summary?: string;
                message?: string;
                found?: unknown;
                property?: string;
                expected?: string;
              };
            };
          };
        };
      };
    } & {
      otp: {
        verify: {
          get: {
            body: unknown;
            params: {};
            query: {
              otp?: string | undefined;
            };
            headers: unknown;
            response: {
              200: {
                status: boolean;
                error: string;
                message?: undefined;
                data?: undefined;
              } | {
                status: number;
                message: string;
                data: {
                  success: boolean;
                  error: string;
                  data?: undefined;
                } | {
                  data: {
                    id: string;
                    username: string;
                    email: string;
                    verifiedEmail: boolean;
                    passwordHash: string;
                    createdAt: Date;
                    updatedAt: Date;
                  };
                  success?: undefined;
                  error?: undefined;
                };
                error?: undefined;
              };
              422: {
                type: "validation";
                on: string;
                summary?: string;
                message?: string;
                found?: unknown;
                property?: string;
                expected?: string;
              };
            };
          };
        };
      };
    };
  };
} & {
  api: {
    v1: {
      todos: {};
    } & {
      todos: {
        get: {
          body: unknown;
          params: {};
          query: {
            page: number;
            limit: number;
            search: string;
            userId?: string | undefined;
            dateFilter?: "" | "day" | "week" | "month" | undefined;
          };
          headers: unknown;
          response: {
            [x: string]: any;
            [x: number]: any;
            [x: symbol]: any;
          };
        };
      };
    } & {
      todos: {
        ":id": {
          get: {
            body: unknown;
            params: {
              id: string;
            };
            query: unknown;
            headers: unknown;
            response: {
              [x: string]: any;
              [x: number]: any;
              [x: symbol]: any;
            };
          };
        };
      };
    } & {
      todos: {
        post: {
          body: {
            title: string;
            userId?: string | undefined;
            description?: string | undefined;
            isCompleted?: boolean | undefined;
            status?: string | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
            tags?: string | undefined;
          };
          params: {};
          query: unknown;
          headers: unknown;
          response: {
            [x: string]: any;
            [x: number]: any;
            [x: symbol]: any;
          };
        };
      };
    } & {
      todos: {
        ":id": {
          put: {
            body: {
              userId?: string | undefined;
              title?: string | undefined;
              description?: string | undefined;
              isCompleted?: boolean | undefined;
              status?: string | undefined;
              priority?: "low" | "medium" | "high" | "urgent" | undefined;
              tags?: string | undefined;
            };
            params: {
              id: string;
            };
            query: unknown;
            headers: unknown;
            response: {
              [x: string]: any;
              [x: number]: any;
              [x: symbol]: any;
            };
          };
        };
      };
    } & {
      todos: {
        ":id": {
          delete: {
            body: unknown;
            params: {
              id: string;
            };
            query: unknown;
            headers: unknown;
            response: {
              [x: string]: any;
              [x: number]: any;
              [x: symbol]: any;
            };
          };
        };
      };
    };
  };
} & {
  api: {
    v1: {
      tags: {
        get: {
          body: unknown;
          params: {};
          query: {
            search?: string | undefined;
            userId?: string | undefined;
            limit?: number | undefined;
            page?: number | undefined;
          };
          headers: unknown;
          response: {
            200: {
              status: number;
              message: string;
              data: {
                name: string;
                id: string;
                createdAt: Date;
                userId: string;
                color: string | null;
                todosTags: {
                  createdAt: Date;
                  todoId: string;
                  tagId: string;
                  todo: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    description: string | null;
                    isCompleted: boolean | null;
                  };
                }[];
              }[];
              pagination: {
                page: number | undefined;
                limit: number | undefined;
                total: number;
                totalPages: number;
              };
            };
            422: {
              type: "validation";
              on: string;
              summary?: string;
              message?: string;
              found?: unknown;
              property?: string;
              expected?: string;
            };
          };
        };
      };
    } & {
      tags: {
        ":id": {
          get: {
            body: unknown;
            params: {
              id: string;
            };
            query: unknown;
            headers: unknown;
            response: {
              200: {
                readonly data: {
                  name: string;
                  id: string;
                  createdAt: Date;
                  userId: string;
                  color: string | null;
                };
              };
              404: {
                readonly status: 404;
                readonly message: "Tag not found";
              };
              422: {
                type: "validation";
                on: string;
                summary?: string;
                message?: string;
                found?: unknown;
                property?: string;
                expected?: string;
              };
            };
          };
        };
      };
    } & {
      tags: {
        post: {
          body: {
            name: string;
            color: string;
          };
          params: {};
          query: unknown;
          headers: unknown;
          response: {
            201: {
              readonly status: 201;
              readonly message: "Tag created successfully";
              readonly data: {
                name: string;
                id: string;
                createdAt: Date;
                userId: string;
                color: string | null;
              };
            };
            422: {
              type: "validation";
              on: string;
              summary?: string;
              message?: string;
              found?: unknown;
              property?: string;
              expected?: string;
            };
            500: {
              readonly status: 500;
              readonly message: "Failed to create tag";
            };
          };
        };
      };
    } & {
      tags: {
        ":id": {
          put: {
            body: {
              name?: string | undefined;
              color?: string | undefined;
            };
            params: {
              id: string;
            };
            query: unknown;
            headers: unknown;
            response: {
              200: {
                readonly status: 200;
                readonly message: "Tag updated successfully";
                readonly data: {
                  id: string;
                  userId: string;
                  name: string;
                  color: string | null;
                  createdAt: Date;
                };
              };
              400: {
                readonly status: 400;
                readonly message: "Tag ID is required";
              };
              404: {
                readonly status: 404;
                readonly message: "Tag not found";
              };
              422: {
                type: "validation";
                on: string;
                summary?: string;
                message?: string;
                found?: unknown;
                property?: string;
                expected?: string;
              };
            };
          };
        };
      };
    } & {
      tags: {
        ":id": {
          delete: {
            body: unknown;
            params: {
              id: string;
            };
            query: unknown;
            headers: unknown;
            response: {
              200: {
                readonly message: "Tag deleted successfully";
              };
              422: {
                type: "validation";
                on: string;
                summary?: string;
                message?: string;
                found?: unknown;
                property?: string;
                expected?: string;
              };
            };
          };
        };
      };
    };
  };
} & {
  api: {
    v1: {
      "todo-status": {
        get: {
          body: unknown;
          params: {};
          query: {
            search?: string | undefined;
            userId?: string | undefined;
            limit?: number | undefined;
            page?: number | undefined;
          };
          headers: unknown;
          response: {
            200: {
              status: number;
              data: {
                name: string;
                id: string;
                userId: string;
                label: string;
                color: string | null;
                sortOrder: number | null;
                todos: {
                  id: string;
                  title: string;
                  description: string | null;
                  isCompleted: boolean | null;
                  priority: "low" | "medium" | "high" | "urgent" | null;
                  todosTags: {
                    tag: {
                      name: string;
                      id: string;
                      color: string | null;
                    };
                  }[];
                  user: {
                    username: string;
                    id: string;
                    email: string;
                  };
                }[];
              }[];
              pagination: {
                page: number | undefined;
                limit: number | undefined;
                total: number;
                totalPages: number;
              };
            };
            422: {
              type: "validation";
              on: string;
              summary?: string;
              message?: string;
              found?: unknown;
              property?: string;
              expected?: string;
            };
          };
        };
      };
    } & {
      "todo-status": {
        ":id": {
          get: {
            body: unknown;
            params: {
              id: string;
            };
            query: unknown;
            headers: unknown;
            response: {
              200: {
                readonly message: `Get todo status with id ${string}`;
                readonly data: {
                  name: string;
                  id: string;
                  userId: string;
                  label: string;
                  color: string | null;
                  sortOrder: number | null;
                };
              };
              404: {
                readonly message: "Todo status not found";
              };
              422: {
                type: "validation";
                on: string;
                summary?: string;
                message?: string;
                found?: unknown;
                property?: string;
                expected?: string;
              };
            };
          };
        };
      };
    } & {
      "todo-status": {
        post: {
          body: {
            userId?: string | undefined;
            name: string;
            label: string;
            color: string;
            sortOrder: number;
          };
          params: {};
          query: unknown;
          headers: unknown;
          response: {
            201: {
              readonly message: "Todo status created";
              readonly data: {
                name: string;
                id: string;
                userId: string;
                label: string;
                color: string | null;
                sortOrder: number | null;
              }[];
            };
            400: {
              readonly message: "Failed to create todo status";
            };
            422: {
              type: "validation";
              on: string;
              summary?: string;
              message?: string;
              found?: unknown;
              property?: string;
              expected?: string;
            };
          };
        };
      };
    } & {
      "todo-status": {
        ":id": {
          put: {
            body: {
              name?: string | undefined;
              userId?: string | undefined;
              label?: string | undefined;
              color?: string | undefined;
              sortOrder?: number | undefined;
            };
            params: {
              id: string;
            };
            query: unknown;
            headers: unknown;
            response: {
              200: {
                readonly message: "Todo status updated";
                readonly data: {
                  id: string;
                  userId: string;
                  name: string;
                  label: string;
                  color: string | null;
                  sortOrder: number | null;
                }[];
              };
              400: {
                readonly message: "Failed to update todo status";
              };
              404: {
                readonly status: 404;
                readonly message: "Todo status not found";
              };
              422: {
                type: "validation";
                on: string;
                summary?: string;
                message?: string;
                found?: unknown;
                property?: string;
                expected?: string;
              };
            };
          };
        };
      };
    } & {
      "todo-status": {
        ":id": {
          delete: {
            body: unknown;
            params: {
              id: string;
            };
            query: unknown;
            headers: unknown;
            response: {
              200: {
                readonly message: "Todo status deleted";
                readonly data: {
                  name: string;
                  id: string;
                  userId: string;
                  label: string;
                  color: string | null;
                  sortOrder: number | null;
                }[];
              };
              400: {
                readonly message: "Failed to delete todo status";
              };
              422: {
                type: "validation";
                on: string;
                summary?: string;
                message?: string;
                found?: unknown;
                property?: string;
                expected?: string;
              };
            };
          };
        };
      };
    };
  };
} & {
  api: {
    v1: {
      me: {
        get: {
          body: unknown;
          params: {};
          query: unknown;
          headers: unknown;
          response: {
            [x: string]: any;
            [x: number]: any;
            [x: symbol]: any;
          };
        };
      };
    };
  };
}, {
  derive: {};
  resolve: {};
  schema: {};
  standaloneSchema: {};
  response: {};
}, {
  derive: {};
  resolve: {};
  schema: {};
  standaloneSchema: {};
  response: {
    404: {
      readonly status: 404;
      readonly error: "Resource not found";
    };
    200: {
      error: string;
      details: ({
        summary: undefined;
      } | {
        summary: string;
      } | {
        summary: string;
        type: _sinclair_typebox_errors0.ValueErrorType;
        schema: elysia0.TSchema;
        path: string;
        value: unknown;
        message: string;
        errors: _sinclair_typebox_errors0.ValueErrorIterator[];
      })[];
      status?: undefined;
      message?: undefined;
    } | {
      status: string;
      error: string;
      message: Readonly<Error> | Readonly<elysia0.ParseError> | Readonly<elysia0.InternalServerError> | Readonly<elysia0.InvalidCookieSignature> | Readonly<elysia_error0.InvalidFileType> | Readonly<elysia0.ElysiaCustomStatusResponse<number, number, number>>;
      details?: undefined;
    };
  };
}>;
//#endregion
export { app as default };