import httpStatus from "http-status";

import moviesRepository from "../repositories/movies.repository";

async function addMovie(movieid: number, apiKey: string) {
  if (apiKey !== process.env.API_KEY) {
    throw httpStatus.UNAUTHORIZED;
  }

  const hasMovieInApi = await moviesRepository.movieIdIsInApi(movieid);

  if (!hasMovieInApi) {
    throw httpStatus.NOT_FOUND;
  }

  const hasMovieInDbAlredy = await moviesRepository.findBasedOnId(movieid);

  if (hasMovieInDbAlredy) {
    return hasMovieInDbAlredy;
  }

  const createMovie = await moviesRepository.create(movieid);

  return createMovie;
}

const moviesService = {
  addMovie,
};

export default moviesService;
