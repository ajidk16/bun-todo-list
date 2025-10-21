import { db } from "../../db/clients";
import { users } from "../../db/schema";

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
  console.log("Created User:", newUser);
  return newUser;
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

export const hashPassword = async (password: string) => {
  return Bun.password.hash(password, {
    algorithm: "argon2id",
    memoryCost: 19456,
    timeCost: 2,
  });
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  const isValid = await Bun.password.verify(password, hashedPassword);
  return isValid;
};
