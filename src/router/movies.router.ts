import { Router } from "express";

import { addMovieInBd } from "../controller/movies.controller";
import { bodyAddMovieIsValid } from "../middleware/movies.middleware";

const moviesRouter = Router();

moviesRouter.post("/", bodyAddMovieIsValid, addMovieInBd);

export { moviesRouter };
