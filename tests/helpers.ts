import { prisma } from "../src/database/database";

export async function cleanDb() {
  await prisma.listmovies.deleteMany({});
  await prisma.comments.deleteMany({});
  await prisma.movies.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.users.deleteMany({});
}
