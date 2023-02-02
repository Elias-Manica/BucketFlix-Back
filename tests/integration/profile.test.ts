import supertest from "supertest";
import server, { init } from "../../src/app";
import { cleanDb } from "../helpers";

import httpStatus from "http-status";

import { faker } from "@faker-js/faker";

import jwt from "jsonwebtoken";
import {
  createFollow,
  createUser,
  findFollow,
} from "../factories/user.factory";
import { generateValidToken } from "../factories/session.factory";
import { favoritedAmovie, watchedAmovie } from "../factories/movies.factory";

const api = supertest(server);

beforeAll(async () => {
  await init();
  await cleanDb();
});

describe("GET /user", () => {
  describe("When token is valid", () => {
    it("should respond with status 400 when userid dont send by user", async () => {
      const token = await generateValidToken();

      const response = await api
        .get("/user")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 when userid dont EXIST", async () => {
      const token = await generateValidToken();

      const response = await api
        .get("/user?userid=0")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and a empty array when userid dont have a list of movies", async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const response = await api
        .get(`/user?userid=${user.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: user.id,
        username: user.username,
        pictureUrl: user.pictureUrl,
        createdat: user.createdat.toISOString(),
        updatedat: user.updatedat.toISOString(),
        listmovies: [],
      });
    });

    it("should respond with status 200 and a array with movies of the user", async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const generateValidBody = () => ({
        movieid: 550,
      });

      const body = generateValidBody();

      await api
        .post("/add-movie")
        .send(body)
        .set("Authorization", `Bearer ${token}`);
      const movie = await favoritedAmovie(550, user.id);

      const response = await api
        .get(`/user?userid=${user.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: user.id,
        username: user.username,
        pictureUrl: user.pictureUrl,
        createdat: user.createdat.toISOString(),
        updatedat: user.updatedat.toISOString(),
        listmovies: [
          {
            id: movie.id,
            userid: movie.userid,
            movieid: movie.movieid,
            createdat: movie.createdat.toISOString(),
            updatedat: movie.updatedat.toISOString(),
            movies: {
              id: movie.movies.id,
              movieid: movie.movies.movieid,
              original_title: movie.movies.original_title,
              title: movie.movies.title,
              overview: movie.movies.overview,
              poster_path: movie.movies.poster_path,
              tagline: movie.movies.tagline,
              popularity: movie.movies.popularity,
              release_date: movie.movies.release_date,
            },
          },
        ],
      });
    });
  });
});

