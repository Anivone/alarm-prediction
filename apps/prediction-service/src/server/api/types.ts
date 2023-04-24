export interface ApiAlarm {
  regionId: string;
  startDate: string;
  endDate: string;
  duration: {
    ticks: number;
    days: number;
    hours: number;
    milliseconds: number;
    minutes: number;
    seconds: number;
    totalDays: number;
    totalHours: number;
    totalMilliseconds: number;
    totalMinutes: number;
    totalSeconds: number;
  };
  alertType: string;
  regionName: string;
  isContinue: boolean;
}

export interface Alarm {
  id: number,
  region_id: string,
  region_title: string,
  region_city: string,
  all_region: number,
  start: string,
  end: string,
  clean_end: string,
  intersection_alarm_id: "NULL",
}

export interface RegionHistoryData {
  regionId: string;
  regionName: string;
  alarms: ApiAlarm[];
}