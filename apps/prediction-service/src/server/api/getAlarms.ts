import moment from "moment";
import axios from "axios";
import {
  REGIONS_ALTS,
  REGIONS_API_IDS,
  REGIONS_ENG_UA,
  REGIONS_IDS,
} from "../../constants/constants";
import {
  ALERTS_API_ENDPOINT,
  getAxiosAlertsConfig,
} from "../../constants/alarms";
import { Alarm, ApiAlarm, RegionHistoryData } from "./types";

export const getAlarms = async (regionName: string) => {
  if (!Object.keys(REGIONS_API_IDS).includes(regionName)) {
    throw new Error("Invalid region name");
  }

  const apiRegionId = REGIONS_API_IDS[regionName];
  const response = await axios.request(
    getAxiosAlertsConfig(
      ALERTS_API_ENDPOINT.RegionHistory,
      {
        regionId: apiRegionId,
      },
      (data) => {
        const jsonData = JSON.parse(data);
        const regionHistory: RegionHistoryData = jsonData[0];
        const alarms = regionHistory.alarms;
        return alarms.map((alarm) => parseRegionAlarm(alarm, regionName));
      }
    )
  );

  const alarms: Alarm[] = response.data;

  const lastAlarms = alarms.filter(({ start }) => {
    const startDate = moment(start);
    startDate.minute(0);
    startDate.second(0);
    const currentDate = moment();
    currentDate.minute(0);
    currentDate.second(0);

    const yesterdayMoment = moment(currentDate).subtract(2, "day");

    return startDate >= yesterdayMoment;
  });

  return lastAlarms;
};

const parseRegionAlarm = (alarm: ApiAlarm, regionName: string): Alarm => {
  const id = REGIONS_IDS[regionName];
  const regionId = alarm.regionId;
  const regionTitle = REGIONS_ALTS[regionName];
  const regionCity = REGIONS_ENG_UA[regionName];
  const all_region = 0;
  const start = alarm.startDate;
  const end = alarm.endDate;
  const clean_end = end;
  const intersection_alarm_id = undefined;

  return {
    id,
    regionId,
    regionTitle,
    regionCity,
    all_region,
    start,
    end,
    clean_end,
    intersection_alarm_id,
  };
};
