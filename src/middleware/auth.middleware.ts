import { Request, Response, NextFunction } from "express";

import httpStatus from "http-status";

import { createUserSchema } from "../schemas/user.schema";

import userRepository from "../repositories/users.repository";

import jwt from "jsonwebtoken";
import sessionRepository from "../repositories/session.repository";

async function signUpIsValid(req: Request, res: Response, next: NextFunction) {
  const isValid = createUserSchema.validate(req.body, { abortEarly: false });

  if (isValid.error) {
    const error = isValid.error.details.map((erro) => erro.message);
    res.status(httpStatus.UNPROCESSABLE_ENTITY).send(error);
    return;
  }

  next();
}

async function hadEmailUnique(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;

  const response = await userRepository.hasUserWithEmail(email);

  if (response) {
    res.status(httpStatus.CONFLICT).send({ msg: "E-mail já registrado" });
    return;
  }

  next();
}

async function tokenIsValid(req: Request, res: Response, next: NextFunction) {
  try {
    const token: string = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).send({ msg: "Token necessário" });
      return;
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;

    if (!userId) {
      res.status(401).send({ msg: "Token inválido" });
      return;
    }

    const response = await sessionRepository.hasSession(userId, token);

    if (!response) {
      res.status(401).send({ msg: "Token inválido" });
      return;
    }

    res.locals.userid = userId;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ msg: "Token inválido" });
  }
}

export type AuthenticatedRequest = Request & JWTPayload;

export type JWTPayload = {
  userId: number;
};

export { signUpIsValid, hadEmailUnique, tokenIsValid };
