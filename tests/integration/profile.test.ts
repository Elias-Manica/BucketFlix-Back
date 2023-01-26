import supertest from "supertest";
import server, { init } from "../../src/app";
import { cleanDb } from "../helpers";

import httpStatus from "http-status";

import { faker } from "@faker-js/faker";

import jwt from "jsonwebtoken";
import { createUser } from "../factories/user.factory";
import { generateValidToken } from "../factories/session.factory";
import { favoritedAmovie } from "../factories/movies.factory";

const api = supertest(server);

beforeAll(async () => {
  await init();
  await cleanDb();
});

describe("GET /user", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await api.get("/user");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await api
      .get("/user")
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
      .get("/user")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

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
        email: user.email,
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
        email: user.email,
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
  it("should respond with status 401 if no token is given", async () => {
    const response = await api.get("/user/name");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await api
      .get("/user/name")
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
      .get("/user/name")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

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
