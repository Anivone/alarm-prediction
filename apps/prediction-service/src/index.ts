import isw from "../reports.json";
import { IswReport } from "./types";
import { DocumentManager } from "./reports/document/DocumentManager";
import { TextTransformation } from "./reports/utils/text/types";
import { TfIdf } from "./reports/tf-idf/TfIdf";

const transformations = [
  TextTransformation.ToLowercase,
  TextTransformation.NumbersToWords,
  TextTransformation.RemovePunctuation,
  TextTransformation.RemoveStopWords,
  TextTransformation.RemoveSmallWords,
  TextTransformation.Lemmatize,
  TextTransformation.Bigram,
];

const iswReports = (isw as IswReport[]).slice(1, 20);

const run = async () => {
  const documentManagers = await Promise.all(
    iswReports
      .map((iswReport) => new DocumentManager(iswReport))
      .map((documentManager) =>
        documentManager.processDocument(transformations)
      )
  );
  TfIdf.calculate(documentManagers);
  console.log(documentManagers[0].document.tfIdf);
};

run();
