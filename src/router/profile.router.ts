import { Router } from "express";

import { getProfile } from "../controller/profile.controller";
import { tokenIsValid } from "../middleware/auth.middleware";

const profileRouter = Router();

profileRouter.get("/", tokenIsValid, getProfile);

export { profileRouter };
