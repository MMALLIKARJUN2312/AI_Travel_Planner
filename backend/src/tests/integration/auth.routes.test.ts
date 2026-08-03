import request from "supertest";
import app from "../../app.js";

describe("Auth routes", () => {
  const password = "Password123!";

  it("registers a new user and returns an access token", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password,
    });

    expect(response.status).toBe(201);
    expect(response.body.data.accessToken).toEqual(expect.any(String));
    expect(response.headers["set-cookie"]?.[0]).toMatch(/refreshToken=/);
  });

  it("rejects registration with a duplicate email", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Ada Lovelace",
      email: "dupe@example.com",
      password,
    });

    const response = await request(app).post("/api/auth/register").send({
      name: "Ada Lovelace",
      email: "dupe@example.com",
      password,
    });

    expect(response.status).toBe(400);
  });

  it("rejects registration with an invalid password", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Ada Lovelace",
      email: "shortpw@example.com",
      password: "short",
    });

    expect(response.status).toBe(400);
  });

  it("logs in with correct credentials", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Grace Hopper",
      email: "grace@example.com",
      password,
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "grace@example.com",
      password,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.accessToken).toEqual(expect.any(String));
  });

  it("rejects login with the wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Grace Hopper",
      email: "grace2@example.com",
      password,
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "grace2@example.com",
      password: "WrongPassword1!",
    });

    expect(response.status).toBe(401);
  });

  it("rejects login for a nonexistent email", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "nobody@example.com",
      password,
    });

    expect(response.status).toBe(401);
  });

  it("refreshes the session using the refresh cookie", async () => {
    const agent = request.agent(app);

    await agent.post("/api/auth/register").send({
      name: "Katherine Johnson",
      email: "katherine@example.com",
      password,
    });

    const response = await agent.post("/api/auth/refresh").send();

    expect(response.status).toBe(200);
    expect(response.body.data.accessToken).toEqual(expect.any(String));
  });

  it("rejects refresh without a refresh cookie", async () => {
    const response = await request(app).post("/api/auth/refresh").send();

    expect(response.status).toBe(401);
  });

  it("logs out successfully", async () => {
    const agent = request.agent(app);

    await agent.post("/api/auth/register").send({
      name: "Margaret Hamilton",
      email: "margaret@example.com",
      password,
    });

    const response = await agent.post("/api/auth/logout").send();

    expect(response.status).toBe(200);
  });
});
