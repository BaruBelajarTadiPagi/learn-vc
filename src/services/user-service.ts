import { eq } from "drizzle-orm";
import { db } from "../db";
import { sessions, users, type NewSession, type NewUser } from "../db/schema";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export class UserService {
  static async register(input: RegisterUserInput) {
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error("Email sudah terdaftar");
    }

    const hashedPassword = await Bun.password.hash(input.password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    const newUser: NewUser = {
      name: input.name,
      email: input.email,
      password: hashedPassword,
    };

    await db.insert(users).values(newUser);

    return { data: "OK" };
  }

  static async login(input: LoginUserInput) {
    const foundUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);

    if (foundUsers.length === 0) {
      throw new Error("email atau password salah");
    }

    const user = foundUsers[0];

    const isPasswordValid = await Bun.password.verify(
      input.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("email atau password salah");
    }

    const sessionToken = crypto.randomUUID();

    const newSession: NewSession = {
      token: sessionToken,
      userId: user.id,
    };

    await db.insert(sessions).values(newSession);

    return { data: sessionToken };
  }
}
