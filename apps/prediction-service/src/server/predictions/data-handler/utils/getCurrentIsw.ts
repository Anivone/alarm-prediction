import { csvToJson } from "./csvToJson";
import path from "path";

export const getCurrentIsw = async (dates: string[]) => {
  const iswDataFilePath = path.join(
    process.cwd(),
    "data",
    "all_days_isw_reports_parsed.csv"
  );
  const iswData = await csvToJson(iswDataFilePath);
  return iswData.filter((isw) =>
    filterIswJsonRecord(isw, dates)
  );
};

const filterIswJsonRecord = (isw: Record<string, string>, dates: string[]) => {
  const datesWithoutTime = dates.map((date) => date.split("T")[0]);
  return datesWithoutTime.includes(isw.isw_date);
};
