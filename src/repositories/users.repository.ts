import prisma from "../database/database";

async function create(email: string, username: string, pictureUrl: string) {
  return prisma.users.create({
    data: {
      email,
      username,
      pictureUrl,
    },
  });
}

async function hasUserWithEmail(email: string) {
  return prisma.users.findFirst({
    where: {
      email,
    },
  });
}

const userRepository = {
  create,
  hasUserWithEmail,
};

export default userRepository;
