import { MergedDatasetRecord } from "./types";

const KEY_DELIMITER = "|";

export const parseRawRecord = (rawRecord: string[]): MergedDatasetRecord => {
  const [
    city_resolvedAddress,
    day_datetime,
    day_datetimeEpoch,
    day_tempmax,
    day_tempmin,
    day_temp,
    day_dew,
    day_humidity,
    day_precip,
    day_precipcover,
    day_solarradiation,
    day_solarenergy,
    day_uvindex,
    day_sunrise,
    day_sunset,
    day_moonphase,
    hour_datetime,
    hour_datetimeEpoch,
    hour_temp,
    hour_humidity,
    hour_dew,
    hour_precip,
    hour_precipprob,
    hour_snow,
    hour_snowdepth,
    hour_preciptype,
    hour_windgust,
    hour_windspeed,
    hour_winddir,
    hour_pressure,
    hour_visibility,
    hour_cloudcover,
    hour_solarradiation,
    hour_solarenergy,
    hour_uvindex,
    hour_severerisk,
    hour_conditions,
    city,
    region,
    center_city_ua,
    center_city_en,
    region_alt,
    region_id,
    event_region_title,
    event_region_city,
    event_all_region,
    event_start,
    event_end,
    event_clean_end,
    event_intersection_alarm_id,
    event_start_time,
    event_end_time,
    event_start_hour,
    event_end_hour,
    event_day_date,
    event_start_hour_datetimeEpoch,
    event_end_hour_datetimeEpoch,
    event_hour_level_event_time,
    event_hour_level_event_datetimeEpoch,
    date,
    keywords,
    report_date,
    date_tomorrow_datetime,
  ] = rawRecord;

  return {
    city_resolvedAddress,
    day_datetime,
    day_datetimeEpoch,
    day_tempmax,
    day_tempmin,
    day_temp,
    day_dew,
    day_humidity,
    day_precip,
    day_precipcover,
    day_solarradiation,
    day_solarenergy,
    day_uvindex,
    day_sunrise,
    day_sunset,
    day_moonphase,
    hour_datetime,
    hour_datetimeEpoch,
    hour_temp,
    hour_humidity,
    hour_dew,
    hour_precip,
    hour_precipprob,
    hour_snow,
    hour_snowdepth,
    hour_preciptype,
    hour_windgust,
    hour_windspeed,
    hour_winddir,
    hour_pressure,
    hour_visibility,
    hour_cloudcover,
    hour_solarradiation,
    hour_solarenergy,
    hour_uvindex,
    hour_severerisk,
    hour_conditions,
    city,
    region,
    center_city_ua,
    center_city_en,
    region_alt,
    region_id,
    event_region_title,
    event_region_city,
    event_all_region,
    event_start,
    event_end,
    event_clean_end,
    event_intersection_alarm_id,
    event_start_time,
    event_end_time,
    event_start_hour,
    event_end_hour,
    event_day_date,
    event_start_hour_datetimeEpoch,
    event_end_hour_datetimeEpoch,
    event_hour_level_event_time,
    event_hour_level_event_datetimeEpoch,
    date,
    keywords,
    report_date,
    date_tomorrow_datetime,
  };
};
