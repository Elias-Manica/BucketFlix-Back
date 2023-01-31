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

export async function watchedAmovie(
  movieid: number,
  userid: number,
  rating: number
) {
  return prisma.watchedMovies.create({
    data: {
      movieid,
      userid,
      rating,
    },
    include: {
      movie: true,
    },
  });
}

export async function findeWatchedMovie(id: number) {
  return prisma.watchedMovies.findFirst({
    where: {
      id,
    },
  });
}
