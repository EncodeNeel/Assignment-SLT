const { calculateFare, isPeakHour } = require("./fareCalculator");
const moment = require("moment");

describe("Fare Calculator Utility Functions", () => {
  test("isPeakHour should return true for peak hours", () => {
    const datetime = moment().day("Monday").hour(9).minute(0);
    expect(isPeakHour(datetime)).toBe(true);
  });

  test("isPeakHour should return false for non-peak hours", () => {
    const datetime = moment().day("Monday").hour(11).minute(0);
    expect(isPeakHour(datetime)).toBe(false);
  });

  test("calculateFare should return correct fare for peak hours", () => {
    const datetime = moment().day("Monday").hour(9).minute(0);
    const fare = calculateFare("Green", "Red", datetime);
    expect(fare).toBe(3);
  });

  test("calculateFare should return correct fare for non-peak hours", () => {
    const datetime = moment().day("Monday").hour(11).minute(0);
    const fare = calculateFare("Green", "Red", datetime);
    expect(fare).toBe(2);
  });
});
