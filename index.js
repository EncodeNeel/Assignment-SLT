import express from "express";
import cors from "cors";
import bp from "body-parser";
import fareRoutes from "./routes/fare.js";

const app = express();

// Middlewares
app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));

app.use("/api", fareRoutes);

app.get("/", (req, res) => {
  console.log("Home route");
  res.send({ msg: "Hello from be" });
});

app.listen(3000, () => {
  console.log("App running on port 3000");
});
