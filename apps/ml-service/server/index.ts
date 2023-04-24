import express from "express";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

import cors from "cors";
import predictionsRouter from "./controllers/predictions";
import { setupConsumers } from "./rabbitmq/config";

const PORT = Number(process.env.ML_SERVICE_PORT);
const app = express();

app.use(cors({ credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(predictionsRouter);

app.listen(PORT, async () => {
  console.log("ml-service is listening on port", PORT);
  // await readRegionsFromPredictions("all");

  await setupConsumers();
});
