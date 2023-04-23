import path from "path";
import { csvToJson } from "./csvToJson";

export const getWeatherUniqueDates = async () => {
  const filePath = path.join(process.cwd(), "data", "new_weather.csv");
  const json = await csvToJson(filePath);

  const weatherDates = json.map(getWeatherRecordDate);
  return [...new Set(weatherDates)];
};

const getWeatherRecordDate = (record: Record<string, string>): string =>
  (record.hour_datetime || "").split("T")[0];