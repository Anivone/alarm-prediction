import { removeStopwords as libRemoveStopWords } from "stopword";
import converter from "number-to-words";
import { LancasterStemmer, NGrams, PorterStemmer } from "natural";
import stopWords from "../../../../../data/stopWords.json";

export const removeStopWords = (words: string[]) => {
  return libRemoveStopWords(words, stopWords);
};

export const removeSmallWords = (words: string[]) => {
  return words.filter((word) => word.length > 2);
};

export const transformNumberToWords = (words: string[]) => {
  const result: string[] = [];
  for (const word of words) {
    if (Number.isNaN(parseInt(word))) {
      result.push(word);
    } else {
      try {
        result.push(converter.toWords(word));
      } catch (err) {
        result.push(word);
      }
    }
  }
  return result;
};

export const removeNumbers = (words: string[]) => {
  const result: string[] = [];
  for (const word of words) {
    if (Number.isNaN(parseInt(word))) {
      result.push(word);
    }
  }
  return result;
}

export const removePunctuation = (words: string[]) => {
  const result: string[] = [];

  const pattern = /[^\w\s]/gi;
  for (const word of words) {
    const replaced = word.replace(pattern, " ");

    const splitWordsByPunctuation = replaced.split(" ");
    const trimmedWords = splitWordsByPunctuation.map((split) => split.trim());
    const filteredLengthWords = trimmedWords.filter(
      (trimmed) => trimmed.length
    );

    result.push(...filteredLengthWords);
  }

  return result;
};

export const lowercase = (words: string[]) => {
  const result: string[] = [];

  for (const word of words) {
    result.push(word.toLowerCase());
  }

  return result;
};

export const lancasterStem = (words: string[]) => {
  const result: string[] = [];

  for (const word of words) {
    result.push(LancasterStemmer.stem(word));
  }

  return result;
}

export const porterStem = (words: string[]) => {
  const result: string[] = [];

  for (const word of words) {
    result.push(PorterStemmer.stem(word));
  }

  return result;
}

export const bigram = (words: string[]) => {
  return NGrams.bigrams(words).map((array) => array.join(" "));
};
