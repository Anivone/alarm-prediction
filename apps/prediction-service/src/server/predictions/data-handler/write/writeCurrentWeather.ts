import { REGIONS_IDS } from "../../../../constants/constants";
import { writeWeather } from "../../../api/utils";
import { getWeather } from "../../../api/getWeather";

export const writeCurrentWeather = async (regionName: string) => {
  if (regionName === "all") {
    const regionNames = Object.keys(REGIONS_IDS);
    const weathersList = await Promise.all(regionNames.map(getWeather));
    writeWeather(weathersList.flat());
  } else {
    const weather = await getWeather(regionName);
    writeWeather(weather);
  }
}