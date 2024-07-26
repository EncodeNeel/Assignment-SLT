import request from "supertest";
import express from "express";
import fareRoutes from "../routes/fare.js";
import path from "path";
import fs from "fs";

const app = express();
app.use(express.json());
app.use("/api", fareRoutes);

describe("POST /api/fare", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("returns the total fare for a valid CSV file", async () => {
    const response = await request(app)
      .post("/api/fare")
      .send({ filePath: path.join(__dirname, "../input.csv") });

    expect(response.status).toBe(200);
    expect(response.body.totalFare).toBe(7);
  });

  test("returns 400 if filePath is not provided", async () => {
    const response = await request(app).post("/api/fare").send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("filePath is required");
  });

  test("returns 404 if file is not found", async () => {
    const response = await request(app)
      .post("/api/fare")
      .send({ filePath: "non_existent_file.csv" });
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("File not found");
  });

  test("returns 500 if there is an error reading the file", async () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);

    jest.spyOn(fs, "createReadStream").mockImplementation(() => {
      const { Readable } = require("stream");
      const stream = new Readable({
        read() {
          this.emit("error", new Error("Error reading file"));
        },
      });
      return stream;
    });

    const response = await request(app)
      .post("/api/fare")
      .send({ filePath: path.join(__dirname, "../input.csv") });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error reading file");
  });
});
