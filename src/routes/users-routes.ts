import { Elysia, t } from "elysia";
import { UserService } from "../services/user-service";

export const usersRoutes = new Elysia({ prefix: "/api/users" }).post(
  "/",
  async ({ body, set }) => {
    try {
      const result = await UserService.register(body);
      set.status = 201;
      return result;
    } catch (error: any) {
      if (error.message === "Email sudah terdaftar") {
        set.status = 400;
        return { error: "Email sudah terdaftar" };
      }

      set.status = 500;
      return { error: error.message || "Terjadi kesalahan internal" };
    }
  },
  {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      email: t.String({ format: "email" }),
      password: t.String({ minLength: 1 }),
    }),
  }
);
