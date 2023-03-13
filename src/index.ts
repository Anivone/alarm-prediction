import isw from "../reports.json";
import { DocumentManager } from "./utils/DocumentManager";
import { Tf_Idf } from "./utils/Tf_Idf";

// @ts-ignore
const record: { date: string; content: string } = isw[2];
// @ts-ignore
const record2: { date: string; content: string } = isw[3];

let processedRecord = JSON.parse(JSON.stringify(record));

const tfIdf = new Tf_Idf();

const tfIdfs = async () => {
  const doc1 = new DocumentManager(record);
  const doc2 = new DocumentManager(record2);

  await doc1.parseContent();
  await doc2.parseContent();

  const result = tfIdf.prepareMeasurements([doc1, doc2]);
  console.log(result);
};

tfIdfs().then();

// const transformer = new TextTransformer();
// transformer.pipe(
//   tokens,
//   TextTransformations.NumbersToWords,
//   TextTransformations.RemovePunctuation,
//   TextTransformations.RemoveStopWords,
//   TextTransformations.RemoveSmallWords,
//   TextTransformations.Lemmatize
// ).then((transformerResult) => {
//   console.log("transformer result:", transformerResult);
//   console.log("transformer length:", transformerResult.length);
// });
