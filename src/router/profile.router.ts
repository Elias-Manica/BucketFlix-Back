import { Router } from "express";

import { getProfile, getProfileByName } from "../controller/profile.controller";
import { tokenIsValid } from "../middleware/auth.middleware";

const profileRouter = Router();

profileRouter.get("/", getProfile).get("/name", getProfileByName);

export { profileRouter };
