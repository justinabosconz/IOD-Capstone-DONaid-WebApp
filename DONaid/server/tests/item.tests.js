const request = require("supertest");
const { app } = require("../src/app");
const { authHeader } = require("./helpers");

async function createUserAndLogin(email) {
  await request(app)
    .post("/api/auth/register")
    .send({
      email,
      displayName: email.split("@")[0],
      password: "Password123!",
    });

  const login = await request(app).post("/api/auth/login").send({
    email,
    password: "Password123!",
  });

  return login.body.token;
}

describe("Items API", () => {
  test("Create -> List -> Update -> Delete item (owner)", async () => {
    const token = await createUserAndLogin("owner@example.com");

    // Create item
    const created = await request(app)
      .post("/api/items")
      .set(authHeader(token))
      .send({
        title: "Test Item",
        description: "Test Description",
        category: "Furniture",
        itemCondition: "Good",
      });

    expect(created.status).toBe(201);
    const itemId = created.body.id;

    // List
    const list = await request(app).get("/api/items");
    expect(list.status).toBe(200);
    expect(list.body.length).toBe(1);

    // Update
    const updated = await request(app)
      .put(`/api/items/${itemId}`)
      .set(authHeader(token))
      .send({ status: "TAKEN" });

    expect(updated.status).toBe(200);
    expect(updated.body.status).toBe("TAKEN");

    // Delete
    const del = await request(app)
      .delete(`/api/items/${itemId}`)
      .set(authHeader(token));

    expect(del.status).toBe(200);

    // Confirm gone
    const getAgain = await request(app).get(`/api/items/${itemId}`);
    expect(getAgain.status).toBe(404);
  });

  test("Update/Delete blocked for non-owner (403)", async () => {
    const ownerToken = await createUserAndLogin("owner2@example.com");
    const otherToken = await createUserAndLogin("other@example.com");

    const created = await request(app)
      .post("/api/items")
      .set(authHeader(ownerToken))
      .send({ title: "Owner Item", description: "Only owner can edit" });

    const itemId = created.body.id;

    // Other user tries update
    const upd = await request(app)
      .put(`/api/items/${itemId}`)
      .set(authHeader(otherToken))
      .send({ status: "TAKEN" });

    expect(upd.status).toBe(403);

    // Other user tries delete
    const del = await request(app)
      .delete(`/api/items/${itemId}`)
      .set(authHeader(otherToken));

    expect(del.status).toBe(403);
  });

  test("Create item requires auth (401)", async () => {
    const res = await request(app).post("/api/items").send({
      title: "No Auth",
      description: "Should fail",
    });

    expect(res.status).toBe(401);
  });
});
