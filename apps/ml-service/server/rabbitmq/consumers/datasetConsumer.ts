import fs, { WriteStream } from "fs";
import { DATASET_QUEUE } from "../constants";
import { rabbitChannelPromise } from "../config";
import { getDataFilePath } from "../../utils";

export const datasetConsumer = async () => {
  const channel = await rabbitChannelPromise;

  let writeStream: WriteStream | null = null;
  await channel.assertQueue(DATASET_QUEUE);

  await channel.consume(DATASET_QUEUE, (msg) => {
    if (!msg) return;
    const { currentChunk, totalChunks } = msg.properties.headers;

    if (currentChunk === 1) {
      const filepath = getDataFilePath("test.csv");

      writeStream = fs.createWriteStream(filepath);
      writeStream.on("error", (err) => {
        throw err;
      });

      writeStream.on("finish", () => {
        console.log("File has successfully been written");
        writeStream = null;
      });
    }

    const chunk = msg.content.toString("utf-8");

    if (currentChunk === totalChunks) {
      writeStream?.end(chunk);
    } else {
      writeStream?.write(chunk);
    }

    channel.ack(msg);
  });
}