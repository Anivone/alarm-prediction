import { scheduleIswScrapper } from "./scheduleIswScrapper";
import { scheduleUpdate } from "./scheduleUpdate";

const initializeScheduler = () => {
  scheduleIswScrapper();
  scheduleUpdate();
};

export default initializeScheduler;
