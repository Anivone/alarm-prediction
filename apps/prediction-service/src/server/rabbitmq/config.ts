import { Channel, connect } from "amqplib";
import { DATASET_QUEUE } from "./constants";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const initializeRabbitMQ = async (): Promise<Channel> => {
  const connection = await connect(
    process.env.RABBITMQ_URL ||
      `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`
  );
  console.log("Connected to RabbitMQ!");

  const channel = await connection.createChannel();

  await channel.assertQueue(DATASET_QUEUE);

  return channel;
};

export const rabbitChannelPromise: Promise<Channel> = initializeRabbitMQ();
