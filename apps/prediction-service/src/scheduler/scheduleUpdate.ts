import { RecurrenceRule, scheduleJob } from "node-schedule";
import { evaluateTfIdf } from "../data-manager/reports";
import { saveNewData } from "../server/predictions/data-handler/saveNewData";
import { updatePredictions } from "../server/predictions/updatePredictions";

export const scheduleUpdate = () => {
  const rule = new RecurrenceRule(
    "*",
    "*",
    "*",
    "*",
    "*",
    "0",
    "0",
    "Europe/Kyiv"
  );
  console.log("TfIdf scheduled");
  scheduleJob(rule, async () => {
    console.log("TfIdf executed");

    await updatePredictions();
  });
};
