import { Router } from "express";

import { tokenIsValid } from "../middleware/auth.middleware";

import {
  addMovieInBd,
  favoriteMovie,
  getFavoritesMovies,
  getWatchedMovies,
  isfavorite,
  isWatched,
  removeFavoriteMovie,
  removeWatchedMovie,
  watchedMovie,
} from "../controller/movies.controller";
import {
  bodyAddMovieIsValid,
  bodyWatchedMovieIsValid,
} from "../middleware/movies.middleware";

const moviesRouter = Router();

moviesRouter
  .post("/", tokenIsValid, bodyAddMovieIsValid, addMovieInBd)
  .post("/favorite", tokenIsValid, bodyAddMovieIsValid, favoriteMovie)
  .get("/favorite", tokenIsValid, getFavoritesMovies)
  .delete("/favorite", tokenIsValid, removeFavoriteMovie)
  .post("/isfavorite", tokenIsValid, bodyAddMovieIsValid, isfavorite)
  .post("/watched", tokenIsValid, bodyWatchedMovieIsValid, watchedMovie)
  .delete("/watched", tokenIsValid, removeWatchedMovie)
  .get("/watched", tokenIsValid, isWatched)
  .get("/watched/list", tokenIsValid, getWatchedMovies);

export { moviesRouter };
