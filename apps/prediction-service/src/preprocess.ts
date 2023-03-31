import { TextTransformation } from "./reports/utils/text/types";
import isw from "../reports.json";
import { IswReport } from "./types";
import { DocumentManager } from "./reports/document/DocumentManager";
import { savePreprocessedToJson } from "./reports/utils/file/json";
import { TfIdf } from "./reports/tf-idf/TfIdf";

const transformations = [
  TextTransformation.ToLowercase,
  TextTransformation.NumbersToWords,
  TextTransformation.RemovePunctuation,
  TextTransformation.RemoveStopWords,
  TextTransformation.RemoveSmallWords,
  TextTransformation.LancasterStem,
  TextTransformation.Bigram,
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
  TfIdf.calculate(documentManagers);
  savePreprocessedToJson(documentManagers.map(({ document }) => document));
};

run();
