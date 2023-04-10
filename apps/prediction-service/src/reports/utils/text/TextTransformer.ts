import {
  IntermediateFunction,
  TextTransformation,
  Transformations,
} from "./types";
import {
  bigram,
  lancasterStem,
  lowercase,
  porterStem, removeNumbers,
  removePunctuation,
  removeSmallWords,
  removeStopWords,
  transformNumberToWords,
} from "./transformations";
import { lemmatize } from "./lemmatization/lemmatize";

export class TextTransformer {
  public static async pipe(
    data: string[],
    transformations: TextTransformation[],
    intermediateFunc?: IntermediateFunction<string[]>
  ): Promise<string[]> {
    let result = data;

    for (const [index, transformation] of transformations.entries()) {
      result = await textTransformations[transformation](result);
      intermediateFunc?.(index, result, transformation);
    }

    return result;
  }
}

const textTransformations: Transformations<string[]> = {
  [TextTransformation.RemoveStopWords]: removeStopWords,
  [TextTransformation.RemoveSmallWords]: removeSmallWords,
  [TextTransformation.NumbersToWords]: transformNumberToWords,
  [TextTransformation.RemoveNumbers]: removeNumbers,
  [TextTransformation.RemovePunctuation]: removePunctuation,
  [TextTransformation.ToLowercase]: lowercase,
  [TextTransformation.Lemmatize]: lemmatize,
  [TextTransformation.LancasterStem]: lancasterStem,
  [TextTransformation.PorterStem]: porterStem,
  [TextTransformation.Bigram]: bigram,
};
