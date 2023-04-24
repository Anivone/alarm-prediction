import path from "path";
import { spawn } from "child_process";

export const executeMergeScript = async (
  fileName: "merge-new-datasets.py" | "merge-datasets.py"
): Promise<void> =>
  new Promise((resolve, reject) => {
    const pythonPath = path.join(
      process.cwd(),
      "src",
      "data-manager",
      "merge",
      fileName
    );

    const pythonProcess = spawn("python3", [pythonPath]);

    pythonProcess.stdout.on("data", (chunkData: Buffer) => {
      const chunk = chunkData.toString("utf-8");

      if (chunk.includes("exit")) {
        console.log('Python process exit');
        pythonProcess.kill();
        resolve();
      }
    });

    pythonProcess.on("end", () => {
      console.log("Python process closed !");
    });

    pythonProcess.on("error", (err) => {
      reject(err);
    });
  });
