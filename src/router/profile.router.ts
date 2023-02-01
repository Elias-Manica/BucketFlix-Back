import { Router } from "express";

import {
  followUser,
  getInfosProfile,
  getProfile,
  getProfileByName,
  isfollowUser,
  listFollow,
  unfollowUser,
} from "../controller/profile.controller";
import { tokenIsValid } from "../middleware/auth.middleware";

const profileRouter = Router();

profileRouter
  .get("/", getProfile)
  .get("/name", getProfileByName)
  .post("/follow", tokenIsValid, followUser)
  .delete("/follow", tokenIsValid, unfollowUser)
  .get("/follow", tokenIsValid, isfollowUser)
  .get("/follow/list", listFollow)
  .get("/infos", getInfosProfile);

export { profileRouter };
