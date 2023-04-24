import express from "express";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

import { setupConsumers } from "./rabbitmq/config";


const PORT = Number(process.env.ML_SERVICE_PORT);
const app = express();

app.get("/", (req, res) => { res.send("ml-service says hello!") });

app.listen(PORT, async () => {
  console.log("ml-service is listening on port", PORT);

  await setupConsumers();
});
