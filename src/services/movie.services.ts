import httpStatus from "http-status";

import moviesRepository from "../repositories/movies.repository";

async function addMovie(movieid: number, apiKey: string) {
  const hasMovieInApi = await moviesRepository.movieIdIsInApi(movieid, apiKey);

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
