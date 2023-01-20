import supertest from "supertest";
import server, { init } from "../../src/app";
import { cleanDb } from "../helpers";
import { prisma } from "../../src/database/database";

import httpStatus from "http-status";

import { faker } from "@faker-js/faker";

import { createUser } from "../factories/user.factory";

const api = supertest(server);

beforeAll(async () => {
  await init();
  await cleanDb();
});

describe("POST /sign-in", () => {
  it("Should respond with status 422 when body is not given", async () => {
    const response = await api.post("/sign-in");

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });
  it("Should respond with status 422 when body is not valid", async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await api.post("/sign-in").send(invalidBody);

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  describe("When body is valid", () => {
    const generateValidBody = () => ({
      email: faker.internet.email(),
      username: faker.name.firstName(),
      pictureUrl: faker.image.imageUrl(),
    });

    it("should respond with status 200 and create user when given email is NOT in the table users and return session infos", async () => {
      const body = generateValidBody();

      const response = await api.post("/sign-in").send(body);

      const user = await prisma.users.findUnique({
        where: { email: body.email },
      });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.user).toEqual({
        id: user.id,
        email: user.email,
        username: user.username,
        pictureUrl: user.pictureUrl,
      });
    });
  });
});
