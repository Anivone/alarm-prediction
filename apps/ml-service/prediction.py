import pickle
import pandas as pd
import sys

try :

# loading the pretrained model
    with open('./models/random-forest.pkl', 'rb') as file:
        model = pickle.load(file)

    # loading and preprocessing the source data
    df = pd.read_csv("./data/data_pred.csv", sep=";")

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

    print("exit")

except Exception as e:
    sys.stderr.write(str(e))
    sys.stderr.flush()