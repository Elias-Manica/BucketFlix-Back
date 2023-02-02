import supertest from "supertest";
import server, { init } from "../../src/app";
import { cleanDb } from "../helpers";
import { prisma } from "../../src/database/database";

import httpStatus from "http-status";

import { faker } from "@faker-js/faker";

import jwt from "jsonwebtoken";

import { createUser } from "../factories/user.factory";
import { generateValidToken } from "../factories/session.factory";
import { commentMovie, findComment } from "../factories/comments.factory";

const api = supertest(server);

beforeAll(async () => {
  await init();
  await cleanDb();
});

describe("POST /comments", () => {
  const generateValidBody = () => ({
    movieid: 550,
    comment: faker.lorem.word(),
    rating: 5,
  });

  const invalidBodyMovieID = () => ({
    movieid: 55000000,
    comment: faker.lorem.word(),
    rating: 5,
  });

  it("should respond with status 401 if no token is given", async () => {
    const response = await api.post("/comments");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await api
      .post("/comments")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const body = generateValidBody();
    const token = jwt.sign(
      { userId: userWithoutSession.id },
      process.env.JWT_SECRET
    );

    const response = await api
      .post("/comments")
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("Should respond with status 422 when body is not given", async () => {
      const token = await generateValidToken();

      const response = await api
        .post("/comments")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it("Should respond with status 422 when body is not valid", async () => {
      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

      const token = await generateValidToken();

      const response = await api
        .post("/comments")
        .send(invalidBody)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    describe("When body is valid", () => {
      it("should respond with status 404 when there is no movie in API movies with that movieid", async () => {
        const body = invalidBodyMovieID();

        const token = await generateValidToken();

        const response = await api
          .post("/comments")
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it("should respond with status 200 when body is valid", async () => {
        const body = generateValidBody();

        const token = await generateValidToken();

        const response = await api
          .post("/comments")
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.CREATED);
      });

      it("should save movie on db", async () => {
        const user = await createUser();
        const body = generateValidBody();

        const token = await generateValidToken(user);

        const response = await api
          .post("/comments")
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        const movie = await prisma.comments.findFirst({
          where: {
            movieid: body.movieid,
            userid: user.id,
          },
        });
        expect(movie).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            movieid: body.movieid,
            userid: user.id,
            comment: body.comment,
            rating: body.rating,
          })
        );
      });
    });
  });
});

describe("GET /comments", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await api.get("/comments");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await api
      .get("/comments")
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
      .get("/comments")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("should respond with status 200 and a empty array when movieid dont have a comment", async () => {
      const token = await generateValidToken();

      const response = await api
        .get("/comments?movieid=551")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([]);
    });

    it("should respond with status 200 and a array with comments of the movie", async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const comment = await commentMovie(550, user.id);

      const response = await api
        .get("/comments?movieid=550")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            userid: user.id,
            movieid: 550,
            comment: comment.comment,
            rating: comment.rating,
            createdat: comment.createdat.toISOString(),
            updatedat: comment.updatedat.toISOString(),
            users: {
              id: user.id,
              email: user.email,
              username: user.username,
              pictureUrl: user.pictureUrl,
              createdat: user.createdat.toISOString(),
              updatedat: user.updatedat.toISOString(),
            },
          }),
        ])
      );
    });
  });
});

describe("GET /comments/users/users", () => {
  describe("When token is valid", () => {
    it("should respond with status 400 when userid dont send by user", async () => {
      const token = await generateValidToken();

      const response = await api
        .get("/comments/users")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 200 and a empty array when userid dont have a comments", async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const response = await api
        .get(`/comments/users?userid=${user.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([]);
    });

    it("should respond with status 200 and a array with comments of the user", async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const comment = await commentMovie(550, user.id);

      const response = await api
        .get(`/comments/users?userid=${user.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            userid: user.id,
            movieid: 550,
            comment: comment.comment,
            rating: comment.rating,
            createdat: comment.createdat.toISOString(),
            updatedat: comment.updatedat.toISOString(),
            movies: {
              id: comment.movies.id,
              movieid: comment.movies.movieid,
              original_title: comment.movies.original_title,
              title: comment.movies.title,
              overview: comment.movies.overview,
              poster_path: comment.movies.poster_path,
              tagline: comment.movies.tagline,
              popularity: comment.movies.popularity,
              release_date: comment.movies.release_date,
            },
            users: {
              id: user.id,
              email: user.email,
              username: user.username,
              pictureUrl: user.pictureUrl,
              createdat: user.createdat.toISOString(),
              updatedat: user.updatedat.toISOString(),
            },
          }),
        ])
      );
    });
  });
});

describe("DELETE /comments", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await api.delete("/comments");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await api
      .delete("/comments")
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
      .delete("/comments")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("should respond with status 400 when commentid dont send by user", async () => {
      const token = await generateValidToken();

      const response = await api
        .delete("/comments")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 when commentid dont EXIST", async () => {
      const token = await generateValidToken();

      const response = await api
        .delete("/comments?commentid=0")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 401 when user doesnt is the owener of comment", async () => {
      const user = await createUser();

      const unauthorizedUser = await createUser();

      const token = await generateValidToken(unauthorizedUser);

      const comment = await commentMovie(550, user.id);

      const response = await api
        .delete(`/comments?commentid=${comment.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 200 and remove comment from db", async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const comment = await commentMovie(550, user.id);

      const response = await api
        .delete(`/comments?commentid=${comment.id}`)
        .set("Authorization", `Bearer ${token}`);

      const hasComment = await findComment(comment.id);

      expect(response.status).toBe(httpStatus.OK);
      expect(hasComment).toEqual(null);
    });
  });
});
