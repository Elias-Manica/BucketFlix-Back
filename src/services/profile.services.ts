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

async function follow(ownuserId: number, userid: number) {
  await getProfile(userid);

  const isFollowing = await profileRepository.isFollow(ownuserId, userid);

  if (isFollowing) {
    throw httpStatus.CONFLICT;
  }

  const follow = await profileRepository.followUser(ownuserId, userid);

  return follow;
}

async function unfollow(ownuserId: number, userid: number) {
  await getProfile(userid);

  const isFollowing = await profileRepository.isFollow(ownuserId, userid);

  if (!isFollowing) {
    throw httpStatus.CONFLICT;
  }

  const follow = await profileRepository.unfollowUser(isFollowing.id);

  return follow;
}

async function isfollow(ownuserId: number, userid: number) {
  const isFollowing = await profileRepository.isFollow(ownuserId, userid);

  if (!isFollowing) {
    throw httpStatus.NOT_FOUND;
  }

  return isFollowing;
}

const profileService = {
  getProfile,
  getProfileByName,
  follow,
  unfollow,
  isfollow,
};

export default profileService;
