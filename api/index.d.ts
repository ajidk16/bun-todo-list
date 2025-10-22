import { Elysia } from "elysia";

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
      profile: {
        otp: {
          get: {
            body: unknown;
            params: {};
            query: {
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
      profile: {
        otp: {
          verify: {
            get: {
              body: unknown;
              params: {};
              query: unknown;
              headers: unknown;
              response: {
                200: {
                  error: string;
                  message?: undefined;
                } | {
                  message: string;
                  error?: undefined;
                };
              };
            };
          };
        };
      };
    } & {
      profile: {
        otp: {
          verify: {
            post: {
              body: {
                to: string;
                otp: string;
              };
              params: {};
              query: unknown;
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
  response: {};
}>;
//#endregion
export { app as default };