import { Router } from "express";

import { signInWithFireAuth } from "../controller/session.controller";
import { signUpIsValid } from "../middleware/auth.middleware";

const sessionRouter = Router();

sessionRouter.post("/", signUpIsValid, signInWithFireAuth);

export { sessionRouter };
