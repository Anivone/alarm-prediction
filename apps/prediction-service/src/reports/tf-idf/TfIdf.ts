import { Document, DocumentManager } from "../document/DocumentManager";
import { getAllTerms } from "./utils";

export class TfIdf {
  public static calculate(documentManagers: DocumentManager[]) {
    const documents = documentManagers.map(({ document }) => document);
    const allTerms = getAllTerms(documents);

    for (const term of allTerms) {
      let allDocumentsTermFrequency = 0;
      for (const document of documents) {
        if (document.preprocessed_final!.includes(term)) {
          allDocumentsTermFrequency++;
        }
      }

      for (const document of documents) {
        let documentTF = 0;
        for (const documentTerm of document.preprocessed_final!) {
          if (documentTerm === term) {
            documentTF++;
          }
        }

        const documentIDF = Math.log(documents.length / allDocumentsTermFrequency);
        const documentTfIdf = documentTF * documentIDF;

        if (documentTfIdf > 0) {
          document.tfIdf!.set(term, documentTfIdf);
        }
      }
    }
  }
}
