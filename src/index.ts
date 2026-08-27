import { Elysia } from "elysia";
import { usersRoutes } from "./routes/users-routes";

const port = Number(process.env.PORT) || 3000;

const app = new Elysia()
  .get("/", () => ({
    status: "ok",
    message: "Backend service running with Bun, Elysia, Drizzle ORM, and MySQL!",
    timestamp: new Date().toISOString(),
  }))
  .get("/health", () => ({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }))
  .use(usersRoutes)
  .listen(port);

console.log(`🚀 Elysia server is running at http://localhost:${port}`);

export type App = typeof app;
