import { Document } from "../document/DocumentManager";
import { getAllTerms, mergeSort } from "./utils";
import { TF_IDF_VECTOR_LIMIT } from "./constants";

export class TfIdf {
  public static calculate(documents: Document[], filterZero = false) {
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

        documentTF = documentTF / document.preprocessed_final!.length;

        const documentIDF = Math.log(
          documents.length / allDocumentsTermFrequency
        );
        const documentTfIdf = documentTF * documentIDF;

        if (documentTfIdf === 0 && filterZero) continue;

        document.tfIdf![term] = documentTfIdf;
      }
    }

    for (const document of documents) {
      TfIdf.sortTfIdf(document);
      this.sliceTfIdf(document);
    }
  }

  public static sortTfIdf(document: Document) {
    if (!document.tfIdf) return;
    const sortedEntries = mergeSort(
      [...Object.entries(document.tfIdf)],
      "DESC"
    );
    document.tfIdf = Object.fromEntries(sortedEntries);
  }

  private static sliceTfIdf(document: Document) {
    document.tfIdf = Object.fromEntries(
      Object.entries(document.tfIdf!).slice(0, TF_IDF_VECTOR_LIMIT)
    );
  }
}
