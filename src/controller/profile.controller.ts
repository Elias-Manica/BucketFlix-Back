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
