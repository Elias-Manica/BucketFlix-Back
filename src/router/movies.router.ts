import { Router } from "express";

import { tokenIsValid } from "../middleware/auth.middleware";

import {
  addMovieInBd,
  favoriteMovie,
  getFavoritesMovies,
} from "../controller/movies.controller";
import { bodyAddMovieIsValid } from "../middleware/movies.middleware";

const moviesRouter = Router();

moviesRouter
  .post("/", tokenIsValid, bodyAddMovieIsValid, addMovieInBd)
  .post("/favorite", tokenIsValid, bodyAddMovieIsValid, favoriteMovie)
  .get("/favorite", tokenIsValid, getFavoritesMovies);

export { moviesRouter };