describe("GET /user/name", () => {
  describe("When token is valid", () => {
    it("should respond with status 400 when username dont send by user", async () => {
      const token = await generateValidToken();

      const response = await api
        .get("/user/name")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 200 and a empty array when dont have a username in db", async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const response = await api
        .get(`/user/name?username=1`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([]);
    });

    it("should respond with status 200 and a array with user with that username", async () => {
      const user = await createUser();
      const user2 = await createUser();

      const token = await generateValidToken(user);

      const response = await api
        .get(`/user/name?username=${user2.username}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: user2.id,
          email: user2.email,
          username: user2.username,
          pictureUrl: user2.pictureUrl,
          createdat: user2.createdat.toISOString(),
          updatedat: user2.updatedat.toISOString(),
        },
      ]);
    });
  });
});

describe("POST /user/follow", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await api.post("/user/follow");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await api
      .post("/user/follow")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign(
      { userId: userWithoutSession.id },
      process.env.JWT_SECRET
    );

    const response = await api
      .post("/user/follow")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe("When token is valid", () => {
    it("should respond with status 400 when userid dont send by user", async () => {
      const token = await generateValidToken();

      const response = await api
        .post("/user/follow")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when userid is the same id of the user", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await api
        .post(`/user/follow?userid=${user.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 when userid dont EXIST", async () => {
      const token = await generateValidToken();

      const response = await api
        .post("/user/follow?userid=0")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 409 when user already follow userid", async () => {
      const user = await createUser();
      const secondUser = await createUser();
      const token = await generateValidToken(user);

      await createFollow(user.id, secondUser.id);

      const response = await api
        .post(`/user/follow?userid=${secondUser.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.CONFLICT);
    });

    it("should respond with status 200 and follow user", async () => {
      const user = await createUser();
      const secondUser = await createUser();
      const token = await generateValidToken(user);

      const response = await api
        .post(`/user/follow?userid=${secondUser.id}`)
        .set("Authorization", `Bearer ${token}`);

      const isFollow = await findFollow(user.id, secondUser.id);
      console.log(isFollow, " isfollow");
      expect(response.status).toBe(httpStatus.OK);
      expect(isFollow).toBeTruthy();
    });
  });
});

describe("DELETE /user/follow", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await api.delete("/user/follow");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await api
      .delete("/user/follow")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign(
      { userId: userWithoutSession.id },
      process.env.JWT_SECRET
    );

    const response = await api
      .delete("/user/follow")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe("When token is valid", () => {
    it("should respond with status 400 when userid dont send by user", async () => {
      const token = await generateValidToken();

      const response = await api
        .delete("/user/follow")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when userid is the same id of the user", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await api
        .delete(`/user/follow?userid=${user.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 when userid dont EXIST", async () => {
      const token = await generateValidToken();

      const response = await api
        .delete("/user/follow?userid=0")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 409 when user dont follow userid", async () => {
      const user = await createUser();
      const secondUser = await createUser();
      const token = await generateValidToken(user);

      const response = await api
        .delete(`/user/follow?userid=${secondUser.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.CONFLICT);
    });

    it("should respond with status 200 and unfollow user", async () => {
      const user = await createUser();
      const secondUser = await createUser();
      const token = await generateValidToken(user);

      await createFollow(user.id, secondUser.id);

      const response = await api
        .delete(`/user/follow?userid=${secondUser.id}`)
        .set("Authorization", `Bearer ${token}`);

      const isFollow = await findFollow(user.id, secondUser.id);

      expect(response.status).toBe(httpStatus.OK);
      expect(isFollow).toBeFalsy();
    });
  });
});

describe("GET /user/follow", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await api.get("/user/follow");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await api
      .get("/user/follow")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign(
      { userId: userWithoutSession.id },
      process.env.JWT_SECRET
    );

    const response = await api
      .get("/user/follow")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe("When token is valid", () => {
    it("should respond with status 400 when userid dont send by user", async () => {
      const token = await generateValidToken();

      const response = await api
        .get("/user/follow")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when userid is the same id of the user", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await api
        .get(`/user/follow?userid=${user.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 when user dont follow userid", async () => {
      const user = await createUser();
      const secondUser = await createUser();
      const token = await generateValidToken(user);

      const response = await api
        .get(`/user/follow?userid=${secondUser.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 if user follow userid", async () => {
      const user = await createUser();
      const secondUser = await createUser();
      const token = await generateValidToken(user);

      await createFollow(user.id, secondUser.id);

      const response = await api
        .get(`/user/follow?userid=${secondUser.id}`)
        .set("Authorization", `Bearer ${token}`);

      const isFollow = await findFollow(user.id, secondUser.id);

      expect(response.status).toBe(httpStatus.OK);
      expect(isFollow).toBeTruthy();
    });
  });
});

describe("GET /user/movies", () => {
  describe("When token is valid", () => {
    it("should respond with status 400 when userid dont send by user", async () => {
      const token = await generateValidToken();

      const response = await api
        .get("/user/movies")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 200 and a empty array when userid dont have a list of movies", async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const response = await api
        .get(`/user/movies?userid=${user.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: user.id,
        username: user.username,
        pictureUrl: user.pictureUrl,
        createdat: user.createdat.toISOString(),
        updatedat: user.updatedat.toISOString(),
        listmovies: [],
      });
    });

    it("should respond with status 200 and a array with movies of the user", async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const generateValidBody = () => ({
        movieid: 550,
      });

      const body = generateValidBody();

      await api
        .post("/add-movie")
        .send(body)
        .set("Authorization", `Bearer ${token}`);
      const movie = await favoritedAmovie(550, user.id);

      const response = await api
        .get(`/user/movies?userid=${user.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: user.id,
        username: user.username,
        pictureUrl: user.pictureUrl,
        createdat: user.createdat.toISOString(),
        updatedat: user.updatedat.toISOString(),
        listmovies: [
          {
            id: movie.id,
            userid: movie.userid,
            movieid: movie.movieid,
            createdat: movie.createdat.toISOString(),
            updatedat: movie.updatedat.toISOString(),
            movies: {
              id: movie.movies.id,
              movieid: movie.movies.movieid,
              original_title: movie.movies.original_title,
              title: movie.movies.title,
              overview: movie.movies.overview,
              poster_path: movie.movies.poster_path,
              tagline: movie.movies.tagline,
              popularity: movie.movies.popularity,
              release_date: movie.movies.release_date,
            },
          },
        ],
      });
    });
  });
});

describe("GET /user/movies/watch", () => {
  describe("When token is valid", () => {
    it("should respond with status 400 when userid dont send by user", async () => {
      const token = await generateValidToken();

      const response = await api
        .get("/user/movies/watch")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 200 and a empty array when userid dont have a list of movies", async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const response = await api
        .get(`/user/movies/watch?userid=${user.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: user.id,
        username: user.username,
        pictureUrl: user.pictureUrl,
        createdat: user.createdat.toISOString(),
        updatedat: user.updatedat.toISOString(),
        listmovies: [],
      });
    });

    it("should respond with status 200 and a array with movies of the user", async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const generateValidBody = () => ({
        movieid: 550,
      });

      const body = generateValidBody();

      await api
        .post("/add-movie")
        .send(body)
        .set("Authorization", `Bearer ${token}`);
      const watched = await watchedAmovie(550, user.id, 5);

      const response = await api
        .get(`/user/movies/watch?userid=${user.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: user.id,
        username: user.username,
        pictureUrl: user.pictureUrl,
        createdat: user.createdat.toISOString(),
        updatedat: user.updatedat.toISOString(),
        listmovies: [
          {
            id: watched.id,
            userid: watched.userid,
            movieid: watched.movieid,
            rating: watched.rating,
            createdat: watched.createdat.toISOString(),
            updatedat: watched.updatedat.toISOString(),
            movie: {
              id: watched.movie.id,
              movieid: watched.movie.movieid,
              original_title: watched.movie.original_title,
              title: watched.movie.title,
              overview: watched.movie.overview,
              poster_path: watched.movie.poster_path,
              tagline: watched.movie.tagline,
              popularity: watched.movie.popularity,
              release_date: watched.movie.release_date,
            },
          },
        ],
      });
    });
  });
});
