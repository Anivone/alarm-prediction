import fs from "fs";
import { CHUNK_SIZE } from "./constants";
import { rabbitChannelPromise } from "../../rabbitmq/config";
import { DATASET_QUEUE } from "../../rabbitmq/constants";
import { getStats } from "./utils";

export const readFileStreamed = async (path: string) => {
  const channel = await rabbitChannelPromise;
  const fileStats = await getStats(path);
  const totalChunks = Math.ceil(fileStats.size / CHUNK_SIZE);

  let currentChunk = 0;

  const readStream = fs.createReadStream(path, { highWaterMark: CHUNK_SIZE });
  await channel.assertQueue(DATASET_QUEUE);

  readStream.on("data", async (chunk) => {
    currentChunk++;
    console.log(`Processing chunk ${currentChunk}`);

    channel.sendToQueue(DATASET_QUEUE, Buffer.from(chunk), {
      headers: { currentChunk, totalChunks },
    });
  });

  readStream.on("end", () => {
    console.log(`All chunks of file (${path}) have been sent`);
  });

  readStream.on("error", (err) => {
    throw err;
  })
};
