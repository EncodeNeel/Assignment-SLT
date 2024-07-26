import { calculateFare, isPeakHour } from "../utils/fareCalculator";
import moment from "moment";

describe("fareCalculator", () => {
  test("calculates fare correctly during peak hours", () => {
    const fromLine = "Green";
    const toLine = "Red";
    const datetime = moment("2021-03-24T09:00:00").toISOString(); // peak hour
    const fare = calculateFare(fromLine, toLine, datetime);
    expect(fare).toBe(3); // Expected fare for Green to Red during peak hours
  });

  test("calculates fare correctly during non-peak hours", () => {
    const fromLine = "Red";
    const toLine = "Green";
    const datetime = moment("2021-03-24T11:00:00").toISOString(); // non-peak hour
    const fare = calculateFare(fromLine, toLine, datetime);
    expect(fare).toBe(2); // Expected fare for Red to Green during non-peak hours
  });

  test("checks if a time is peak hour correctly", () => {
    const peakDatetime = moment("2021-03-24T09:00:00").toISOString();
    const nonPeakDatetime = moment("2021-03-24T11:00:00").toISOString();

    expect(isPeakHour(peakDatetime)).toBe(true);
    expect(isPeakHour(nonPeakDatetime)).toBe(false);
  });
});
