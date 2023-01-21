import { prisma } from "../../src/database/database";

import jwt from "jsonwebtoken";

import { createUser } from "./user.factory";

import { session, users } from "@prisma/client";

export async function generateValidToken(user?: users) {
  const incomingUser = user || (await createUser());
  const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

  await createSession(token, incomingUser.id);

  return token;
}

export async function createSession(
  token: string,
  userid: number
): Promise<session> {
  return prisma.session.create({
    data: {
      token: token,
      userid,
    },
  });
}
