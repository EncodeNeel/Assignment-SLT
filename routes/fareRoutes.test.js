const request = require("supertest");
const express = require("express");
const fareRoutes = require("./fare");
const fs = require("fs");
const csv = require("csv-parser");

const app = express();
app.use(express.json());
app.use("/api", fareRoutes);

jest.mock("fs");
jest.mock("csv-parser", () => () => ({
  on: jest.fn().mockImplementation(function (event, handler) {
    if (event === "data") {
      handler({
        FromLine: "Green",
        ToLine: "Green",
        DateTime: "2021-03-24T07:58:30",
      });
      handler({
        FromLine: "Green",
        ToLine: "Red",
        DateTime: "2021-03-24T09:58:30",
      });
      handler({
        FromLine: "Red",
        ToLine: "Red",
        DateTime: "2021-03-25T11:58:30",
      });
    }
    if (event === "end") {
      handler();
    }
    return this;
  }),
}));

describe("Fare Routes", () => {
  beforeEach(() => {
    fs.existsSync.mockClear();
    fs.createReadStream.mockClear();
  });

  test("POST /api/fare should return 400 if filePath is not provided", async () => {
    const res = await request(app).post("/api/fare").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("filePath is required");
  });

  test("POST /api/fare should return 404 if file is not found", async () => {
    fs.existsSync.mockReturnValue(false);

    const res = await request(app)
      .post("/api/fare")
      .send({ filePath: "nonexistent.csv" });
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("File not found");
  });

  test("POST /api/fare should calculate total fare correctly", async () => {
    fs.existsSync.mockReturnValue(true);
    fs.createReadStream.mockReturnValue({
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn().mockImplementation(function (event, handler) {
        if (event === "data") {
          handler({
            FromLine: "Green",
            ToLine: "Green",
            DateTime: "2021-03-24T07:58:30",
          });
          handler({
            FromLine: "Green",
            ToLine: "Red",
            DateTime: "2021-03-24T09:58:30",
          });
          handler({
            FromLine: "Red",
            ToLine: "Red",
            DateTime: "2021-03-25T11:58:30",
          });
        }
        if (event === "end") {
          handler();
        }
        return this;
      }),
    });

    const res = await request(app)
      .post("/api/fare")
      .send({ filePath: "test.csv" });
    console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.totalFare).toBe(7);
  });
});
