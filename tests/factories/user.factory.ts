import { prisma } from "../../src/database/database";

import { createUserParams } from "../../src/services/user.services";
import { users } from "@prisma/client";

import { faker } from "@faker-js/faker";

export async function createUser(
  params: Partial<createUserParams> = {}
): Promise<users> {
  return prisma.users.create({
    data: {
      email: params.email || faker.internet.email(),
      username: params.username || faker.name.firstName(),
      pictureUrl: params.pictureUrl || faker.image.imageUrl(),
    },
  });
}
