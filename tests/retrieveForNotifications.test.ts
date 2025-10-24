import request from "supertest";
import app from "src/index";

describe("POST /api/retrievefornotifications", () => {
  it("should return recipients from mentioned emails", async () => {
    const res = await request(app).post("/api/retrievefornotifications").send({
      teacher: "teacherken@gmail.com",
      notification: "Hello @studentagnes@gmail.com @studentmiche@gmail.com",
    });

    expect(res.status).toBe(200);
    expect(res.body.recipients).toContain("studentagnes@gmail.com");
    expect(res.body.recipients).toContain("studentmiche@gmail.com");
  });

  it("should return 400 if fields are missing", async () => {
    const res = await request(app)
      .post("/api/retrievefornotifications")
      .send({ teacher: "" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing fields");
  });
});
