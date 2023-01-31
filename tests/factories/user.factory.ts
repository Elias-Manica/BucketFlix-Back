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

export async function findFollow(ownuserId: number, userid: number) {
  return prisma.following.findFirst({
    where: {
      userid: ownuserId,
      userFollowed: userid,
    },
  });
}

export async function createFollow(ownuserId: number, userid: number) {
  return prisma.following.create({
    data: {
      userid: ownuserId,
      userFollowed: userid,
    },
  });
}
