export type PipeFunction<T> = (inputData: T) => Promise<T> | T;
export type IntermediateFunction<T> = (
  index: number,
  result: T,
  transformation: TextTransformation
) => void;

export enum TextTransformation {
  RemoveStopWords = "noStopWords",
  RemoveSmallWords = "noSmallWords",
  NumbersToWords = "numbersToWords",
  RemovePunctuation = "noPunctuation",
  ToLowercase = "lowercase",
  Lemmatize = "lemmatize",
  LancasterStem = "lancasterStem",
  PorterStem = "porterStem",
  Bigram = "bigram",
}

export type Transformations<T> = { [key in TextTransformation]: PipeFunction<T> };