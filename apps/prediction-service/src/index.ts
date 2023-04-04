import isw from "../reports.json";
import { IswReport } from "./types";
import { DocumentManager } from "./reports/document/DocumentManager";
import { TextTransformation } from "./reports/utils/text/types";
import { TfIdf } from "./reports/tf-idf/TfIdf";
import { saveToCsv_streams } from "./reports/utils/file/csv";

const transformations = [
  TextTransformation.ToLowercase,
  TextTransformation.NumbersToWords,
  TextTransformation.RemovePunctuation,
  TextTransformation.RemoveStopWords,
  TextTransformation.RemoveSmallWords,
  TextTransformation.LancasterStem,
  // TextTransformation.Bigram,
];

const iswReports = (isw as IswReport[]).slice(1);

const run = async () => {
  const documentManagers = await Promise.all(
    iswReports
      .map((iswReport) => new DocumentManager(iswReport))
      .map((documentManager) =>
        documentManager.processDocument(transformations)
      )
  );
  const documents = documentManagers.map(({ document }) => document);

  TfIdf.calculate(documents);
  saveToCsv_streams(documents);
};

run().then();
