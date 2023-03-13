import isw from "../reports.json";
import { SLICE_LENGTH } from "./constants";
import { extractFullDate, getRelevantContent } from "./utils";
import { WordTokenizer } from "natural";
import {
  pipe,
  removePunctuation,
  removeSmallWords,
  removeStopWords,
  transformNumberToWords,
} from "./textFiltering";
import { executePythonLemmatization } from "./py-communication";

const record = isw[2];

let processedRecord = JSON.parse(JSON.stringify(record));

const authorsDateContent = record.content.slice(0, SLICE_LENGTH);
const splitNewLines = authorsDateContent.split("\n");

const extractedFullDate = extractFullDate(splitNewLines);

const relevantContent = getRelevantContent(record.content, extractedFullDate);

const tokenizer = new WordTokenizer();
const tokens = tokenizer.tokenize(relevantContent);
processedRecord.contentToken = tokens
console.log("tokens length:", tokens.length);

pipe(
  tokens,
  transformNumberToWords,
  removePunctuation,
  removeStopWords,
  removeSmallWords,
  executePythonLemmatization
).then((pipedResult) => {
  console.log("piped result:", pipedResult);
  console.log("piped length:", pipedResult.length);
});
