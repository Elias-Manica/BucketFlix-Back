import supertest from "supertest";
import server, { init } from "../../src/app";
import { cleanDb } from "../helpers";
import { prisma } from "../../src/database/database";

import httpStatus from "http-status";

import { faker } from "@faker-js/faker";

import jwt from "jsonwebtoken";

import { createUser } from "../factories/user.factory";
import { generateValidToken } from "../factories/session.factory";
import {
  favoritedAmovie,
  findeLikedMovie,
  findeWatchedMovie,
  watchedAmovie,
} from "../factories/movies.factory";

const api = supertest(server);

beforeAll(async () => {
  await init();
  await cleanDb();
});

describe("POST /add-movie", () => {
  const generateValidBody = () => ({
    movieid: 550,
  });

  const invalidBodyMovieID = () => ({
    movieid: 55000000,
  });

  it("should respond with status 401 if no token is given", async () => {
    const response = await api.post("/add-movie");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await api
      .post("/add-movie")
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
      .post("/add-movie")
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("Should respond with status 422 when body is not given", async () => {
      const token = await generateValidToken();

      const response = await api
        .post("/add-movie")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it("Should respond with status 422 when body is not valid", async () => {
      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

      const token = await generateValidToken();

      const response = await api
        .post("/add-movie")
        .send(invalidBody)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    describe("When body is valid", () => {
      it("should respond with status 404 when there is no movie in API movies with that movieid", async () => {
        const body = invalidBodyMovieID();

        const token = await generateValidToken();

        const response = await api
          .post("/add-movie")
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it("should respond with status 201 and return id and movieid when body is valid", async () => {
        const body = generateValidBody();

        const token = await generateValidToken();

        const response = await api
          .post("/add-movie")
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.CREATED);
        expect(response.body).toEqual({
          id: expect.any(Number),
          movieid: body.movieid,
          original_title: "Fight Club",
          title: "Clube da Luta",
          overview:
            "Um homem deprimido que sofre de insônia conhece um estranho vendedor de sabonetes chamado Tyler Durden. Eles formam um clube clandestino com regras rígidas onde lutam com outros homens cansados de suas vidas mundanas. Mas sua parceria perfeita é comprometida quando Marla chama a atenção de Tyler.",
          poster_path: "/r3pPehX4ik8NLYPpbDRAh0YRtMb.jpg",
          tagline: "Má conduta. Caos. Sabão.",
          popularity: expect.any(Number),
          release_date: "1999-10-15",
        });
      });

      it("should save movie on db", async () => {
        const body = generateValidBody();

        const token = await generateValidToken();

        const response = await api
          .post("/add-movie")
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        const movie = await prisma.movies.findUnique({
          where: { movieid: body.movieid },
        });
        expect(movie).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            movieid: body.movieid,
            original_title: "Fight Club",
            title: "Clube da Luta",
            overview:
              "Um homem deprimido que sofre de insônia conhece um estranho vendedor de sabonetes chamado Tyler Durden. Eles formam um clube clandestino com regras rígidas onde lutam com outros homens cansados de suas vidas mundanas. Mas sua parceria perfeita é comprometida quando Marla chama a atenção de Tyler.",
            poster_path: "/r3pPehX4ik8NLYPpbDRAh0YRtMb.jpg",
            tagline: "Má conduta. Caos. Sabão.",
            popularity: expect.any(Number),
            release_date: "1999-10-15",
          })
        );
      });
    });
  });
});

describe("POST /add-movie/favorite", () => {
  const generateValidBody = () => ({
    movieid: 550,
  });

  const invalidBodyMovieID = () => ({
    movieid: 55000000,
  });

  it("should respond with status 401 if no token is given", async () => {
    const response = await api.post("/add-movie/favorite");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await api
      .post("/add-movie/favorite")
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
      .post("/add-movie/favorite")
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("Should respond with status 422 when body is not given", async () => {
      const token = await generateValidToken();

      const response = await api
        .post("/add-movie/favorite")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it("Should respond with status 422 when body is not valid", async () => {
      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

      const token = await generateValidToken();

      const response = await api
        .post("/add-movie/favorite")
        .send(invalidBody)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    describe("When body is valid", () => {
      it("should respond with status 404 when there is no movie in API movies with that movieid", async () => {
        const body = invalidBodyMovieID();

        const token = await generateValidToken();

        const response = await api
          .post("/add-movie/favorite")
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it("should respond with status 409 when the user alredy favorited this movie", async () => {
        const body = generateValidBody();

        const token = await generateValidToken();

        await api
          .post("/add-movie/favorite")
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        const response = await api
          .post("/add-movie/favorite")
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.CONFLICT);
      });

      it("should respond with status 200 when body is valid", async () => {
        const body = generateValidBody();

        const token = await generateValidToken();

        const response = await api
          .post("/add-movie/favorite")
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
      });

      it("should save movie on db", async () => {
        const body = generateValidBody();

        const token = await generateValidToken();

        const response = await api
          .post("/add-movie/favorite")
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        const movie = await prisma.listmovies.findFirst({
          where: {
            movieid: body.movieid,
          },
        });
        expect(movie).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            movieid: body.movieid,
          })
        );
      });
    });
  });
});

describe("GET /add-movie/favorite", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await api.get("/add-movie/favorite");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await api
      .get("/add-movie/favorite")
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
      .get("/add-movie/favorite")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("should respond with status 200 and a empty array when user dont favorited any movie", async () => {
      const token = await generateValidToken();

      const response = await api
        .get("/add-movie/favorite")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([]);
    });

    it("should respond with status 200 and a array with movies favorited", async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const movie = await favoritedAmovie(550, user.id);

      const response = await api
        .get("/add-movie/favorite")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        expect.objectContaining({
          id: expect.any(Number),
          userid: user.id,
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
        }),
      ]);
    });
  });
});

