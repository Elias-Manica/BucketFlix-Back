import { prisma } from "../database/database";

async function addComment(
  userid: number,
  movieid: number,
  comment: string,
  rating: number
) {
  return prisma.comments.create({
    data: {
      userid,
      movieid,
      comment,
      rating,
    },
  });
}

async function getComments(movieid: number) {
  return prisma.comments.findMany({
    where: {
      movieid,
    },
    include: {
      users: true,
    },
  });
}

const commentRepository = {
  addComment,
  getComments,
};

export default commentRepository;
