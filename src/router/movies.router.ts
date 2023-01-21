import { Router } from "express";

import { tokenIsValid } from "../middleware/auth.middleware";

import { addMovieInBd } from "../controller/movies.controller";
import { bodyAddMovieIsValid } from "../middleware/movies.middleware";

const moviesRouter = Router();

moviesRouter.post("/", tokenIsValid, bodyAddMovieIsValid, addMovieInBd);

export { moviesRouter };
