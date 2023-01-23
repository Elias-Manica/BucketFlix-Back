import httpStatus from "http-status";

import moviesRepository from "../repositories/movies.repository";

async function addMovie(movieid: number, apiKey: string) {
  const hasMovieInApi = await hasMovieInExternalApi(movieid, apiKey);

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

  return createMovie;
}

async function favorite(movieid: number, userid: number, apiKey: string) {
  const hasMovieInApi = await hasMovieInExternalApi(movieid, apiKey);

  const hasMovieInDbAlredy = await moviesRepository.findBasedOnId(movieid);

  if (!hasMovieInDbAlredy) {
    await moviesRepository.create(
      movieid,
      hasMovieInApi.original_title,
      hasMovieInApi.title,
      hasMovieInApi.overview,
      hasMovieInApi.poster_path,
      hasMovieInApi.tagline,
      hasMovieInApi.popularity,
      hasMovieInApi.release_date
    );
  }

  const movieIsFavorited = await moviesRepository.movieIsFavorited(
    movieid,
    userid
  );

  if (movieIsFavorited) {
    throw httpStatus.CONFLICT;
  }

  const response = await moviesRepository.addToFavoritList(movieid, userid);

  return response;
}

async function hasMovieInExternalApi(movieid: number, apiKey: string) {
  const hasMovieInApi = await moviesRepository.movieIdIsInApi(movieid, apiKey);

  if (!hasMovieInApi) {
    throw httpStatus.NOT_FOUND;
  }

  return hasMovieInApi;
}

const moviesService = {
  addMovie,
  favorite,
};

export default moviesService;
