import * as csw_writer from "csv-writer";
import { Document } from "../../document/DocumentManager";
import path from "path";
import { DateManager } from "../date/DateManager";

type CsvRecord = { date: string; tf_idf: string };

export const saveToCsv = async (documents: Document[]) => {
  const csvWriter = csw_writer.createObjectCsvWriter({
    path: path.join(process.cwd(), "all_days_isw_reports_parsed.csv"),
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