import { users } from "@prisma/client";

import userRepository from "../repositories/users.repository";

async function createUser(
  email: string,
  username: string,
  pictureUrl: string
): Promise<users> {
  return userRepository.create(email, username, pictureUrl);
}

async function findUserByEmail(email: string) {
  return userRepository.hasUserWithEmail(email);
}

export type createUserParams = Pick<users, "email" | "username" | "pictureUrl">;

const userService = {
  createUser,
  findUserByEmail,
};

export default userService;
