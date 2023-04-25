import { writeCurrentAlarms } from "./write/writeCurrentAlarms";
import { writeCurrentWeather } from "./write/writeCurrentWeather";
import { writeCurrentIsw } from "./write/writeCurrentIsw";

export const saveNewData = async (regionName: string) => {
  writeCurrentAlarms(regionName).then(() => {
    writeCurrentWeather(regionName).then(async () => {
      await writeCurrentIsw();
    });
  });
};
