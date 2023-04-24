import { writeCurrentAlarms } from "./write/writeCurrentAlarms";
import { writeCurrentWeather } from "./write/writeCurrentWeather";
import { writeCurrentIsw } from "./write/writeCurrentIsw";

export const saveNewData = async (regionName: string) => {
  await writeCurrentAlarms(regionName);
  await writeCurrentWeather(regionName);
  await writeCurrentIsw();
}