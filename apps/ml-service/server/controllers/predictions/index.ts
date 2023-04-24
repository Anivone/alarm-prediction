import express from "express";
import { REGIONS_ENG_UA } from "../../constants/regions";
import { readRegionsFromPredictions } from "./readRegionsFromPredictions";

const predictionsRouter = express.Router();

predictionsRouter.post("/predictions", async (req, res) => {
  const regionName: string | undefined = req.body.regionName;

  if (!regionName) {
    return res.status(400).json({
      error: "Input region name",
    });
  }
  if (regionName !== "all" && !Object.keys(REGIONS_ENG_UA).includes(regionName)) {
    return res.status(400).json({
      error: "Invalid region name"
    });
  }

  const predictionResults = await readRegionsFromPredictions(regionName);
  return res.status(201).json({
    data: predictionResults
  })
});

export default predictionsRouter;