import parsed_reports from "../parsed_reports.json";
import { Document } from "./reports/document/DocumentManager";
import { TfIdf } from "./reports/tf-idf/TfIdf";
import { savePreprocessedToJson } from "./reports/utils/file/json";

const parsedReports = parsed_reports as Document[];

const run = () => {
  for (const parsedReport of parsedReports) {
    TfIdf.sortTfIdf(parsedReport);
  }
  savePreprocessedToJson(parsedReports, "parsed_sorted_reports.json");
}

run();