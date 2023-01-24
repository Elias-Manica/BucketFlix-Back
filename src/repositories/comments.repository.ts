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

const commentRepository = {
  addComment,
};

export default commentRepository;
