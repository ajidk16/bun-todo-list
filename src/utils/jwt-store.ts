export const setAuthCookie = (cookie: any, token: string) => {
  cookie.value = token;
  cookie.httpOnly = true;
  cookie.maxAge = 7 * 24 * 60 * 60;
  cookie.path = "/";
};

export const clearAuthCookie = (cookie: any) => {
  cookie.value = "";
  cookie.maxAge = 0;
  cookie.path = "/";
};
