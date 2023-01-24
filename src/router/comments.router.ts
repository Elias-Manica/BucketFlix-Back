import { Router } from "express";

import { tokenIsValid } from "../middleware/auth.middleware";

import { addComment } from "../controller/comments.controller";

import { bodyCommentIsValid } from "../middleware/movies.middleware";

const commentsRouter = Router();

commentsRouter.post("/", tokenIsValid, bodyCommentIsValid, addComment);

export { commentsRouter };
