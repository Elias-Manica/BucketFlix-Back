import supertest from "supertest";
import server, { init } from "../../src/app";
import { cleanDb } from "../helpers";

const api = supertest(server);

beforeAll(async () => {
  await init();
  await cleanDb();
});

describe("GET /status", () => {
  it("Should respond with status 201", async () => {
    const response = await api.get("/status");

    expect(response.status).toBe(201);
  });
});
