import prisma from "../database/database.js";

async function getMovies() {
  return prisma.movies.findMany();
}

export { getMovies };
