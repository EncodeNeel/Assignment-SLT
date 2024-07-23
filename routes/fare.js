import { Router } from "express";
import fs from "fs";
import csv from "csv-parser";
import { calculateFare } from "../utils/fareCalculator.js";

const router = Router();

router.post("/fare", (req, res) => {
  const { filePath } = req.body;
  if (!filePath) {
    return res.status(400).send({ error: "filePath is required" });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).send({ error: "File not found" });
  }

  const fares = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      const { FromLine, ToLine, DateTime } = row;
      try {
        const fare = calculateFare(FromLine, ToLine, DateTime);
        fares.push(fare);
      } catch (error) {
        console.error("Error calculating fare:", error);
      }
    })
    .on("end", () => {
      const totalFare = fares.reduce((sum, fare) => sum + fare, 0);
      res.send({ totalFare });
    })
    .on("error", (error) => {
      res.status(500).send({ error: "Error reading file" });
    });
});

export default router;
