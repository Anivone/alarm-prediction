import { spawn } from "child_process";
import path from "path";

export const lemmatize = (data: string[]): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const pythonPath = path.join(__dirname, "lemmatizer.py");
    const pythonData = JSON.stringify(data);

    const pythonProcess = spawn("python3", [pythonPath, pythonData]);

    let lemmatizationResult = "";
    pythonProcess.stdout.on("data", (chunkData: Buffer) => {
      const chunk = chunkData.toString("utf-8");

      if (chunk.includes("exit")) {
        const [finalChunk] = chunk.split("exit");
        lemmatizationResult += finalChunk;

        const pattern = /[\[\s"]+/g;
        const finalData = lemmatizationResult.replace(pattern, "").split(",");

        resolve(finalData);
      } else {
        lemmatizationResult += chunk;
      }
    });

    pythonProcess.stderr.on("error", (err) => {
      reject(err);
    });

    pythonProcess.on("close", () => {
      console.log("Python process closed");
    });
  });
};
