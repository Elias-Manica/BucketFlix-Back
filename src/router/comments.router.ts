import { Router } from "express";

import { tokenIsValid } from "../middleware/auth.middleware";

import {
  addComment,
  getComment,
  deleteComment,
} from "../controller/comments.controller";

import {
  bodyCommentIsValid,
  findCommentIsValid,
} from "../middleware/movies.middleware";

const commentsRouter = Router();

commentsRouter
  .post("/", tokenIsValid, bodyCommentIsValid, addComment)
  .get("/", tokenIsValid, getComment)
  .delete("/", tokenIsValid, deleteComment);

export { commentsRouter };
