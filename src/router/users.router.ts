import { Router } from "express";

import { usersPost } from "../controller/users.controller";

const userRouter = Router();

userRouter.post("/", usersPost);

export { userRouter };
