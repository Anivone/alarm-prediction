import { Document } from "../document/DocumentManager";
import { getAllTerms, getAllTfIdfTerms, mergeSort } from "./utils";
import {
  TF_IDF_RELEVANT_CONTENT_OFFSET,
  TF_IDF_VECTOR_LIMIT,
} from "./constants";

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
  }

  public static sortTfIdf(document: Document) {
    if (!document.tfIdf) return;
    const sortedEntries = mergeSort(
      [...Object.entries(document.tfIdf)],
      "DESC"
    );
    document.tfIdf = Object.fromEntries(sortedEntries);
  }

  public static averageTopTfIdf(documents: Document[]): Record<string, number> {
    const totalDictionary: Record<string, number> = {};

    for (const document of documents) {
      const tfIdf = document.tfIdf!;
      for (const [key, value] of Object.entries(tfIdf)) {
        totalDictionary[key] = (totalDictionary[key] ?? 0) + value;
      }
    }

    for (const key of Object.keys(totalDictionary)) {
      totalDictionary[key] /= documents.length;
    }

    const totalDocument = { tfIdf: totalDictionary } as Document;

    this.sortTfIdf(totalDocument);
    this.sliceTfIdf(totalDocument);

    return totalDocument.tfIdf!;
  }

  private static sliceTfIdf(document: Document) {
    document.tfIdf = Object.fromEntries(
      Object.entries(document.tfIdf!).slice(
        TF_IDF_RELEVANT_CONTENT_OFFSET,
        TF_IDF_RELEVANT_CONTENT_OFFSET + TF_IDF_VECTOR_LIMIT
      )
    );
  }

  public static mapTfIdfToTop(
    documents: Document[],
    averageTop: Record<string, number>
  ) {
    for (const document of documents) {
      document.tfIdf = Object.fromEntries(
        Object.entries(document.tfIdf!).filter(([term]) =>
          Boolean(averageTop[term])
        )
      );
    }
  }
}
