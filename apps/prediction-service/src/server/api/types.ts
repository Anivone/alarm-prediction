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
  regionId: string,
  regionTitle: string,
  regionCity: string,
  all_region: number,
  start: string,
  end: string,
  clean_end: string,
  intersection_alarm_id: undefined,
}

export interface RegionHistoryData {
  regionId: string;
  regionName: string;
  alarms: ApiAlarm[];
}