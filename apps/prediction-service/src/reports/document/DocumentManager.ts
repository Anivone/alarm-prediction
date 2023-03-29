import { IswReport } from "../../types";
import { DateManager, TextTransformer } from "../utils";
import { extractRelevantContent, parseDate } from "./utils";
import { WordTokenizer } from "natural";
import { IntermediateFunction, TextTransformation } from "../utils/text/types";

export type Document = {
  date: IswReport["date"];
  content: IswReport["content"];
  relevantContent?: string;
  preprocessed_final?: string[];
  tfIdf?: Map<string, number>;
};

export class DocumentManager {
  public document: Document;
  private readonly tokenizer: WordTokenizer;

  constructor(iswReport: IswReport) {
    this.document = iswReport;
    this.document.tfIdf = new Map();
    this.tokenizer = new WordTokenizer();

    this.prepareContent();
  }

  private prepareContent() {
    const extractedContentDate = DateManager.extractDateFromReport(
      this.document
    );
    this.document.date = parseDate(extractedContentDate) ?? this.document.date;
    this.document.relevantContent = extractRelevantContent(
      extractedContentDate,
      this.document.content
    );
  }

  public async processDocument(
    transformations: TextTransformation[]
  ): Promise<DocumentManager> {
    const self = this;
    const data = this.document.relevantContent ?? this.document.content;
    const contentTokens = this.tokenizer.tokenize(data);

    await TextTransformer.pipe(
      contentTokens,
      transformations,
      (index, data, transformation) => {
        const isLastTransformation = index === transformations.length - 1;
        const propertyName = isLastTransformation
          ? "preprocessed_final"
          : `preprocessed_v${index + 1}-${transformation}`;

        (self.document as any)[propertyName] = data;
      }
    );

    return this;
  }
}
