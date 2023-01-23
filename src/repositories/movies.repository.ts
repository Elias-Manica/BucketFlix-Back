import { prisma } from "../database/database";

import axios from "axios";

async function create(
  movieid: number,
  original_title: string,
  title: string,
  overview: string,
  poster_path: string,
  tagline: string,
  popularity: number,
  release_date: string
) {
  return prisma.movies.create({
    data: {
      movieid,
      original_title,
      title,
      overview,
      poster_path,
      tagline,
      popularity,
      release_date,
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

async function addToFavoritList(movieid: number, userid: number) {
  return prisma.listmovies.create({
    data: {
      movieid,
      userid,
    },
  });
}

async function movieIsFavorited(movieid: number, userid: number) {
  return prisma.listmovies.findFirst({
    where: {
      movieid,
      userid,
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
  addToFavoritList,
  movieIsFavorited,
};

export default moviesRepository;
