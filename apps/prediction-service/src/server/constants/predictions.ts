import { AxiosRequestConfig, AxiosResponseTransformer } from "axios";

const PREDICTIONS_API_URL = `http://${process.env.ML_SERVICE_HOST}:${process.env.ML_SERVICE_PORT}/predictions`;

export const getAxiosPredictionsConfig = (
  data: { regionName: string },
  transformResponse?: AxiosResponseTransformer,
): AxiosRequestConfig => ({
  url: PREDICTIONS_API_URL,
  method: "post",
  headers: {
    Accept: "application/json"
  },
  data,
  transformResponse,
});