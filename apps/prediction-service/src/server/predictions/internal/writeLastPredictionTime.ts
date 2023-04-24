import fs from "fs";
import path from "path";

export const writeLastPredictionTime = async (date: string) => {
  const filePath = path.join(process.cwd(), "data", "last_prediction_time.json");
  const data = [date];
  fs.writeFileSync(filePath, JSON.stringify(data));
}