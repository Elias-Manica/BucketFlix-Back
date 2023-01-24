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
