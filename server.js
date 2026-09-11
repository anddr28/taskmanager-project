import jsonServer from "json-server";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults({
  static: "./public"
});

server.use(middlewares);

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://taskmanager-project-one.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

server.use(router);

server.listen(process.env.PORT || 3001, "0.0.0.0", () => {
  console.log("JSON Server is running");
});