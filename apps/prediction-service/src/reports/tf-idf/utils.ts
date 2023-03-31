import { Document, DocumentManager } from "../document/DocumentManager";

export const getAllTerms = (documents: Document[]): string[] => {
  const allDuplicatedTerms = documents
    .map((document) => document.preprocessed_final!)
    .flat();
  return [...new Set(allDuplicatedTerms)];
};

type TermTfIdf = [term: string, tfIdf: number];
type SortOrder = "ASC" | "DESC";

export const mergeSort = (
  arr: TermTfIdf[],
  order: SortOrder = "ASC"
): TermTfIdf[] => {
  // Base case
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  // Recursive calls
  const left = mergeSort(arr.slice(0, mid), order);
  const right = mergeSort(arr.slice(mid), order);
  return merge(left, right, order);
};

const merge = (
  left: TermTfIdf[],
  right: TermTfIdf[],
  order: SortOrder = "ASC"
): TermTfIdf[] => {
  const sortedArr = []; // the sorted items will go here
  while (left.length && right.length) {
    const [, leftValue] = left[0];
    const [, rightValue] = right[0];
    // Insert smaller item into sortedArr
    if (order === "ASC" ? leftValue < rightValue : leftValue > rightValue) {
      sortedArr.push(left.shift()!);
    } else {
      sortedArr.push(right.shift()!);
    }
  }
  // Use spread operators to create a new array, combining the three arrays
  return [...sortedArr, ...left, ...right];
};
