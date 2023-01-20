import { prisma } from "../database/database";

async function create(userid: number, token: string) {
  return prisma.session.create({
    data: {
      userid,
      token,
    },
  });
}

const sessionRepository = {
  create,
};

export default sessionRepository;
