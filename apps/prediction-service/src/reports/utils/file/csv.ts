import * as csw_writer from "csv-writer";
import { Document } from "../../document/DocumentManager";
import path from "path";
import { DateManager } from "../date/DateManager";
import fs from "fs";
import { getAllTerms, getAllTfIdfTerms } from "../../tf-idf/utils";

const CSV_RESULT_FILE_PATH = "all_days_isw_reports_parsed.csv";
const CSV_RESULT_VECTOR_MAPPED_FILE_PATH = "all_days_isw_reports_parsed_v2.csv";
const CSV_SEPARATOR = ";";

type CsvRecord = { date: string; tf_idf: string };

export const saveToCsv_streams = (documents: Document[]) => {
  // const allTfIdfTerms = getAllTfIdfTerms(documents);
  const stream = fs.createWriteStream(getCsvFilePath(CSV_RESULT_FILE_PATH));
  const headers: string[] = ["date", "keywords"];
  stream.write(headers.join(CSV_SEPARATOR) + "\n");

  for (const document of documents) {
    const tfIdf = document.tfIdf!;
    const data = [
      DateManager.formatDate(document.date),
      JSON.stringify(tfIdf),
      // ...allTfIdfTerms.map((term) => tfIdf[term] ?? 0),
    ];
    stream.write(data.join(CSV_SEPARATOR) + "\n");
  }

  stream.end(() => {
    console.log("CSV successfully written!");
  });
};

export const saveToCsvVectorMapped_streams = (documents: Document[]) => {
  const stream = fs.createWriteStream(
    getCsvFilePath(CSV_RESULT_VECTOR_MAPPED_FILE_PATH)
  );
  const headers: string[] = ["date", "keywords"];
  const allTfIdfTerms = getAllTfIdfTerms(documents);
  stream.write(headers.join(CSV_SEPARATOR) + "\n");

  for (const document of documents) {
    const tfIdf = document.tfIdf!;
    const data = [
      DateManager.formatDate(document.date),
      JSON.stringify(allTfIdfTerms.map((term) => tfIdf[term] ?? 0)),
    ];
    stream.write(data.join(CSV_SEPARATOR) + "\n");
  }

  stream.end(() => {
    console.log("CSV successfully written!");
  });
};

const getCsvFilePath = (fileName: string) => path.join(process.cwd(), fileName);
