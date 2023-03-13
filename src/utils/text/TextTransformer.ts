import { Lemmatizer } from "../lemmatization/Lemmatizer";
import { removeStopwords } from "stopword";
import stopWords from "../../../stopWords.json";
import converter from "number-to-words";
import { NGrams } from "natural";

type PipeFunction<T> = (inputData: T) => Promise<T> | T;
type IntermediateFunction<T> = (
  index: number,
  data: T,
  transformation: TextTransformations
) => void;

export enum TextTransformations {
  RemoveStopWords = "removeStopWords",
  RemoveSmallWords = "removeSmallWords",
  NumbersToWords = "transformNumbersToWords",
  RemovePunctuation = "transformNumbersToWords",
  ToLowercase = "lowercase",
  Lemmatize = "lemmatize",
  Bigram = "bigram"
}

type Transformations<T> = { [key in TextTransformations]: PipeFunction<T> };

export class TextTransformer {
  private readonly textTransformations: Transformations<string[]> = {
    [TextTransformations.RemoveStopWords]: this.removeStopWords,
    [TextTransformations.RemoveSmallWords]: this.removeSmallWords,
    [TextTransformations.NumbersToWords]: this.transformNumberToWords,
    [TextTransformations.RemovePunctuation]: this.removePunctuation,
    [TextTransformations.ToLowercase]: this.lowercase,
    [TextTransformations.Lemmatize]: Lemmatizer.lemmatize,
    [TextTransformations.Bigram]: this.bigram
  };

  public async pipe(
    data: string[],
    transformations: TextTransformations[],
    intermediateFunc?: IntermediateFunction<string[]>
  ): Promise<string[]> {
    let result = data;

    for (const [index, transformation] of transformations.entries()) {
      result = await this.textTransformations[transformation](result);
      intermediateFunc?.(index, result, transformation);
    }

    return result;
  }

  private removeStopWords(words: string[]) {
    return removeStopwords(words, stopWords);
  }

  private removeSmallWords(words: string[]) {
    return words.filter((word) => word.length > 2);
  }

  private transformNumberToWords(words: string[]) {
    return words.map((word) => {
      if (Number(word)) {
        return converter.toWords(word);
      } else {
        return word;
      }
    });
  }

  private removePunctuation(words: string[]) {
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
  }

  private lowercase(words: string[]) {
    return words.map((word) => word.toLowerCase());
  }

  private bigram(words: string[]) {
    return NGrams.bigrams(words).map((array) => array.join(" "));
  }
}
