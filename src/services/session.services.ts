import sessionRepository from "../repositories/session.repository";
import jwt from "jsonwebtoken";

import userService from "./user.services";

async function signInWithEmail(
  email: string,
  username: string,
  pictureUrl: string
) {
  const user = await userService.findUserByEmail(email);
  let token = "";

  if (!user) {
    const userAcount = await userService.createUser(
      email,
      username,
      pictureUrl
    );
    token = await createSession(userAcount.id);
    return {
      user: {
        id: userAcount.id,
        email,
        username,
        pictureUrl,
      },
      token,
    };
  } else {
    token = await createSession(user.id);
    return {
      user: {
        id: user.id,
        email,
        username,
        pictureUrl,
      },
      token,
    };
  }
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);

  await sessionRepository.create(userId, token);

  return token;
}

const sessionService = {
  createSession,
  signInWithEmail,
};

export default sessionService;
