import app from "../src/server";
export default (req: Request) => app.fetch(req);
