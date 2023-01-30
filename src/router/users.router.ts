import { Router } from "express";

import { usersPost } from "../controller/users.controller";
import { tokenIsValid } from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.post("/", tokenIsValid, usersPost);

export { userRouter };
