import httpStatus from "http-status";
import profileRepository from "../repositories/profile.repository";

async function getProfile(userid: number) {
  const response = await profileRepository.get(userid);

  if (!response) {
    throw httpStatus.NOT_FOUND;
  }

  return response;
}

const profileService = {
  getProfile,
};

export default profileService;
