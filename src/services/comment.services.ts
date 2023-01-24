import httpStatus from "http-status";
import commentRepository from "../repositories/comments.repository";
import moviesRepository from "../repositories/movies.repository";
import moviesService from "./movie.services";

async function addComment(
  userid: number,
  movieid: number,
  comment: string,
  rating: number,
  apiKey: string
) {
  const hasMovieInApi = await moviesService.hasMovieInExternalApi(
    movieid,
    apiKey
  );

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

  const response = await commentRepository.addComment(
    userid,
    movieid,
    comment,
    rating
  );

  return response;
}

const commentService = {
  addComment,
};

export default commentService;
