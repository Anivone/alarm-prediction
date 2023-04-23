import express from "express";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(__dirname, "..", ".env"),
});

import cors from "cors";
import router from "./server/predictions";
import { readFileStreamed } from "./server/predictions/queue-streams/readFileStreamed";
import { getCsvFilePath } from "./data-manager/reports/utils/file/csv";
import { getAlarms } from "./server/api/getAlarms";
import { getWeather } from "./server/api/getWeather";
import { writeAlarms, writeWeather } from "./server/api/utils";


const PORT = process.env.SERVER_PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true }));

app.use(router);
app.use("/new", async (req, res) => {
  const alarms = await getAlarms("Kyiv");
  writeAlarms(alarms);
  const weather = await getWeather("Kyiv");
  writeWeather(weather);

  return res.send("success");
});

app.listen(PORT, async () => {
  console.log("prediction-service is listening on port", PORT);

  // await readFileStreamed(getCsvFilePath("merged_dataset.csv"));
});
