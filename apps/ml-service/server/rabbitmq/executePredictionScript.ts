import path from "path";
import { spawnSync } from "child_process";

export const executePredictionScript = (fileName: "main.py"): void => {
  const pythonPath = path.join(process.cwd(), fileName);
  spawnSync("python3", [pythonPath]);
  console.log("data_result.csv successfully written");
};
