import request from "supertest";
import app from "../../app.js";
import { registerTestUser } from "../helpers/register-test-user.js";

const validTripInput = {
  destination: "Lisbon, Portugal",
  originCity: "New York, USA",
  numberOfDays: 3,
  budgetType: "MID_RANGE",
  currency: "USD",
  interests: ["Food", "Culture"],
};

describe("Trip routes", () => {
  it("rejects trip creation without authentication", async () => {
    const response = await request(app).post("/api/trips").send(validTripInput);

    expect(response.status).toBe(401);
  });

  it("creates a trip with a fully populated AI-generated itinerary", async () => {
    const user = await registerTestUser(app);

    const response = await request(app)
      .post("/api/trips")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send(validTripInput);

    expect(response.status).toBe(201);
    expect(response.body.data.destination).toBe(validTripInput.destination);
    expect(response.body.data.itinerary).toHaveLength(validTripInput.numberOfDays);
    expect(response.body.data.budgetEstimate.total).toBeGreaterThan(0);
    expect(response.body.data.hotelSuggestions.length).toBeGreaterThan(0);
    expect(response.body.data.riskAssessment.riskLevel).toEqual(expect.any(String));
  });

  it("rejects trip creation with an invalid budget type", async () => {
    const user = await registerTestUser(app);

    const response = await request(app)
      .post("/api/trips")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ ...validTripInput, budgetType: "NOT_A_REAL_TYPE" });

    expect(response.status).toBe(400);
  });

  it("lists only the authenticated user's trips", async () => {
    const user = await registerTestUser(app);
    await request(app)
      .post("/api/trips")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send(validTripInput);

    const response = await request(app)
      .get("/api/trips")
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  it("returns a single trip by id", async () => {
    const user = await registerTestUser(app);
    const created = await request(app)
      .post("/api/trips")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send(validTripInput);

    const response = await request(app)
      .get(`/api/trips/${created.body.data._id}`)
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data._id).toBe(created.body.data._id);
  });

  it("returns 404 for a trip that does not exist", async () => {
    const user = await registerTestUser(app);

    const response = await request(app)
      .get("/api/trips/6a0000000000000000000000")
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(response.status).toBe(404);
  });

  it("deletes a trip", async () => {
    const user = await registerTestUser(app);
    const created = await request(app)
      .post("/api/trips")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send(validTripInput);

    const deleteResponse = await request(app)
      .delete(`/api/trips/${created.body.data._id}`)
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(deleteResponse.status).toBe(200);

    const getResponse = await request(app)
      .get(`/api/trips/${created.body.data._id}`)
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(getResponse.status).toBe(404);
  });

  it("prevents one user from accessing another user's trip", async () => {
    const userA = await registerTestUser(app);
    const userB = await registerTestUser(app);

    const created = await request(app)
      .post("/api/trips")
      .set("Authorization", `Bearer ${userA.accessToken}`)
      .send(validTripInput);

    const getAsB = await request(app)
      .get(`/api/trips/${created.body.data._id}`)
      .set("Authorization", `Bearer ${userB.accessToken}`);
    expect(getAsB.status).toBe(404);

    const deleteAsB = await request(app)
      .delete(`/api/trips/${created.body.data._id}`)
      .set("Authorization", `Bearer ${userB.accessToken}`);
    expect(deleteAsB.status).toBe(404);
  });

  it("adds and removes an activity from the itinerary", async () => {
    const user = await registerTestUser(app);
    const created = await request(app)
      .post("/api/trips")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send(validTripInput);

    const tripId = created.body.data._id;

    const addResponse = await request(app)
      .patch(`/api/trips/${tripId}/itinerary/1/activities`)
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({
        action: "add",
        slot: "morning",
        activity: {
          title: "Extra stop",
          description: "A manually added activity",
          duration: "30 minutes",
          estimatedCost: 5,
        },
      });

    expect(addResponse.status).toBe(200);
    const morningActivities = addResponse.body.data.itinerary[0].morning;
    const added = morningActivities.find((a: { title: string }) => a.title === "Extra stop");
    expect(added).toBeDefined();

    const removeResponse = await request(app)
      .patch(`/api/trips/${tripId}/itinerary/1/activities`)
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ action: "remove", slot: "morning", activityId: added._id });

    expect(removeResponse.status).toBe(200);
    const remaining = removeResponse.body.data.itinerary[0].morning;
    expect(remaining.find((a: { _id: string }) => a._id === added._id)).toBeUndefined();
  });
});
