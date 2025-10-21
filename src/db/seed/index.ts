import { hashPassword } from "../../modules/auth/service";
import { db } from "../clients";
import { NewTodo, NewUser, todos, users } from "../schema";

export const userSeed = async ({ username, email, passwordHash }: NewUser) => {
  const password = await hashPassword(passwordHash);

  const [inserted] = await db
    .insert(users)
    .values({
      username,
      email,
      passwordHash: password,
    })
    .returning();

  return inserted;
};

export const todoSeed = async ({ userId, title, description }: NewTodo) => {
  const [inserted] = await db
    .insert(todos)
    .values({
      userId,
      title,
      description,
    })
    .returning();

  return inserted;
};

(async () => {
  const admin = await userSeed({
    username: "admin",
    email: "admin@example.com",
    passwordHash: "bismillah",
  });
  const user = await userSeed({
    username: "user",
    email: "user@example.com",
    passwordHash: "bismillah",
  });
  
  if (!admin || !user) {
    throw new Error("Failed to create users");
  }
  
  await todoSeed({
    userId: admin.id,
    title: "First Todo",
    description: "This is the first todo",
  });
  await todoSeed({
    userId: user.id,
    title: "Second Todo",
    description: "This is the second todo",
  });
})();
