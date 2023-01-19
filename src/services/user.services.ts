import userRepository from "../repositories/users.repository";

export async function createUser(
  email: string,
  username: string,
  pictureUrl: string
) {
  return userRepository.create(email, username, pictureUrl);
}

const userService = {
  createUser,
};

export default userService;
