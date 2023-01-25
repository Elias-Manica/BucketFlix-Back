import { Request, Response } from "express";

import sessionService from "../services/session.services";

import httpStatus from "http-status";

export async function signInWithFireAuth(req: Request, res: Response) {
  const { email, username, pictureUrl } = req.body;

  try {
    const result = await sessionService.signInWithEmail(
      email,
      username,
      pictureUrl
    );

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ msg: "Erro interno no servidor" });
  }
}
