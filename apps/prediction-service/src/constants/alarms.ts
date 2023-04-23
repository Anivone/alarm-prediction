import { AxiosRequestConfig, AxiosResponseTransformer } from "axios";

const ALERTS_API_URL = `https://api.ukrainealarm.com`;
export const getAxiosAlertsConfig = (
  endpoint: ALERTS_API_ENDPOINT,
  params?: any,
  transformResponse?: AxiosResponseTransformer | AxiosResponseTransformer[]
): AxiosRequestConfig => ({
  url: endpoint,
  method: "get",
  baseURL: ALERTS_API_URL,
  headers: {
    Authorization: process.env.ALARMS_API_KEY,
    Accept: "application/json",
  },
  params,
  transformResponse,
});

export enum ALERTS_API_ENDPOINT {
  RegionHistory = `/api/v3/alerts/regionHistory`,
}
