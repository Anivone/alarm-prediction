import express from "express";
import axios from "axios";
import { REGIONS_IDS } from "./constants";

interface PredictionsRegionsBody {
  region: string;
}

const router = express.Router();

router.post(
  "/predictions/region",
  async (req: express.Request<any, any, PredictionsRegionsBody>, res) => {
    const { region } = req.body;
    const regionIds =
      region === "all"
        ? Object.values(REGIONS_IDS)
        : [Object.entries(REGIONS_IDS).find(
            ([key]) => key.toLowerCase() === region.toLowerCase()
          )?.[1]];

    if (!regionIds[0]) {
      return res.status(400).json({
        error: "Invalid region"
      })
    }

    const mlPrediction = await axios.get(
      `http://${process.env.ML_SERVICE_HOST}:${process.env.ML_SERVICE_PORT}/test`
    );
    const predictionData = mlPrediction.data;

    return res.json({
      regionIds,
      predictionData,
    });
  }
);

export default router;
