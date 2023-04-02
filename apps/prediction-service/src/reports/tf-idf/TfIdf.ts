import { Document, DocumentManager } from "../document/DocumentManager";
import { getAllTerms, mergeSort } from "./utils";

export class TfIdf {
  public static calculate(documents: Document[]) {
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

        const documentIDF = Math.log(
          documents.length / allDocumentsTermFrequency
        );
        const documentTfIdf = documentTF * documentIDF;

        document.tfIdf![term] = documentTfIdf;
      }
    }

    for (const document of documents) {
      TfIdf.sortTfIdf(document);
    }
  }

  public static sortTfIdf(document: Document) {
    if (!document.tfIdf) return;
    const sortedEntries = mergeSort([...Object.entries(document.tfIdf)], "DESC")
    document.tfIdf = Object.fromEntries(sortedEntries);
  }
}
