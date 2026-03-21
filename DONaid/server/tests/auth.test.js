const request = require("supertest");
const { app } = require("../src/app");
const { authHeader } = require("./helpers");

describe("Auth API", () => {
  test("Register -> Login -> Me works", async () => {
    // Register
    const reg = await request(app).post("/api/auth/register").send({
      email: "user1@example.com",
      displayName: "User One",
      password: "Password123!",
    });

    expect(reg.status).toBe(201);

    // Login
    const login = await request(app).post("/api/auth/login").send({
      email: "user1@example.com",
      password: "Password123!",
    });

    expect(login.status).toBe(200);
    expect(login.body.token).toBeTruthy();

    const token = login.body.token;

    // Me
    const me = await request(app).get("/api/auth/me").set(authHeader(token));

    expect(me.status).toBe(200);
    expect(me.body.email).toBe("user1@example.com");
  });

  test("Login fails with wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      email: "user2@example.com",
      displayName: "User Two",
      password: "CorrectPass!",
    });

    const login = await request(app).post("/api/auth/login").send({
      email: "user2@example.com",
      password: "WrongPass!",
    });

    expect(login.status).toBe(401);
  });
});
