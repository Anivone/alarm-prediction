import { Alarm } from "./types";
import { writeCsvFileStreamed } from "../predictions/streams/writeFileStreamed";

const transformAlarmsToRow = (alarm: Alarm): string =>
  Object.values(alarm).join(",");

const transformWeatherToRow = (weather: any): string =>
  Object.values(weather).join(",");

export const writeAlarms = (alarms: Alarm[]) => {
  const fileName = "new_alarms.csv";
  const columns = Object.keys(alarms[0]).join(",");
  const alarmRows = alarms.map(transformAlarmsToRow);
  writeCsvFileStreamed(alarmRows, columns, fileName);
}

export const writeWeather = (weather: any[]) => {
  const fileName = "new_weather.csv";
  const columns = Object.keys(weather[0]).join(",");
  const weatherRows = weather.map(transformWeatherToRow);
  writeCsvFileStreamed(weatherRows, columns, fileName);
}