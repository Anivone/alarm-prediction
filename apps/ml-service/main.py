import pandas as pd
import pickle
import sys

try:
    def preprocess():
        df = pd.read_csv(
            "data/merged_dataset.csv", sep=";", float_precision="round_trip", low_memory=False
        )

        base_columns = [
            "city",
            "day_datetime",
            "hour_datetime",
            "hour_datetimeEpoch",
            "hour_temp",
            "hour_precip",
            "hour_windspeed",
            "hour_winddir",
            "hour_cloudcover",
            "hour_conditions",
            "event_start_hour",
        ]
        vector_columns = list(df.columns)[36:137]
        trailing_columns = ['is_future']
        total_columns = base_columns + vector_columns + trailing_columns

        procDF = df[
            total_columns
        ]

        # removing duplicate rows
        procDF = procDF.drop_duplicates(subset=["city", "day_datetime", "hour_datetime"])

        # Feature 2:
        groupedByHrs = procDF.groupby("city").rolling(window=24)["event_start_hour"].count()
        procDF["events_last_24h"] = groupedByHrs.reset_index(0, drop=True)
        procDF.loc[procDF["events_last_24h"].isnull(), "events_last_24h"] = 0
        procDF["events_last_24h"] = procDF["events_last_24h"].astype("int")

        # mapping string columns to respective index values
        procDF['city_label'] = procDF['city']
        procDF['city'] = procDF['city'].astype('category')
        procDF['city'] = procDF['city'].cat.reorder_categories(procDF['city'].unique(), ordered=True)
        procDF['city'] = procDF['city'].cat.codes

        procDF['day_datetime'] = procDF['day_datetime'].astype('category')
        procDF['day_datetime'] = procDF['day_datetime'].cat.reorder_categories(procDF['day_datetime'].unique(), ordered=True)
        procDF['day_datetime'] = procDF['day_datetime'].cat.codes

        procDF['hour_datetime_label'] = procDF['hour_datetime']
        procDF['hour_datetime'] = procDF['hour_datetime'].astype('category')
        procDF['hour_datetime'] = procDF['hour_datetime'].cat.reorder_categories(procDF['hour_datetime'].unique(), ordered=True)
        procDF['hour_datetime'] = procDF['hour_datetime'].cat.codes

        procDF['hour_conditions'] = procDF['hour_conditions'].astype('category')
        procDF['hour_conditions'] = procDF['hour_conditions'].cat.reorder_categories(procDF['hour_conditions'].unique(), ordered=True)
        procDF['hour_conditions'] = procDF['hour_conditions'].cat.codes

        # fixing empty values
        procDF.loc[procDF["hour_precip"].isnull(), "hour_precip"] = 0

        # boolean column indicating whether there is an alarm right now (shorthand for checking event_start_hour)
        procDF.insert(len(procDF.columns), "is_alarm", False)
        procDF.loc[procDF["event_start_hour"].notnull(), "is_alarm"] = True

        # dropping unnecessary columns
        procDF = procDF.drop(columns=['event_start_hour'])
        procDF = procDF.drop(columns=['isw_date'])
        procDF = procDF.drop(columns=['hour_datetimeEpoch'])

        # saving to file
        procDF.to_csv("data/data_pred.csv", index=False)

    def predict():
        # loading the pretrained model
        with open('./models/random-forest.pkl', 'rb') as file:
            model = pickle.load(file)

        # loading and preprocessing the source data
        df = pd.read_csv("./data/data_pred.csv", sep=",")

        future_rows = df.loc[df['is_future'] == True]
        future_rows = future_rows.drop(columns=['is_future'])

        def predict_alarm(row): 
            params = row.drop(['is_alarm', 'city_label', 'hour_datetime_label', 'is_alarm'])
            params = params.values.reshape(1, -1)
            pred_res = model.predict(params)[0]
            if (pred_res == True):
                future_rows.loc[future_rows['city'] == row['city'], 'events_last_24h'] += 1; 
            return pred_res

        future_rows['is_alarm'] = future_rows.apply(predict_alarm, axis=1)

        future_rows.to_csv("data/data_result.csv", index=False, columns=['city_label', 'hour_datetime_label', 'is_alarm', 'events_last_24h'])

    preprocess()
    predict()

    print("exit")
    sys.stdout.write("exit")
    sys.stdout.flush()

except Exception as e:
    sys.stderr.write(str(e))
    sys.stderr.flush()