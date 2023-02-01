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

async function list(userid: number) {
  return prisma.following.findMany({
    where: {
      userid,
    },
    include: {
      usersFollow: true,
    },
  });
}

async function listFollowers(userid: number) {
  return prisma.following.findMany({
    where: {
      userFollowed: userid,
    },
    include: {
      users: true,
    },
  });
}

async function following(userid: number) {
  return prisma.following.count({
    where: {
      userid,
    },
  });
}

async function followerds(userid: number) {
  return prisma.following.count({
    where: {
      userFollowed: userid,
    },
  });
}

async function comment(userid: number) {
  return prisma.comments.count({
    where: {
      userid,
    },
  });
}

const profileRepository = {
  get,
  getUserByName,
  followUser,
  isFollow,
  unfollowUser,
  list,
  following,
  comment,
  followerds,
  listFollowers,
};

export default profileRepository;
