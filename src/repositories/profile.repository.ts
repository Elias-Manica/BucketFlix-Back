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

async function followUser(ownuserId: number, userid: number) {
  return prisma.following.create({
    data: {
      userid: ownuserId,
      userFollowed: userid,
    },
  });
}

async function unfollowUser(id: number) {
  return prisma.following.delete({
    where: {
      id,
    },
  });
}

async function isFollow(ownuserId: number, userid: number) {
  return prisma.following.findFirst({
    where: {
      userid: ownuserId,
      userFollowed: userid,
    },
  });
}

const profileRepository = {
  get,
  getUserByName,
  followUser,
  isFollow,
  unfollowUser,
};

export default profileRepository;
