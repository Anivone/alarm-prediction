import { AxiosRequestConfig, AxiosResponseTransformer } from "axios";

const WEATHER_API_URL = `https://api.open-meteo.com/v1/forecast`;
type Location = {
  latitude: number;
  longitude: number;
};

export const REGIONS_LAT_LON: Record<string, Location> = {
  Simferopol: { latitude: 44.96, longitude: 34.11 },
  Vinnytsia: { latitude: 49.23, longitude: 28.47 },
  Lutsk: { latitude: 50.76, longitude: 25.34 },
  Dnipro: { latitude: 48.47, longitude: 35.04 },
  Donetsk: { latitude: 48.02, longitude: 37.8 },
  Zhytomyr: { latitude: 50.26, longitude: 28.68 },
  Uzhgorod: { latitude: 48.62, longitude: 22.29 },
  Zaporozhye: { latitude: 47.85, longitude: 35.12 },
  "Ivano-Frankivsk": { latitude: 48.92, longitude: 24.71 },
  Kyiv: { latitude: 50.45, longitude: 30.52 },
  Kropyvnytskyi: { latitude: 48.54, longitude: 32.28 },
  Luhansk: { latitude: 48.57, longitude: 39.32 },
  Lviv: { latitude: 49.84, longitude: 24.02 },
  Mykolaiv: { latitude: 46.98, longitude: 31.99 },
  Odesa: { latitude: 46.49, longitude: 37.74 },
  Poltava: { latitude: 49.59, longitude: 35.55 },
  Rivne: { latitude: 50.62, longitude: 26.23 },
  Sumy: { latitude: 50.92, longitude: 34.8 },
  Ternopil: { latitude: 49.55, longitude: 25.59 },
  Kharkiv: { latitude: 48.98, longitude: 36.25 },
  Kherson: { latitude: 46.64, longitude: 32.61 },
  Khmelnytskyi: { latitude: 49.42, longitude: 26.98 },
  Cherkasy: { latitude: 49.44, longitude: 32.06 },
  Chernivtsi: { latitude: 48.29, longitude: 25.93 },
  Chernihiv: { latitude: 51.51, longitude: 31.28 },
};

export const getAxiosWeatherConfig = (
  location: Location,
  transformResponse?: AxiosResponseTransformer
): AxiosRequestConfig => ({
  url: WEATHER_API_URL,
  method: "get",
  headers: {
    Accept: "application/json",
  },
  params: {
    latitude: location.latitude,
    longitude: location.longitude,
    hourly:
      "temperature_2m,precipitation,cloudcover,windspeed_10m,winddirection_80m,rain,snowfall",
    past_days: 1,
    forecast_days: 2,
    timezone: "auto"
  },
  transformResponse,
});
