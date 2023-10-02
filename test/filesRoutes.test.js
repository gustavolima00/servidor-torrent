import request from "supertest";
import app from "../app.mjs";

describe("GET /", function () {
  it("responds with world", function (done) {
    request(app).get("/hello").expect("world", done);
  });
});
