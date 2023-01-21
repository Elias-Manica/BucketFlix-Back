import { Request, Response } from "express";

import moviesService from "../services/movie.services";

import httpStatus from "http-status";

export async function addMovieInBd(req: Request, res: Response) {
  const { movieid, apiKey } = req.body;

  try {
    const movie = await moviesService.addMovie(movieid, apiKey);

    return res.status(httpStatus.CREATED).send(movie);
  } catch (error) {
    console.log(error);
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
