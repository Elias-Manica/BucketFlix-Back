import { Request, Response } from "express";

import moviesService from "../services/movie.services";

import httpStatus from "http-status";

export async function addMovieInBd(req: Request, res: Response) {
  const { movieid, apiKey } = req.body;

  try {
    const movie = await moviesService.addMovie(movieid, apiKey);

    return res.status(httpStatus.CREATED).send(movie);
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

export async function favoriteMovie(req: Request, res: Response) {
  const userId = res.locals.userid;

  const { movieid, apiKey } = req.body;

  try {
    await moviesService.favorite(movieid, userId, apiKey);
    return res
      .status(httpStatus.CREATED)
      .send({ msg: "Filme adicionado aos favoritos" });
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
    if (error.response?.status === 409 || error === 409) {
      return res
        .status(httpStatus.CONFLICT)
        .send({ msg: "Você já curtiu esse filme" });
    }
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ msg: "Erro interno no servidor" });
  }
}
