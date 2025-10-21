import app from "../server";

// Vercel butuh default export berupa handler (Request -> Response)
export default (req: Request) => app.fetch(req);
