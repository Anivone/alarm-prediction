import { REGIONS_IDS } from "../../../constants/constants";
import { writeAlarms } from "../../../api/utils";
import { getAlarms } from "../../../api/getAlarms";

export const writeCurrentAlarms = async (regionName: string) => {
  if (regionName === "all") {
    const regionNames = Object.keys(REGIONS_IDS);
    const alarmsList = await Promise.all(regionNames.map(getAlarms));
    writeAlarms(alarmsList.flat());
  } else {
    const alarms = await getAlarms(regionName);
    writeAlarms(alarms);
  }
}