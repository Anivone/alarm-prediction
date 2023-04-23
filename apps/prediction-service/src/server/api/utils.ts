import { Alarm } from "./types";
import { writeCsvFileStreamed } from "../predictions/streams/writeFileStreamed";

const transformAlarmsToRow = (alarm: Alarm): string =>
  toCsvString(Object.values(alarm));

const transformWeatherToRow = (weather: any): string =>
  toCsvString(Object.values(weather));

export const writeAlarms = (alarms: Alarm[]) => {
  const fileName = "new_alarms.csv";
  const columns = toCsvString(Object.keys(alarms[0]));
  const alarmRows = alarms.map(transformAlarmsToRow);
  writeCsvFileStreamed(alarmRows, columns, fileName);
};

export const writeWeather = (weather: any[]) => {
  const fileName = "new_weather.csv";
  const columns = toCsvString(Object.keys(weather[0]));
  const weatherRows = weather.map(transformWeatherToRow);
  writeCsvFileStreamed(weatherRows, columns, fileName);
};

export const toCsvString = (value: string | string[]): string => {
  const getItemTicks = (item: string) => item === "NULL" ? item : `"${item}"`;
  if (Array.isArray(value)) {
    return value.map((item) => getItemTicks(item)).join(",")
  }

  return getItemTicks(value);
}
export const toCsvDateTime = (datetime: string) =>
  datetime.replace("T", " ").replace("Z", "");
