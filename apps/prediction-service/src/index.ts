import express from "express";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

import { writeLastPredictionTime } from "./server/predictions/internal/writeLastPredictionTime";
import cors from "cors";
import predictionsRouter from "./server/controllers/predictions";

const PORT = process.env.SERVER_PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true }));

app.get("/", (req, res) => {
  return res.send("AlarmPrediction");
})
app.use(predictionsRouter);

// initializeScheduler();

app.listen(PORT, async () => {
  console.log("prediction-service is listening on port", PORT);
  // await writeLastPredictionTime(new Date().toISOString());
  // await updatePredictions();
});
