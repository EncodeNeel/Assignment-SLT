import moment from "moment";

const fareRules = {
  peakHours: {
    Monday: ["08:00-10:00", "16:30-19:00"],
    Tuesday: ["08:00-10:00", "16:30-19:00"],
    Wednesday: ["08:00-10:00", "16:30-19:00"],
    Thursday: ["08:00-10:00", "16:30-19:00"],
    Friday: ["08:00-10:00", "16:30-19:00"],
    Saturday: ["10:00-14:00", "18:00-23:00"],
    Sunday: ["18:00-23:00"],
  },
  fares: {
    Green: {
      Green: { peak: 2, nonPeak: 1 },
      Red: { peak: 3, nonPeak: 2 },
    },
    Red: {
      Green: { peak: 3, nonPeak: 2 },
      Red: { peak: 4, nonPeak: 3 },
    },
  },
};

const isPeakHour = (datetime) => {
  const day = moment(datetime).format("dddd");
  const time = moment(datetime).format("HH:mm");
  const peakRanges = fareRules.peakHours[day];

  return peakRanges.some((range) => {
    const [start, end] = range.split("-");
    return moment(time, "HH:mm").isBetween(
      moment(start, "HH:mm"),
      moment(end, "HH:mm"),
      undefined,
      "[]"
    );
  });
};

const calculateFare = (fromLine, toLine, datetime) => {
  const peak = isPeakHour(datetime);
  const fareType = peak ? "peak" : "nonPeak";
  return fareRules.fares[fromLine][toLine][fareType];
};

export { calculateFare, isPeakHour };
