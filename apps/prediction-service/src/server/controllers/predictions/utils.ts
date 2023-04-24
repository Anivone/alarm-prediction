import fs from "fs";
import path from "path";
import { PredictionResult } from "./types";

export const preparePredictionResponse = (predictionResults: PredictionResult[]) => {
  const filePath = path.join(process.cwd(), "data", "last_prediction_time.json");
  const fileData = Buffer.from(fs.readFileSync(filePath)).toString("utf-8");
  const [last_prediction_time] = JSON.parse(fileData);
  return {
    last_model_train_time: "2023-04-24T16:23:11.296Z",
    last_prediction_time,
    regions_forecast: preparePredictionResults(predictionResults),
  }
}

type RegionForecast = Record<string, boolean>;

const preparePredictionResults = (predictionResults: PredictionResult[]) => {
  const result = {} as Record<string, RegionForecast>;
  const cities = predictionResults.map(({ city_label }) => city_label);
  cities.forEach((city) => {
    const regionForecast = {} as RegionForecast;
    const cityResults = predictionResults.filter(({ city_label }) => city_label === city);
    cityResults.forEach((result) => {
      regionForecast[getHourFromResponse(result.hour_datetime_label)] = result.is_alarm;
    })
    result[city] = regionForecast;
  });

  return result;
}

const getHourFromResponse = (date: string) =>
  date.split(" ")[1].split(":").slice(0, 2).join(":")