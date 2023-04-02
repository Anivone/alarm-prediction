import * as csw_writer from "csv-writer";
import { Document } from "../../document/DocumentManager";
import path from "path";
import { DateManager } from "../date/DateManager";
import fs from "fs";

const CSV_RESULT_FILE_PATH = path.join(
  process.cwd(),
  "all_days_isw_reports_parsed.csv"
);
const CSV_SEPARATOR = ";";

type CsvRecord = { date: string; tf_idf: string };

export const saveToCsv = async (documents: Document[]) => {
  const csvWriter = csw_writer.createObjectCsvWriter({
    path: CSV_RESULT_FILE_PATH,
    header: [
      { id: "date", title: "date" },
      { id: "tf_idf", title: "keywords" },
    ],
  });

  const records: CsvRecord[] = [];
  for (const document of documents) {
    records.push({
      date: DateManager.formatDate(document.date),
      tf_idf: JSON.stringify(document.tfIdf!),
    });
  }

  await csvWriter.writeRecords(records);
  console.log("CSV successfully written!");
};

export const saveToCsv_streams = (documents: Document[]) => {
  const stream = fs.createWriteStream(CSV_RESULT_FILE_PATH);
  const headers: string[] = ["date", "keywords"];
  stream.write(headers.join(CSV_SEPARATOR) + "\n");

  for (const document of documents) {
    const data = [
      DateManager.formatDate(document.date),
      JSON.stringify(document.tfIdf!),
    ];
    stream.write(data.join(CSV_SEPARATOR) + "\n");
  }

  stream.end(() => {
    console.log("CSV successfully written!");
  });
};
