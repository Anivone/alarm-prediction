import isw from "../../../reports.json";
import { IswReport } from "../types";
import { DocumentManager } from "./document/DocumentManager";
import { TextTransformation } from "./utils/text/types";
import { TfIdf } from "./tf-idf/TfIdf";
import {
  saveToCsv_streams,
  saveToCsvTermColumns_streams,
  saveToCsvVectorMapped_streams
} from "./utils/file/csv";

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

  saveToCsvTermColumns_streams(documents, Object.keys(averageTop));
};

run().then();
