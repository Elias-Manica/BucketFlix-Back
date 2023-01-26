import { prisma } from "../database/database";

async function get(userid: number) {
  return prisma.users.findUnique({
    where: {
      id: userid,
    },
    include: {
      listmovies: {
        where: {
          userid: userid,
        },
        include: {
          movies: true,
        },
      },
    },
  });
}

async function getUserByName(username: string) {
  return prisma.users.findMany({
    take: 5,
    where: {
      username: {
        contains: username,
      },
    },
  });
}

const profileRepository = {
  get,
  getUserByName,
};

export default profileRepository;
