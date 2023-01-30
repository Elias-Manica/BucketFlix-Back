import { Request, Response } from "express";

import httpStatus from "http-status";

import commentService from "../services/comment.services";

export async function addComment(req: Request, res: Response) {
  const userId = res.locals.userid;
  const { movieid, comment, rating } = req.body;

  try {
    await commentService.addComment(
      userId,
      movieid,
      comment,
      rating,
      process.env.API_KEY
    );

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

export async function getComment(req: Request, res: Response) {
  const { movieid } = req.query;

  try {
    const list = await commentService.getComments(Number(movieid));

    return res.status(httpStatus.OK).send(list.reverse());
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

export async function deleteComment(req: Request, res: Response) {
  const { commentid } = req.query;
  const userId = res.locals.userid;

  if (!commentid) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ msg: "commentid não enviado" });
  }

  try {
    await commentService.deleteComment(Number(commentid), userId);

    return res.status(httpStatus.OK).send({ msg: "Comentário excluido!" });
  } catch (error) {
    console.log(error);
    if (error.response?.status === 401 || error === 401) {
      return res.status(httpStatus.UNAUTHORIZED).send({
        msg: "Você não tem permissão para excluir esse comentário",
      });
    }
    if (error.response?.status === 404 || error === 404) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ msg: "Este comentário não foi encontrado no banco de dados" });
    }
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ msg: "Erro interno no servidor" });
  }
}
