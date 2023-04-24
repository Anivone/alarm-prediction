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
import { REGIONS_IDS } from "./constants/constants";
import { getCurrentIsw } from "./server/predictions/data-handler/utils/getCurrentIsw";
import { writeCurrentIsw } from "./server/predictions/data-handler/write/writeCurrentIsw";
import { getWeatherUniqueDates } from "./server/predictions/data-handler/utils/getWeatherUniqueDates";
import { saveNewData } from "./server/predictions/data-handler/saveNewData";

const PORT = process.env.SERVER_PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true }));

app.use(router);
app.post("/new", async (req, res) => {
  const regionName: string | undefined = req.body.regionName;
  if (!regionName) {
    return res.status(400).json({ error: "Input region name" });
  }
  if (regionName !== "all" && !Object.keys(REGIONS_IDS).includes(regionName)) {
    return res.status(400).json({ error: "Invalid region name" });
  }

  await saveNewData(regionName);

  return res.send("success");
});

app.listen(PORT, async () => {
  console.log("prediction-service is listening on port", PORT);
  // await readFileStreamed(getCsvFilePath("merged_dataset.csv"));
});
