import * as csw_writer from "csv-writer";
import { Document } from "../../document/DocumentManager";
import path from "path";
import { DateManager } from "../date/DateManager";
import fs from "fs";
import { getAllTerms, getAllTfIdfTerms } from "../../tf-idf/utils";

const CSV_RESULT_FILE_PATH = path.join(
  process.cwd(),
  "all_days_isw_reports_parsed.csv"
);
const CSV_SEPARATOR = ";";

type CsvRecord = { date: string; tf_idf: string };

export const saveToCsv_streams = (documents: Document[]) => {
  const allTfIdfTerms = getAllTfIdfTerms(documents);
  const stream = fs.createWriteStream(CSV_RESULT_FILE_PATH);
  const headers: string[] = ["date", ...allTfIdfTerms];
  stream.write(headers.join(CSV_SEPARATOR) + "\n");

  for (const document of documents) {
    const tfIdf = document.tfIdf!;
    const data = [
      DateManager.formatDate(document.date),
      ...allTfIdfTerms.map((term) => tfIdf[term] ?? 0),
    ];
    stream.write(data.join(CSV_SEPARATOR) + "\n");
  }

  stream.end(() => {
    console.log("CSV successfully written!");
  });
};
