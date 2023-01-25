import { prisma } from "../../src/database/database";

export async function favoritedAmovie(movieid: number, userid: number) {
  return prisma.listmovies.create({
    data: {
      movieid,
      userid,
    },
    include: {
      movies: true,
    },
  });
}

export async function findeLikedMovie(id: number) {
  return prisma.listmovies.findFirst({
    where: {
      id,
    },
  });
}
