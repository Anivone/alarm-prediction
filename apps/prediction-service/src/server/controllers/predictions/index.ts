import express from "express";
import { REGIONS_IDS } from "../../constants/constants";
import axios from "axios";
import { getAxiosPredictionsConfig } from "../../constants/predictions";
import { getPredictions } from "../../api/getPredictions";
import { updatePredictions } from "../../predictions/updatePredictions";
import { PredictionResult } from "./types";
import { preparePredictionResponse } from "./utils";

const predictionsRouter = express.Router();

predictionsRouter.post("/predictions", async (req, res) => {
  const regionName: string | undefined = req.body.regionName;
  console.log(regionName);
  if (!regionName) {
    return res.status(400).json({ error: "Input region name" });
  }
  if (regionName !== "all" && !Object.keys(REGIONS_IDS).includes(regionName)) {
    return res.status(400).json({ error: "Invalid region name" });
  }

  const predictionResults: PredictionResult[] = await getPredictions(
    regionName
  );

  return res.status(201).json(preparePredictionResponse(predictionResults));
});

predictionsRouter.post("/predictions/update", async (req, res) => {
  try {
    await updatePredictions();
    return res
      .status(201)
      .json({ message: "Predictions successfully updated !" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default predictionsRouter;
