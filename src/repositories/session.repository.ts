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

async function findSession(userid: number) {
  return prisma.session.findFirst({
    where: {
      userid,
    },
  });
}

async function deleteSession(id: number) {
  return prisma.session.delete({
    where: {
      id,
    },
  });
}

const sessionRepository = {
  create,
  hasSession,
  findSession,
  deleteSession,
};

export default sessionRepository;
