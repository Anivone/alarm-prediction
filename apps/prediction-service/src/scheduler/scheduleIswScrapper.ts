import { RecurrenceRule, scheduleJob } from "node-schedule";
import { scrapIswReports } from "../data-manager/reports/utils";

export const scheduleIswScrapper = () => {
  const rule = new RecurrenceRule(
    "*",
    "*",
    "*",
    "*",
    "21",
    "0",
    "0",
    "Europe/Kyiv"
  );

  console.log("IswScrapper scheduled");
  scheduleJob(rule, async () => {
    console.log("IswScrapper executed");

    await scrapIswReports();
  });
};
