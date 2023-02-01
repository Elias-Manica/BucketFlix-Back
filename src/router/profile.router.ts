import { Router } from "express";

import {
  followUser,
  getInfosProfile,
  getMovieProfile,
  getProfile,
  getProfileByName,
  isfollowUser,
  listFollow,
  listFollowed,
  unfollowUser,
} from "../controller/profile.controller";
import { tokenIsValid } from "../middleware/auth.middleware";

const profileRouter = Router();

profileRouter
  .get("/", getProfile)
  .get("/movies", getMovieProfile)
  .get("/name", getProfileByName)
  .post("/follow", tokenIsValid, followUser)
  .delete("/follow", tokenIsValid, unfollowUser)
  .get("/follow", tokenIsValid, isfollowUser)
  .get("/follow/list", listFollow)
  .get("/followed", listFollowed)
  .get("/infos", getInfosProfile);

export { profileRouter };
