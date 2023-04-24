import { csvToJson } from "./csvToJson";
import terms from "../../../../../data/terms.json";
import path from "path";
import { toCsvDateTime } from "../../../api/utils";

export const getCurrentIsw = async (dates: string[]) => {
  const iswDataFilePath = path.join(
    process.cwd(),
    "data",
    "all_days_isw_reports_parsed.csv"
  );
  const iswData = await csvToJson(iswDataFilePath);
  const currentIsw = iswData.filter((isw) =>
    filterIswJsonRecord(isw, dates)
  );

  if (currentIsw.length === 0) return createDefaultIsw(dates);

  return currentIsw;
};

const filterIswJsonRecord = (isw: Record<string, string>, dates: string[]) => {
  const datesWithoutTime = dates.map((date) => date.split("T")[0]);
  return datesWithoutTime.includes(isw.isw_date);
};

const createDefaultIsw = (dates: string[]) => {
  const defaultTfIdf = {} as Record<string, string>;
  terms.forEach((term) => {
    defaultTfIdf[term] = "0"
  });

  return dates.map((date) => ({
    isw_date: toCsvDateTime(date),
    ...defaultTfIdf
  }))
}