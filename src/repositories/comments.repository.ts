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

async function getEspecifyComment(commentId: number) {
  return prisma.comments.findFirst({
    where: {
      id: commentId,
    },
  });
}

async function deleteEspecifyComment(commentid: number) {
  return prisma.comments.delete({
    where: {
      id: commentid,
    },
  });
}

const commentRepository = {
  addComment,
  getComments,
  getEspecifyComment,
  deleteEspecifyComment,
};

export default commentRepository;
