import { Request, Response } from "express";

import userService from "../services/user.services";

import httpStatus from "http-status";

export async function usersPost(req: Request, res: Response) {
  const { email, username, pictureUrl } = req.body;

  try {
    const user = await userService.createUser(email, username, pictureUrl);
    return res.status(httpStatus.CREATED).json({
      id: user.id,
      email: user.email,
      username: user.username,
      pictureUrl: user.pictureUrl,
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ msg: "Erro interno no servidor" });
  }
}
