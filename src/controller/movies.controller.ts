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
      .status(httpStatus.OK)
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

export async function getFavoritesMovies(req: Request, res: Response) {
  const userId = res.locals.userid;

  try {
    const listMovies = await moviesService.getMovies(userId);
    return res.status(httpStatus.OK).send(listMovies);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ msg: "Erro interno no servidor" });
  }
}

export async function removeFavoriteMovie(req: Request, res: Response) {
  const userId = res.locals.userid;
  const { favoriteid } = req.query;

  if (!favoriteid) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ msg: "Parâmetro favoriteid não enviado" });
  }

  try {
    await moviesService.removeFavoriteMovie(Number(favoriteid), userId);
    return res
      .status(httpStatus.OK)
      .send({ msg: "Filme removido dos favoritos" });
  } catch (error) {
    console.log(error);
    if (error.response?.status === 401 || error === 401) {
      return res.status(httpStatus.UNAUTHORIZED).send({
        msg: "Você não tem permissão para descurtir esse filme",
      });
    }
    if (error.response?.status === 404 || error === 404) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ msg: "Este filme não foi encontrado no banco de dados" });
    }
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ msg: "Erro interno no servidor" });
  }
}
