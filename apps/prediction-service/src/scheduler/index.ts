import { scheduleIswScrapper } from "./scheduleIswScrapper";
import { scheduleTfIdf } from "./scheduleTfIdf";

const initializeScheduler = () => {
  scheduleIswScrapper();
  scheduleTfIdf();
};

export default initializeScheduler;
