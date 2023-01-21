import { prisma } from "../database/database";

import axios from "axios";

async function create(movieid: number) {
  return prisma.movies.create({
    data: {
      movieid,
    },
  });
}

async function findBasedOnId(movieid: number) {
  return prisma.movies.findFirst({
    where: {
      movieid,
    },
  });
}

async function movieIdIsInApi(movieid: number, apiKey: string) {
  const response = await axios.get(
    `https://api.themoviedb.org/3/movie/${movieid}?api_key=${apiKey}&language=pt-BR`
  );
  return response.data;
}

const moviesRepository = {
  create,
  findBasedOnId,
  movieIdIsInApi,
};

export default moviesRepository;
