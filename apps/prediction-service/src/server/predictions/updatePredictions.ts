import path from "path";
import { saveNewData } from "./data-handler/saveNewData";
import { executeMergeScript } from "./merge/executeMergeScript";
import { readFileStreamed } from "./queue-streams/readFileStreamed";

export const updatePredictions = async () => {
  await saveNewData("all");
  await executeMergeScript("merge-new-datasets.py");

  const fileToWrite = "merged_dataset.csv";
  const dataPredFilePath = path.join(process.cwd(), 'data', "data_pred.csv");

  await readFileStreamed(dataPredFilePath, fileToWrite);
}