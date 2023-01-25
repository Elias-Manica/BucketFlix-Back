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

async function getMovies(userid: number) {
  const listMovies = await moviesRepository.listMovies(userid);

  return listMovies;
}

async function removeFavoriteMovie(favoriteid: number, userid: number) {
  const movieLiked = await moviesRepository.findEspecifyMovie(favoriteid);

  if (!movieLiked) {
    throw httpStatus.NOT_FOUND;
  }

  if (movieLiked.userid !== userid) {
    throw httpStatus.UNAUTHORIZED;
  }

  await moviesRepository.removeEspecifyMovie(favoriteid);

  return movieLiked;
}

const moviesService = {
  addMovie,
  favorite,
  getMovies,
  hasMovieInExternalApi,
  removeFavoriteMovie,
};

export default moviesService;
