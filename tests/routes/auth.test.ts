import request from "supertest";
import { app } from "../../src/utils/testSetup";

describe("Auth Routes", () => {
  it("should return 401 for invalid login", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "wrong@example.com",
      password: "wrongpass",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid/i);
  });

  // You can add more tests like register, logout, etc.
});
