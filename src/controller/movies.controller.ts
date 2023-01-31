import { Request, Response } from "express";

import moviesService from "../services/movie.services";

import httpStatus from "http-status";

export async function addMovieInBd(req: Request, res: Response) {
  const { movieid } = req.body;

  try {
    const movie = await moviesService.addMovie(movieid, process.env.API_KEY);

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

  const { movieid } = req.body;

  try {
    await moviesService.favorite(movieid, userId, process.env.API_KEY);
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

export async function isfavorite(req: Request, res: Response) {
  const userId = res.locals.userid;
  const { movieid } = req.body;

  try {
    const result = await moviesService.movieisfavorite(movieid, userId);
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    if (error.response?.status === 404 || error === 404) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ msg: "Este filme não foi curtido por você" });
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

export async function watchedMovie(req: Request, res: Response) {
  const userId = res.locals.userid;
  const { movieid, rating } = req.body;

  try {
    await moviesService.watched(movieid, userId, rating);
    return res
      .status(httpStatus.OK)
      .send({ msg: "Filme adicionado aos assistidos" });
  } catch (error) {
    if (error.response?.status === 404 || error === 404) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ msg: "Este filme não foi encontrado no banco de dados" });
    }
    if (error.response?.status === 409 || error === 409) {
      return res
        .status(httpStatus.CONFLICT)
        .send({ msg: "Esse filme já está na sua lista de assistidos" });
    }
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ msg: "Erro interno no servidor" });
  }
}

export async function removeWatchedMovie(req: Request, res: Response) {
  const userId = res.locals.userid;
  const { watchedid } = req.query;

  if (!watchedid) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ msg: "Parâmetro watchedid não enviado" });
  }

  try {
    await moviesService.removeWatchedMovie(Number(watchedid), userId);
    return res
      .status(httpStatus.OK)
      .send({ msg: "Filme removido da lista de assistidos" });
  } catch (error) {
    if (error.response?.status === 401 || error === 401) {
      return res.status(httpStatus.UNAUTHORIZED).send({
        msg: "Você não tem permissão para tirar dessa lista esse filme",
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

export async function isWatched(req: Request, res: Response) {
  const userId = res.locals.userid;
  const { movieid } = req.query;

  if (!movieid) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ msg: "Parâmetro movieid não enviado" });
  }

  try {
    await moviesService.isWatched(Number(movieid), userId);

    return res.status(httpStatus.OK).send({ msg: "Assistido" });
  } catch (error) {
    if (error.response?.status === 404 || error === 404) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ msg: "Este filme não foi assistido por você" });
    }
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ msg: "Erro interno no servidor" });
  }
}
