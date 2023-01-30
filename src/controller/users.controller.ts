import { Request, Response } from "express";

import userService from "../services/user.services";

import httpStatus from "http-status";

export async function usersPost(req: Request, res: Response) {
  const userid = res.locals.userid;

  try {
    await userService.deleteSession(userid);
    return res.status(httpStatus.OK).json({ msg: "Deslogado com sucesso" });
  } catch (error) {
    if (error.response?.status === 404) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ msg: "Sessão não encontrada" });
    }
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ msg: "Erro interno no servidor" });
  }
}
