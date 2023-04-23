import isw from "../../../data/reports.json";
import terms from "../../../data/terms.json";
import { IswReport } from "../types";
import { DocumentManager } from "./document/DocumentManager";
import { TextTransformation } from "./utils/text/types";
import { TfIdf } from "./tf-idf/TfIdf";
import {
  getCsvFilePath,
  saveToCsv_streams,
  saveToCsvTermColumns_streams,
  saveToCsvVectorMapped_streams
} from "./utils/file/csv";
import fs from "fs";

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

const iswReports = (isw as IswReport[]).filter(Boolean);

export const evaluateTfIdf = async () => {
  const documentManagers = await Promise.all(
    iswReports
      .map((iswReport) => new DocumentManager(iswReport))
      .map((documentManager) =>
        documentManager.processDocument(transformations)
      )
  );
  const documents = documentManagers.map(({ document }) => document);

  TfIdf.calculate(documents);

  TfIdf.mapTfIdfToDefinedTerms(documents, terms as string[])

  saveToCsvTermColumns_streams(documents, terms);
};

evaluateTfIdf().then();
