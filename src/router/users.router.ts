import { Router } from "express";

import { usersPost } from "../controller/users.controller";
import { signUpIsValid, hadEmailUnique } from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.post("/", signUpIsValid, hadEmailUnique, usersPost);

export { userRouter };
