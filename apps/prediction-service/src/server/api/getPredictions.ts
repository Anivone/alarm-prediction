import axios from "axios";
import { getAxiosPredictionsConfig } from "../constants/predictions";

export const getPredictions = async (regionName: string) => {
  const response = await axios.request(
    getAxiosPredictionsConfig({ regionName })
  );
  return response.data.data;
};
