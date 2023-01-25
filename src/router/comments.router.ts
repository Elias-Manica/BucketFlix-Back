import { Router } from "express";

import { tokenIsValid } from "../middleware/auth.middleware";

import { addComment, getComment } from "../controller/comments.controller";

import {
  bodyCommentIsValid,
  findCommentIsValid,
} from "../middleware/movies.middleware";

const commentsRouter = Router();

commentsRouter
  .post("/", tokenIsValid, bodyCommentIsValid, addComment)
  .get("/", tokenIsValid, getComment);

export { commentsRouter };
