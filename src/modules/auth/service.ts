import { eq } from "drizzle-orm";
import { db } from "../../db/clients";
import { users } from "../../db/schema";
import argon2 from "argon2";
import bcrypt from "bcrypt";

export const createUser = async (
  username: string,
  email: string,
  passwordHash: string
) => {
  const newUser = await db.insert(users).values({
    username,
    email,
    passwordHash,
  });

  return newUser;
};

export const findUserByEmail = async (email: string) => {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });
  return user;
};

export const verifyEmail = async (email: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    return { success: false, error: "Email not registered" };
  }

  const [respon] = await db
    .update(users)
    .set({ verifiedEmail: true })
    .where(eq(users.email, email))
    .returning();

  return { data: respon };
};

export const findUserByUsername = async (username: string) => {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, username),
  });
  return user;
};

export const findUserById = async (id: string) => {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  });
  return user;
};

// export const hashPassword = async (password: string) => {
//   return Bun.password.hash(password, {
//     algorithm: "argon2id",
//     memoryCost: 19456,
//     timeCost: 2,
//   });
// };

// export const verifyPassword = async (
//   password: string,
//   hashedPassword: string
// ) => {
//   const isValid = await Bun.password.verify(password, hashedPassword);
//   return isValid;
// };

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch {
    return false;
  }
};
