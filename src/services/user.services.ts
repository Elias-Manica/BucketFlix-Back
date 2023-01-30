import { users } from "@prisma/client";
import httpStatus from "http-status";
import sessionRepository from "../repositories/session.repository";

import userRepository from "../repositories/users.repository";

async function createUser(
  email: string,
  username: string,
  pictureUrl: string
): Promise<users> {
  return userRepository.create(email, username, pictureUrl);
}

async function deleteSession(userid: number) {
  const response = await sessionRepository.findSession(userid);

  if (!response) {
    throw httpStatus.NOT_FOUND;
  }

  return await sessionRepository.deleteSession(response.id);
}

async function findUserByEmail(email: string) {
  return userRepository.hasUserWithEmail(email);
}

export type createUserParams = Pick<users, "email" | "username" | "pictureUrl">;

const userService = {
  createUser,
  findUserByEmail,
  deleteSession,
};

export default userService;