describe("DELETE /add-movie/favorite", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await api.delete("/add-movie/favorite");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await api
      .delete("/add-movie/favorite")
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
      .delete("/add-movie/favorite")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("should respond with status 400 when favoriteid dont send by user", async () => {
      const token = await generateValidToken();

      const response = await api
        .delete("/add-movie/favorite")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 when favoriteid dont EXIST", async () => {
      const token = await generateValidToken();

      const response = await api
        .delete("/add-movie/favorite?favoriteid=0")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 401 when user doesnt is the owener of comment", async () => {
      const user = await createUser();

      const unauthorizedUser = await createUser();

      const token = await generateValidToken(unauthorizedUser);

      const favorite = await favoritedAmovie(550, user.id);

      const response = await api
        .delete(`/add-movie/favorite?favoriteid=${favorite.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 200 and remove movie liked from db", async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const like = await favoritedAmovie(550, user.id);

      const response = await api
        .delete(`/add-movie/favorite?favoriteid=${like.id}`)
        .set("Authorization", `Bearer ${token}`);

      const haslike = await findeLikedMovie(like.id);

      expect(response.status).toBe(httpStatus.OK);
      expect(haslike).toEqual(null);
    });
  });
});

describe("POST /add-movie/watched", () => {
  const generateValidBody = () => ({
    movieid: 550,
    rating: 5,
  });

  const invalidBodyMovieID = () => ({
    movieid: 55000000,
    rating: 5,
  });

  const invalidBodyRating = () => ({
    movieid: 55000000,
    rating: 6,
  });

  it("should respond with status 401 if no token is given", async () => {
    const response = await api.post("/add-movie/watched");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await api
      .post("/add-movie/watched")
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
      .post("/add-movie/watched")
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("Should respond with status 422 when body is not given", async () => {
      const token = await generateValidToken();

      const response = await api
        .post("/add-movie/watched")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it("Should respond with status 422 when body is not valid", async () => {
      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

      const token = await generateValidToken();

      const response = await api
        .post("/add-movie/watched")
        .send(invalidBody)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    describe("When body is valid", () => {
      it("should respond with status 422 when there rating is invalid", async () => {
        const body = invalidBodyRating();

        const token = await generateValidToken();

        const response = await api
          .post("/add-movie/watched")
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
      });

      it("should respond with status 404 when there is no movie in API movies with that movieid", async () => {
        const body = invalidBodyMovieID();

        const token = await generateValidToken();

        const response = await api
          .post("/add-movie/watched")
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it("should respond with status 409 when the user alredy watched this movie", async () => {
        const body = generateValidBody();

        const token = await generateValidToken();

        await api
          .post("/add-movie/watched")
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        const response = await api
          .post("/add-movie/watched")
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.CONFLICT);
      });

      it("should respond with status 200 when body is valid", async () => {
        const body = generateValidBody();

        const token = await generateValidToken();

        const response = await api
          .post("/add-movie/watched")
          .send(body)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
      });
    });
  });
});

describe("DELETE /add-movie/watched", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await api.delete("/add-movie/watched");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await api
      .delete("/add-movie/watched")
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
      .delete("/add-movie/watched")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("should respond with status 400 when watchedid dont send by user", async () => {
      const token = await generateValidToken();

      const response = await api
        .delete("/add-movie/watched")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 when watchedid dont EXIST", async () => {
      const token = await generateValidToken();

      const response = await api
        .delete("/add-movie/watched?watchedid=0")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 401 when user doesnt is the owener of watchedid", async () => {
      const user = await createUser();

      const unauthorizedUser = await createUser();

      const token = await generateValidToken(unauthorizedUser);

      const watched = await watchedAmovie(550, user.id, 5);

      const response = await api
        .delete(`/add-movie/watched?watchedid=${watched.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 200 and remove movie liked from db", async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const watched = await watchedAmovie(550, user.id, 5);

      const response = await api
        .delete(`/add-movie/watched?watchedid=${watched.id}`)
        .set("Authorization", `Bearer ${token}`);

      const haslike = await findeWatchedMovie(watched.id);

      expect(response.status).toBe(httpStatus.OK);
      expect(haslike).toEqual(null);
    });
  });
});

describe("GET /add-movie/watched", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await api.get("/add-movie/watched");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await api
      .get("/add-movie/watched")
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
      .get("/add-movie/watched")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("should respond with status 400 when movieid dont send by user", async () => {
      const token = await generateValidToken();

      const response = await api
        .get("/add-movie/watched")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 when user dont watch movieid", async () => {
      const token = await generateValidToken();

      const response = await api
        .get("/add-movie/watched?movieid=0")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 when user watched movieid", async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      await watchedAmovie(550, user.id, 5);

      const response = await api
        .get(`/add-movie/watched?movieid=550`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
    });
  });
});
