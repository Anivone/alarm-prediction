import isw from "../reports.json";
import { DocumentManager } from "./utils/DocumentManager";
import { Tf_Idf } from "./utils/Tf_Idf";

// @ts-ignore
// const record: { date: string; content: string } = isw[2];
// @ts-ignore
// const record2: { date: string; content: string } = isw[3];

const records: { date: string; content: string }[] = isw.slice(1, isw.length - 1);

const tfIdf = new Tf_Idf();

const tfIdfs = async () => {
  // const documents: DocumentManager[] = [];

  const documents: DocumentManager[] = await Promise.all(
    records.map(async (record) => {
      const doc = new DocumentManager(record);
      await doc.parseContent();
      return doc;
    })
  );

  const result = tfIdf.prepareMeasurements(documents);
  console.log(result);
};

tfIdfs().then();
