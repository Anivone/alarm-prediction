import axios from "axios";

import {
  getAxiosWeatherConfig,
  REGIONS_LAT_LON,
} from "../constants/weather";
import { REGIONS_ENG_UA } from "../constants/constants";
import { toCsvDateTime } from "./utils";

export const getWeather = async (regionName: string): Promise<any[]> => {
  if (!Object.keys(REGIONS_LAT_LON).includes(regionName)) {
    throw new Error("Invalid region name");
  }

  const regionLocation = REGIONS_LAT_LON[regionName];
  const response = await axios.request(
    getAxiosWeatherConfig(regionLocation, (data) => {
      const jsonData = JSON.parse(data);
      return parseWeatherResponse(jsonData, REGIONS_ENG_UA[regionName]);
    })
  );

  const hourlyWeather: any[] = response.data;
  return hourlyWeather;
};

type HourlyWeather = {
  city_resolvedAddress: string;
  latitude: number;
  longitude: number;
  timezone: string;
  hour_datetime: string;
  hour_temp: number;
  hour_precip: number;
  hour_cloudcover: number;
  hour_windspeed: number;
  hour_winddir: number;
  hour_conditions: string;
  day_datetime: string;
  hour_datetimeEpoch: string;
};

const SLICE_LIMIT = 12;
const parseWeatherResponse = (
  data: any,
  cityAddress: string
): HourlyWeather[] => {
  const { latitude, longitude, timezone, hourly } = data;

  const currentHour = new Date().getHours();

  const sliceOffset = 24 + currentHour;
  const sliceStart = sliceOffset - 24;

  return (hourly.time as string[])
    .slice(sliceStart, sliceOffset + SLICE_LIMIT)
    .map((hour_datetime, index) => {
      const snowfall = Number(hourly.snowfall[index]);
      const rain = Number(hourly.rain[index]);

      const cloudCover = Number(hourly.cloudcover[index]);
      const visibilityLabel = getVisibilityLabel(cloudCover);

      return {
        city_resolvedAddress: cityAddress,
        latitude,
        longitude,
        timezone,
        hour_datetime: toCsvDateTime(hour_datetime + ":00"),
        hour_temp: hourly.temperature_2m[index],
        hour_precip: hourly.precipitation[index],
        hour_cloudcover: cloudCover,
        hour_windspeed: hourly.windspeed_10m[index],
        hour_winddir: hourly.winddirection_80m[index],
        hour_conditions: getHourConditions(snowfall, rain, visibilityLabel),
        day_datetime: hour_datetime.split("T")[0],
        hour_datetimeEpoch: Math.floor(new Date(hour_datetime).getTime() / 1000).toString()
      } as HourlyWeather;
    });
};

const getVisibilityLabel = (cloudcover: number) => {
  if (cloudcover >= 90) {
    return "Overcast";
  } else if (cloudcover < 90 && cloudcover > 0) {
    return "Partially cloudy";
  }

  return "Clear";
};

const getHourConditions = (
  snow: number,
  rain: number,
  visibilityLabel: string
): string => {
  const hourConditions: string[] = [];
  if (snow > 0) hourConditions.push("Snow");
  if (rain > 0) hourConditions.push("Rain");
  hourConditions.push(visibilityLabel);

  return hourConditions
    .map((condition, index) =>
      index === 0 ? condition : condition.toLowerCase()
    )
    .join(", ");
};
