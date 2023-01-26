import { prisma } from "../database/database";

async function get(userid: number) {
  console.log(userid);
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

const profileRepository = {
  get,
};

export default profileRepository;
