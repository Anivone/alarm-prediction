import isw from "../reports.json";
import { IswReport } from "./types";
import { DocumentManager } from "./reports/document/DocumentManager";
import { TextTransformation } from "./reports/utils/text/types";
import { TfIdf } from "./reports/tf-idf/TfIdf";
import {
  saveToCsv_streams,
  saveToCsvTermColumns_streams,
  saveToCsvVectorMapped_streams
} from "./reports/utils/file/csv";
import { getAllTerms, getAllTfIdfTerms } from "./reports/tf-idf/utils";
import { saveAllTfIdfTermsToJson } from "./reports/utils/file/json";

const transformations = [
  TextTransformation.ToLowercase,
  // TextTransformation.NumbersToWords,
  TextTransformation.RemoveNumbers,
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
  const averageTop = TfIdf.averageTopTfIdf(documents);
  TfIdf.mapTfIdfToTop(documents, averageTop);

  console.log(documents[0].tfIdf);

  // saveToCsv_streams(documents);
  // saveToCsvVectorMapped_streams(documents);
  // saveAllTfIdfTermsToJson(documents);
  saveToCsvTermColumns_streams(documents, Object.keys(averageTop));
};

run().then();
