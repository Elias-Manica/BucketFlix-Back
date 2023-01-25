import { prisma } from "../../src/database/database";

import { faker } from "@faker-js/faker";

export async function commentMovie(movieid: number, userid: number) {
  return prisma.comments.create({
    data: {
      movieid,
      userid,
      comment: faker.lorem.word(),
      rating: 5,
    },
  });
}

export async function findComment(id: number) {
  return prisma.comments.findFirst({
    where: {
      id,
    },
  });
}
