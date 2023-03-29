import { Document, DocumentManager } from "../document/DocumentManager";

export const getAllTerms = (documents: Document[]): string[] => {
  const allDuplicatedTerms = documents
    .map((document) => document.preprocessed_final!)
    .flat();
  return [...new Set(allDuplicatedTerms)];
};
