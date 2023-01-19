import prisma from "../database/database";

async function getMovies() {
  return prisma.movies.findMany();
}

export { getMovies };
