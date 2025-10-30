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
        message?: undefined;
      } | {
        error: string;
        details?: undefined;
        message?: undefined;
      } | {
        error: string;
        message: Readonly<Error> | Readonly<elysia0.ParseError> | Readonly<elysia0.InternalServerError> | Readonly<elysia0.InvalidCookieSignature> | Readonly<elysia_error0.InvalidFileType> | Readonly<elysia0.ElysiaCustomStatusResponse<number, number, number>>;
        details?: undefined;
      } | {
        message: string;
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
          message?: undefined;
        } | {
          error: string;
          details?: undefined;
          message?: undefined;
        } | {
          error: string;
          message: Readonly<Error> | Readonly<elysia0.ParseError> | Readonly<elysia0.InternalServerError> | Readonly<elysia0.InvalidCookieSignature> | Readonly<elysia_error0.InvalidFileType> | Readonly<elysia0.ElysiaCustomStatusResponse<number, number, number>>;
          details?: undefined;
        } | {
          message: string;
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
                success: boolean;
                message: string;
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
                success: boolean;
                error: string;
                message?: undefined;
              } | {
                success: boolean;
                message: string;
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
            page: number;
            limit: number;
            search: string;
          };
          headers: unknown;
          response: {
            200: {
              status: number;
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
                page: number;
                limit: number;
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
            page: number;
            limit: number;
            search: string;
          };
          headers: unknown;
          response: {
            200: {
              status: number;
              data: {
                name: string;
                id: string;
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
                page: number;
                limit: number;
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
        post: {
          body: {
            name: string;
            label: string;
            color: string;
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
      message?: undefined;
    } | {
      error: string;
      details?: undefined;
      message?: undefined;
    } | {
      error: string;
      message: Readonly<Error> | Readonly<elysia0.ParseError> | Readonly<elysia0.InternalServerError> | Readonly<elysia0.InvalidCookieSignature> | Readonly<elysia_error0.InvalidFileType> | Readonly<elysia0.ElysiaCustomStatusResponse<number, number, number>>;
      details?: undefined;
    };
  };
}>;
//#endregion
export { app as default };