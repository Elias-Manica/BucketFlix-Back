import { prisma } from "../database/database";

async function create(userid: number, token: string) {
  return prisma.session.create({
    data: {
      userid,
      token,
    },
  });
}

async function hasSession(userid: number, token: string) {
  return prisma.session.findFirst({
    where: {
      token,
      userid,
    },
  });
}

const sessionRepository = {
  create,
  hasSession,
};

export default sessionRepository;
