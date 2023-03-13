import { DateManipulator } from "./date/DateManipulator";
import { MONTHS } from "./date/constants";
import { TextTransformations, TextTransformer } from "./text/TextTransformer";
import { WordTokenizer } from "natural";

type Report = {
  date: string;
  content: string;
};

export class DocumentManager {
  private readonly STARTING_SLICE_LENGTH = 300;
  public resultDocumentObject: any = {};
  private readonly textTransformer: TextTransformer;
  private readonly tokenizer: WordTokenizer;

  constructor(report: Report) {
    this.resultDocumentObject.date = report.date;
    this.resultDocumentObject.content = report.content;
    this.textTransformer = new TextTransformer();
    this.tokenizer = new WordTokenizer();

    this.prepareContent();
  }

  private prepareContent() {
    const { content } = this.resultDocumentObject;
    const startingContentSlice: string = content.slice(
      0,
      this.STARTING_SLICE_LENGTH
    );
    const splitSlice = startingContentSlice.split("\n");

    const extractedContentDate = DateManipulator.extractFullDate(splitSlice);

    this.resultDocumentObject.contentDate =
      this.getContentDate(extractedContentDate);
    this.resultDocumentObject.relevantContent =
      this.getRelevantContent(extractedContentDate);
  }

  public print() {
    console.log(this.resultDocumentObject);
  }

  private getRelevantContent(extractedContentDate: string) {
    const documentContent = this.resultDocumentObject.content;
    const contentDateIndex = documentContent.indexOf(extractedContentDate);

    const relevantContentStartIndex =
      contentDateIndex + extractedContentDate.length;

    return documentContent.slice(relevantContentStartIndex);
  }

  private getContentDate(extractedContentDate: string): string {
    const documentDate = this.resultDocumentObject.date;
    const contentDate = DateManipulator.extractDate(extractedContentDate);
    const [month, dayOfMonth] = contentDate.split(" ");
    const date = new Date(documentDate);
    date.setMonth(MONTHS.indexOf(month));
    date.setDate(Number(dayOfMonth));

    return date.toISOString();
  }

  public async parseContent() {
    const self = this;
    const tokens = this.tokenizer.tokenize(
      this.resultDocumentObject.relevantContent
    );
    const transformations = [
      TextTransformations.ToLowercase,
      TextTransformations.NumbersToWords,
      TextTransformations.RemovePunctuation,
      TextTransformations.RemoveStopWords,
      TextTransformations.RemoveSmallWords,
      TextTransformations.Lemmatize,
      TextTransformations.Bigram,
    ];

    return await this.textTransformer.pipe(
      tokens,
      transformations,
      (index, data, transformation) => {
        const isLastTransformation = index === transformations.length - 1;

        self.resultDocumentObject[
          `relevantContent_v${index + 1}-${transformation}`
        ] = data;

        if (isLastTransformation) {
          self.resultDocumentObject[`relevantContent_final`] = data;
        }
      }
    );
  }
}
