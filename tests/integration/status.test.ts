import supertest from "supertest";
import server from "../../src/app";
import { cleanDb } from "../helpers";

const api = supertest(server);

beforeEach(async () => {
  await cleanDb();
});

describe("GET /status", () => {
  it("Should respond with status 201", async () => {
    const response = await api.get("/status");

    expect(response.status).toBe(201);
  });
});
