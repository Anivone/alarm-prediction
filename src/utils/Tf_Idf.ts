import { DocumentManager } from "./DocumentManager";
import { TfIdf } from "natural";

export class Tf_Idf {
  private readonly tfIdf: TfIdf;

  constructor() {
    this.tfIdf = new TfIdf();
  }
  public prepareMeasurements(documents: DocumentManager[]) {
    const documentsBigrams: string[][] = documents.map(
      (document) => document.resultDocumentObject.relevantContent_final
    );

    let totalBigrams: string[] = [];
    totalBigrams = totalBigrams.concat(...documentsBigrams);

    const tfDictionary: Map<string, number> = new Map<string, number>();
    totalBigrams.forEach((bigram) => {
      const value = (tfDictionary.get(bigram) || 0) + 1;
      tfDictionary.set(bigram, value);
    });

    const idfDictionary: Map<string, number> = new Map<string, number>();
    totalBigrams.forEach((bigram) => {
      const count = documentsBigrams.filter((documentBigrams) =>
        documentBigrams.includes(bigram)
      ).length;
      idfDictionary.set(bigram, Math.log(documentsBigrams.length / count));
    });

    const tfIdf: Map<string, number> = new Map<string, number>();
    tfDictionary.forEach((value, key) => {
      tfIdf.set(key, (idfDictionary.get(key) || 0) * value);
    });

    return tfIdf;
  }
}
