import { Document } from "../../document/DocumentManager";
import fs from "fs";
import path from "path";
import { getAllTerms } from "../../tf-idf/utils";
const jsonStream = require("JSONStream");

const PARSED_REPORTS_FILE_NAME = "parsed_reports.json";
const ALL_TERMS_FILE_NAME = "all_terms.json";

export const savePreprocessedToJson = (
  documents: Document[],
  fileName: string = PARSED_REPORTS_FILE_NAME
) => {
  const transformStream = jsonStream.stringify();
  const outputStream = fs.createWriteStream(getFilePath(fileName));
  transformStream.pipe(outputStream);
  documents.forEach(transformStream.write);
  transformStream.end();

  outputStream.on("finish", () => {
    console.log(`JSON ${fileName} file successfully written!`);
  })
  // fs.writeFile(getFilePath(fileName), JSON.stringify(documents), () => {
  //   console.log("JSON parsed_reports file successfully written!");
  // });
};

export const saveAllTermsToJson = (documents: Document[]) => {
  fs.writeFile(
    getFilePath(ALL_TERMS_FILE_NAME),
    JSON.stringify(getAllTerms(documents)),
    () => {
      console.log("JSON all_terms file successfully written!");
    }
  );
};

const getFilePath = (fileName: string) => path.join(process.cwd(), fileName);
