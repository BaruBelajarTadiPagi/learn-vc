import { Elysia, t } from "elysia";
import { db } from "./db";
import { users } from "./db/schema";

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
  .group("/api/users", (userGroup) =>
    userGroup
      .get("/", async () => {
        try {
          const allUsers = await db.select().from(users);
          return { success: true, data: allUsers };
        } catch (error: any) {
          return {
            success: false,
            message: "Failed to fetch users (make sure MySQL is running and migrations applied)",
            error: error.message,
          };
        }
      })
      .post(
        "/",
        async ({ body, set }) => {
          try {
            await db.insert(users).values({
              name: body.name,
              email: body.email,
            });
            set.status = 201;
            return { success: true, message: "User created successfully" };
          } catch (error: any) {
            set.status = 400;
            return {
              success: false,
              message: "Failed to create user",
              error: error.message,
            };
          }
        },
        {
          body: t.Object({
            name: t.String(),
            email: t.String({ format: "email" }),
          }),
        }
      )
  )
  .listen(port);

console.log(`🚀 Elysia server is running at http://localhost:${port}`);

export type App = typeof app;
