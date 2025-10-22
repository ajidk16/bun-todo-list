import * as elysia0 from "elysia";
import { Elysia } from "elysia";
import * as drizzle_orm_neon_http0 from "drizzle-orm/neon-http";
import * as _sinclair_typebox_errors0 from "@sinclair/typebox/errors";
import * as elysia_error0 from "elysia/error";

//#region src/server.d.ts
declare const app: Elysia<"", {
  decorator: {};
  store: {};
  derive: {
    readonly bearer: string | undefined;
  };
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
  response: any;
}, {
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
} & {
  suraji: {
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
              to: string;
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
              to: string;
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
      todos: {
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
              readonly message: "List of todos";
              readonly data: {
                status: "pending" | "in_progress" | "completed" | "archived" | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                title: string;
                description: string | null;
                isCompleted: boolean | null;
                priority: "low" | "medium" | "high" | "urgent" | null;
                user: {
                  username: string;
                  id: string;
                  email: string;
                  verifiedEmail: boolean;
                };
              }[];
              readonly pagination: {
                readonly page: number;
                readonly limit: number;
                readonly total: number;
                readonly totalPages: number;
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
              200: {
                readonly message: `Get todo with id ${string}`;
                readonly data: {
                  status: "pending" | "in_progress" | "completed" | "archived" | null;
                  id: string;
                  createdAt: Date;
                  updatedAt: Date;
                  userId: string;
                  title: string;
                  description: string | null;
                  isCompleted: boolean | null;
                  priority: "low" | "medium" | "high" | "urgent" | null;
                } | undefined;
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
      todos: {
        post: {
          body: {
            userId: string;
            title: string;
            description?: string | undefined;
            isCompleted?: boolean | undefined;
            status?: "pending" | "in_progress" | "completed" | "archived" | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
          };
          params: {};
          query: unknown;
          headers: unknown;
          response: {
            201: {
              readonly message: "Todo created";
              readonly data: {
                status: "pending" | "in_progress" | "completed" | "archived" | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                title: string;
                description: string | null;
                isCompleted: boolean | null;
                priority: "low" | "medium" | "high" | "urgent" | null;
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
      todos: {
        ":id": {
          put: {
            body: {
              userId?: string | undefined;
              title?: string | undefined;
              description?: string | undefined;
              isCompleted?: boolean | undefined;
              status?: "pending" | "in_progress" | "completed" | "archived" | undefined;
              priority?: "low" | "medium" | "high" | "urgent" | undefined;
            };
            params: {
              id: string;
            };
            query: unknown;
            headers: unknown;
            response: {
              200: {
                readonly message: "Todo updated";
                readonly data: {
                  id: string;
                  userId: string;
                  title: string;
                  description: string | null;
                  isCompleted: boolean | null;
                  status: "pending" | "in_progress" | "completed" | "archived" | null;
                  priority: "low" | "medium" | "high" | "urgent" | null;
                  createdAt: Date;
                  updatedAt: Date;
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
              200: {
                message: string;
                data: drizzle_orm_neon_http0.NeonHttpQueryResult<never>;
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