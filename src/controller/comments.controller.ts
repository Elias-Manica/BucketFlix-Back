import { Request, Response } from "express";

import httpStatus from "http-status";
import commentService from "../services/comment.services";

export async function addComment(req: Request, res: Response) {
  const userId = res.locals.userid;
  const { movieid, comment, rating, apiKey } = req.body;

  try {
    await commentService.addComment(userId, movieid, comment, rating, apiKey);

    return res
      .status(httpStatus.CREATED)
      .send({ msg: "Comentário adicionado!" });
  } catch (error) {
    if (error.response?.status === 401) {
      return res.status(httpStatus.UNAUTHORIZED).send({
        msg: "Api key enviada inválida, você pode criar uma em The Movie Database (TMDB) API",
      });
    }
    if (error.response?.status === 404) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ msg: "Este filme não foi encontrado no banco de dados" });
    }
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ msg: "Erro interno no servidor" });
  }
}
