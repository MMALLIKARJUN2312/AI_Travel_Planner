import request from "supertest";
import { Express } from "express";

let counter = 0;

export async function registerTestUser(app: Express) {
  counter += 1;
  const email = `test-user-${Date.now()}-${counter}@example.com`;
  const password = "Password123!";

  const response = await request(app).post("/api/auth/register").send({
    name: "Test User",
    email,
    password,
  });

  return {
    email,
    password,
    accessToken: response.body.data.accessToken as string,
  };
}
