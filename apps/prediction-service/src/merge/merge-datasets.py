import datetime
import os

import pytz
from pytz import timezone

import numpy as np
import pandas as pd

import pickle

MERGE_DIRECTORY = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(MERGE_DIRECTORY, "../../"))
# This is your Project Root

pd.set_option('display.max_columns', None)
pd.set_option('display.max_rows', None)

# INPUT_DATA_FOLDER = "data/2_isw_preprocessed"
INPUT_DATA_FOLDER = ROOT_DIR
REPORTS_DATA_FILE = "all_days_isw_reports_parsed.csv"

OUTPUT_FOLDER = ROOT_DIR
ISW_OUTPUT_DATA_FILE = "all_isw.csv"
WEATHER_EVENTS_OUTPUT_DATA_FILE = "all_hourly_weather_events.csv"

MODEL_FOLDER = "model"

tfidf_transformer_model = "tfidf_transformer"
count_vectorizer_model = "count_vectorizer"

tfidf_transformer_version = "v1"
count_vectorizer_version = "v1"


def isNaN(num):
    return num != num

def getTimestamp(ts: pd.Timestamp):
    return int(ts.timestamp() * 1000)


df_isw = pd.read_csv(f"{INPUT_DATA_FOLDER}/{REPORTS_DATA_FILE}", sep=";")

df_isw["date_datetime"] = pd.to_datetime(df_isw["date"])
df_isw['date_tomorrow_datetime'] = df_isw['date_datetime'].apply(lambda x: x + datetime.timedelta(days=1))

df_isw = df_isw.rename(columns={"date_datetime": "report_date"})
df_isw.to_csv(f"{ROOT_DIR}/{ISW_OUTPUT_DATA_FILE}", sep=";", index=False)

print("all_isw")

EVENTS_DATA_FOLDER = ROOT_DIR
EVENTS_DATA_FILE = "alarms.csv"

df_events = pd.read_csv(f"{EVENTS_DATA_FOLDER}/{EVENTS_DATA_FILE}", sep=";")

df_events_v2 = df_events.drop(['id', 'region_id'], axis=1)

df_events_v2["start_time"] = pd.to_datetime(df_events_v2["start"])
df_events_v2["end_time"] = pd.to_datetime(df_events_v2["end"])

df_events_v2["start_hour"] = df_events_v2['start_time'].dt.floor('H')
df_events_v2["end_hour"] = df_events_v2['end_time'].dt.ceil('H')

df_events_v2["start_hour"] = df_events_v2.apply(
    lambda x: x["start_hour"], axis=1)
df_events_v2["end_hour"] = df_events_v2.apply(lambda x: x["end_hour"],
                                              axis=1)

df_events_v2["day_date"] = df_events_v2["start_time"].dt.date

# timezone
df_events_v2["start_hour_datetimeEpoch"] = df_events_v2['start_hour'].apply(
    lambda x: getTimestamp(x) if not isNaN(x) else None)
df_events_v2["end_hour_datetimeEpoch"] = df_events_v2['end_hour'].apply(
    lambda x: getTimestamp(x) if not isNaN(x) else None)

WEATHER_DATA_FOLDER = ROOT_DIR
WEATHER_DATA_FILE = "all_weather_by_hour_v2.csv"


df_weather = pd.read_csv(f"{WEATHER_DATA_FOLDER}/{WEATHER_DATA_FILE}", sep=",")
df_weather["day_datetime"] = pd.to_datetime(df_weather["day_datetime"])


print("df_weather read")


# exclude
weather_exclude = [
"day_feelslikemax",
"day_feelslikemin",
"day_sunriseEpoch",
"day_sunsetEpoch",
"day_description",
"city_latitude",
"city_longitude",
"city_address",
"city_timezone",
"city_tzoffset",
"day_feelslike",
"day_precipprob",
"day_snow",
"day_snowdepth",
"day_windgust",
"day_windspeed",
"day_winddir",
"day_pressure",
"day_cloudcover",
"day_visibility",
"day_severerisk",
"day_conditions",
"day_icon",
"day_source",
"day_preciptype",
"day_stations",
"hour_icon",
"hour_source",
"hour_stations",
"hour_feelslike"
]

df_weather_v2 = df_weather.drop(weather_exclude, axis=1)

df_weather_v2["city"] = df_weather_v2["city_resolvedAddress"].apply(lambda x: x.split(",")[0])
df_weather_v2["city"] = df_weather_v2["city"].replace('Хмельницька область', "Хмельницький")

df_regions = pd.read_csv(f"{ROOT_DIR}/regions.csv")

print("regions read")


df_weather_reg = pd.merge(df_weather_v2, df_regions, left_on="city",right_on="center_city_ua")

events_dict = df_events_v2.to_dict('records')
events_by_hour = []

print(events_dict[0])


for event in events_dict:
    for d in pd.date_range(start=event["start_hour"], end=event["end_hour"], freq='1H'):
        et = event.copy()
        et["hour_level_event_time"] = d
        et["day_date"] = pd.Timestamp(datetime.datetime.combine(et["day_date"], datetime.time.min))
        events_by_hour.append(et)

df_events_v3 = pd.DataFrame.from_dict(events_by_hour)

df_events_v3["hour_level_event_datetimeEpoch"] = df_events_v3["hour_level_event_time"]\
    .apply(lambda x: getTimestamp(x) if not isNaN(x) else None)

df_events_v4 = df_events_v3.copy().add_prefix('event_')

df_weather_v4 = df_weather_reg.merge(df_events_v4,
                                     how="left",
                                     left_on=["region_alt","hour_datetimeEpoch"],
                                     right_on=["event_region_title","event_hour_level_event_datetimeEpoch"])


print("1 merge")

df_weather_v4.to_csv(f"{OUTPUT_FOLDER}/{WEATHER_EVENTS_OUTPUT_DATA_FILE}", sep=";", index=False)

print(df_weather_v4.shape)

df_weather_isw = df_weather_v4.merge(df_isw,
                                     how="left",
                                     left_on=["event_day_date"],
                                     right_on=["date_tomorrow_datetime"])

print(df_weather_isw.shape)


df_weather_isw.to_csv(f"{OUTPUT_FOLDER}/merged_dataset.csv", sep=";", index=False)


print("end")