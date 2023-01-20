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

describe("POST /sign-up", () => {
  it("Should respond with status 422 when body is not given", async () => {
    const response = await api.post("/sign-up");

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });
  it("Should respond with status 422 when body is not valid", async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await api.post("/sign-up").send(invalidBody);

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  describe("When body is valid", () => {
    const generateValidBody = () => ({
      email: faker.internet.email(),
      username: faker.name.firstName(),
      pictureUrl: faker.image.imageUrl(),
    });

    it("should respond with status 409 when there is an user with given email", async () => {
      const body = generateValidBody();
      await createUser(body);

      const response = await api.post("/sign-up").send(body);

      expect(response.status).toBe(httpStatus.CONFLICT);
    });

    it("should respond with status 201 and create user when given email is unique", async () => {
      const body = generateValidBody();

      const response = await api.post("/sign-up").send(body);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual({
        id: expect.any(Number),
        email: body.email,
        username: body.username,
        pictureUrl: body.pictureUrl,
      });
    });

    it("should save user on db", async () => {
      const body = generateValidBody();

      const response = await api.post("/sign-up").send(body);

      const user = await prisma.users.findUnique({
        where: { email: body.email },
      });
      expect(user).toEqual(
        expect.objectContaining({
          id: response.body.id,
          email: body.email,
          username: body.username,
          pictureUrl: body.pictureUrl,
        })
      );
    });
  });
});
