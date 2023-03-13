import { DocumentManager } from "./DocumentManager";
import { TfIdf } from "natural";

export class Tf_Idf {
  private readonly tfIdf: TfIdf;

  constructor() {
    this.tfIdf = new TfIdf();
  }
  public prepareMeasurements(documents: DocumentManager[]) {
    const documentsContents: string[][] = documents.map(
      (document) => document.resultDocumentObject.relevantContent_final
    );
    documentsContents.forEach((documentContent) => {
      this.tfIdf.addDocument(documentContent);
    });

    return documents.map((document, index) => {
      return this.tfIdf.listTerms(index);
    }, this)
  }


}
