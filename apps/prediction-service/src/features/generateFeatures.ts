import { parse } from "csv-parse";
import fs from "fs";
import path from "path";
import { MergedDatasetRecord } from "./types";
import {
  parseRawRecord,
} from "./utils";

const MERGED_DATASET_FILEPATH = path.join(process.cwd(), "merged_dataset.csv");
const mergedDataset = fs.readFileSync(MERGED_DATASET_FILEPATH);

const records: MergedDatasetRecord[] = [];
const parser = parse(mergedDataset, {
  delimiter: ";",
})
  .on("readable", () => {
    let rawRecord;
    let isFirst = true;
    while ((rawRecord = parser.read()) !== null) {
      if (isFirst) {
        isFirst = false;
        continue;
      }

      const record = parseRawRecord(rawRecord);
      records.push(record);
    }
  })
  .on("end", () => {
    console.log(Object.entries(records).slice(0, 5));
  });
