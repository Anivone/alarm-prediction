import { spawn } from "child_process";
import * as path from "path";

export const executePythonLemmatization = (data: string[]): Promise<string[]> =>
  new Promise((resolve, reject) => {
    const pythonPath = path.join(process.cwd(), "src", "test.py");
    const pythonData = JSON.stringify(data);

    const pythonProcess = spawn("python3", [pythonPath, pythonData]);
    let total = "";
    pythonProcess.stdout.on("data", (data: Buffer) => {
      const result = data.toString("utf-8");

      if (result.includes("exit")) {
        const [lastResult] = result.split("exit");
        total += lastResult;

        const pattern = /[\[\s"]+/g;
        const totalResult = total.replace(pattern, "").split(',');

        resolve(totalResult)
      } else {
        total += result;
      }
    });

    pythonProcess.stderr.on("error", (err) => {
      reject(err);
    });

    pythonProcess.on("close", () => {
      console.log("Python process closed");
    });
  });
