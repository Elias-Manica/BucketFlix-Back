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

const userRepository = {
  create,
};

export default userRepository;
