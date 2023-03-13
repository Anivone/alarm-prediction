import stopWords from "../stopWords.json";
import { removeStopwords } from "stopword";
import converter from "number-to-words";

type PipeFunction<T> = (inputData: T) => Promise<T> | T
export const pipe = async <T>(
  data: T,
  ...funcs: PipeFunction<T>[]
): Promise<T> => {
  let result = data;

  for (const func of funcs) {
    result = await func(result);
  }

  return result;
};

export const removeStopWords = (words: string[]) => {
  return removeStopwords(words, stopWords);
};

export const removeSmallWords = (words: string[]) => {
  return words.filter((word) => word.length > 2);
};

export const transformNumberToWords = (words: string[]) => {
  return words.map((word) => {
    if (Number(word)) {
      return converter.toWords(word);
    } else {
      return word;
    }
  });
};

export const removePunctuation = (words: string[]) => {
  const result: string[] = [];

  const pattern = /[^\w\s]/gi;
  words.forEach((word) => {
    const replaced = word.replace(pattern, " ");

    const splitWordsByPunctuation = replaced.split(" ");
    const trimmedWords = splitWordsByPunctuation.map((split) => split.trim());
    const filteredLengthWords = trimmedWords.filter(
      (trimmed) => trimmed.length
    );

    result.push(...filteredLengthWords);
  });

  return result;
};
