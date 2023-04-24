import { getWeatherUniqueDates } from "../utils/getWeatherUniqueDates";
import { getCurrentIsw } from "../utils/getCurrentIsw";
import { writeCsvFileStreamed } from "../../streams/writeFileStreamed";
import { toCsvString } from "../../../api/utils";

export const writeCurrentIsw = async () => {
  const weatherUniqueDates = await getWeatherUniqueDates();
  const iswReports = await getCurrentIsw(weatherUniqueDates);

  const columns = toCsvString(Object.keys(iswReports[0]));
  const rows = iswReports.map((iswReport) =>
    toCsvString(Object.values(iswReport))
  );

  await writeCsvFileStreamed(rows, columns, "new_isw.csv");
};
