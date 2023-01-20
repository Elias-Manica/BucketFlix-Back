import { users } from "@prisma/client";

import userRepository from "../repositories/users.repository";

export async function createUser(
  email: string,
  username: string,
  pictureUrl: string
): Promise<users> {
  return userRepository.create(email, username, pictureUrl);
}

export type createUserParams = Pick<users, "email" | "username" | "pictureUrl">;

const userService = {
  createUser,
};

export default userService;
