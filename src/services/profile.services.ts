import httpStatus from "http-status";
import profileRepository from "../repositories/profile.repository";

async function getProfile(userid: number) {
  const response = await profileRepository.get(userid);

  if (!response) {
    throw httpStatus.NOT_FOUND;
  }

  const body = {
    id: response.id,
    username: response.username,
    pictureUrl: response.pictureUrl,
    createdat: response.createdat,
    updatedat: response.updatedat,
    listmovies: response.listmovies,
  };

  return body;
}

async function getProfileByName(username: string) {
  const response = await profileRepository.getUserByName(username);

  return response;
}

const profileService = {
  getProfile,
  getProfileByName,
};

export default profileService;
