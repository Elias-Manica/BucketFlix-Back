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

  const createMovie = await moviesRepository.create(
    movieid,
    hasMovieInApi.original_title,
    hasMovieInApi.title,
    hasMovieInApi.overview,
    hasMovieInApi.poster_path,
    hasMovieInApi.tagline,
    hasMovieInApi.popularity,
    hasMovieInApi.release_date
  );

  return {
    id: createMovie.id,
    movieid: createMovie.movieid,
  };
}

async function favorite(movieid: number, apiKey: string) {
  const hasMovieInApi = await moviesRepository.movieIdIsInApi(movieid, apiKey);

  if (!hasMovieInApi) {
    throw httpStatus.NOT_FOUND;
  }

  const hasMovieInDbAlredy = await moviesRepository.findBasedOnId(movieid);

  if (hasMovieInDbAlredy) {
    return hasMovieInDbAlredy;
  }

  return [];
}

const moviesService = {
  addMovie,
  favorite,
};

export default moviesService;
