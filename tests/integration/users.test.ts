import supertest from "supertest";
import server, { init } from "../../src/app";
import { cleanDb } from "../helpers";

import httpStatus from "http-status";

import { faker } from "@faker-js/faker";

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
});
