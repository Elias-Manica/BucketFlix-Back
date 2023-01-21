import { Router } from "express";

import { addMovieInBd } from "../controller/movies.controller";

const moviesRouter = Router();

moviesRouter.post("/", addMovieInBd);

export { moviesRouter };
