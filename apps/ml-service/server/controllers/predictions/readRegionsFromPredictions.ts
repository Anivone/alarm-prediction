import path from "path";
import fs from "fs";
import { PredictionResult } from "./types";
import csv from "csvtojson/index";
import { REGIONS_ENG_UA, REGIONS_UA_ENG } from "../../constants/regions";

export const readRegionsFromPredictions = async (regionName: string) => {
  const filePath = path.join(process.cwd(), "data", "data_result.csv");
  try {
    fs.accessSync(filePath);
  } catch (err) {
    return [];
  }

  const csvRecords: PredictionResult[] = await csv().fromFile(filePath);
  const predictionResults = csvRecords.map(parsePredictionResult);

  if (regionName === "all") {
    return predictionResults;
  } else {
    return predictionResults.filter(
      ({ city_label }) => regionName === city_label
    );
  }
};

const parsePredictionResult = ({
  city_label,
  hour_datetime_label,
  is_alarm,
  events_last_24h,
}: PredictionResult) => ({
  city_label: REGIONS_UA_ENG[city_label],
  hour_datetime_label,
  is_alarm: is_alarm === "True",
  events_last_24h: Number(events_last_24h)
});
