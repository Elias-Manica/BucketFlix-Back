import { Request, Response } from "express";

import httpStatus from "http-status";
import profileService from "../services/profile.services";

export async function getProfile(req: Request, res: Response) {
  const { userid } = req.query;

  if (!userid) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ msg: "Parâmetro userid não enviado" });
  }

  try {
    const profile = await profileService.getProfile(Number(userid));

    return res.status(httpStatus.OK).send(profile);
  } catch (error) {
    if (error.response?.status === 404 || error === 404) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ msg: "Este usuário não foi encontrado no banco de dados" });
    }
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ msg: "Erro interno no servidor" });
  }
}

export async function getProfileByName(req: Request, res: Response) {
  const { username } = req.query;

  if (!username) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ msg: "Parâmetro username não enviado" });
  }

  try {
    const profile = await profileService.getProfileByName(String(username));

    return res.status(httpStatus.OK).send(profile);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ msg: "Erro interno no servidor" });
  }
}

export async function followUser(req: Request, res: Response) {
  const ownuserId = res.locals.userid;
  const { userid } = req.query;

  if (!userid) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ msg: "Parâmetro userid não enviado" });
  }

  if (Number(ownuserId) === Number(userid)) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ msg: "Você não pode seguir a si mesmo" });
  }

  try {
    await profileService.follow(Number(ownuserId), Number(userid));

    return res.status(httpStatus.OK).send({ msg: "Seguindo" });
  } catch (error) {
    if (error.response?.status === 404 || error === 404) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ msg: "Este usuário não foi encontrado no banco de dados" });
    }
    if (error.response?.status === 409 || error === 409) {
      return res
        .status(httpStatus.CONFLICT)
        .send({ msg: "Você já segue este usuário" });
    }
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ msg: "Erro interno no servidor" });
  }
}

export async function unfollowUser(req: Request, res: Response) {
  const ownuserId = res.locals.userid;
  const { userid } = req.query;

  if (!userid) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ msg: "Parâmetro userid não enviado" });
  }

  if (Number(ownuserId) === Number(userid)) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ msg: "Você não pode parar de seguir a si mesmo" });
  }

  try {
    await profileService.unfollow(Number(ownuserId), Number(userid));

    return res
      .status(httpStatus.OK)
      .send({ msg: "Você parou de seguir esse usuário" });
  } catch (error) {
    if (error.response?.status === 404 || error === 404) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ msg: "Este usuário não foi encontrado no banco de dados" });
    }
    if (error.response?.status === 409 || error === 409) {
      return res
        .status(httpStatus.CONFLICT)
        .send({ msg: "Você não segue este usuário" });
    }
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ msg: "Erro interno no servidor" });
  }
}

export async function isfollowUser(req: Request, res: Response) {
  const ownuserId = res.locals.userid;
  const { userid } = req.query;

  if (!userid) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ msg: "Parâmetro userid não enviado" });
  }

  if (Number(ownuserId) === Number(userid)) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ msg: "Você não pode seguir a si mesmo" });
  }

  try {
    await profileService.isfollow(Number(ownuserId), Number(userid));

    return res.status(httpStatus.OK).send({ msg: "Seguindo" });
  } catch (error) {
    if (error.response?.status === 404 || error === 404) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ msg: "Este usuário não foi curtido por você" });
    }
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ msg: "Erro interno no servidor" });
  }
}

export async function listFollow(req: Request, res: Response) {
  const { userid } = req.query;

  if (!userid) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ msg: "Parâmetro userid não enviado" });
  }

  try {
    const list = await profileService.getFollowing(Number(userid));

    return res.status(httpStatus.OK).send(list);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ msg: "Erro interno no servidor" });
  }
}

export async function getInfosProfile(req: Request, res: Response) {
  const { userid } = req.query;

  if (!userid) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ msg: "Parâmetro userid não enviado" });
  }

  try {
    const follow = await profileService.getCountFollow(Number(userid));
    const followers = await profileService.getCountFollowers(Number(userid));
    const comments = await profileService.getCountComment(Number(userid));

    return res.status(httpStatus.OK).send({
      following: follow,
      followers: followers,
      comments: comments,
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ msg: "Erro interno no servidor" });
  }
}
