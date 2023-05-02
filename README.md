# Alarm Prediction

## Description

Application is designed to make predictions about air alarms in Ukraine based on historical and recent data.
It uses [Open-Meteo API](https://open-meteo.com/), [Ukraine Alarm API](https://api.ukrainealarm.com/) and 
[Institute for the Study of War](https://www.understandingwar.org/) for fetching necessary recent and real-time data.
Application consists of 2 services: Prediction and ML service.

<img width="300" alt="image" src="https://user-images.githubusercontent.com/43621483/235786875-8f93c21c-6290-46a0-9738-6d2de0114079.png">

* Prediction service has the main and the only open to the world server which sends responses to clients' requests. In addition, it is 
responsible for fetching, processing and sending necessary data to ML service through message queue (RabbitMQ).

* ML service is responsible for training models, making predictions, and sending them as responses to Prediction service's requests.
It also has an HTTP server to establish communication with Prediction service.

Predictions get updated every hour: Prediction service fetches and processes new data, makes a new merged dataset and sends it
by chunks through message queue to ML service, which in turn receives the file, initiates a process of updating predictions for all of the regions
for the next 12 hours and saves the results in a file.

Application also serves UI which looks like this:

<img width="1439" alt="image" src="https://user-images.githubusercontent.com/43621483/235787982-11a378d7-b43d-4e0b-abf9-7423079a06ef.png">

Users can select predictions for specific region or for the all of them. Additionaly, it is possible to initiate an update for predictions
manually (this button was made for testing purposes and will be removed in production).

## Environment
Application requires such environment:

| Language   | Version       |
|:----------:|:-------------:|
| Node.js    | 16.X.X        |
| Python     | 3.X.X         |

## Running an Application

Steps to run an application:

1. Install [Rush.js](https://rushjs.io/):
```npm
npm install -g @microsoft/rush
```
2. Install Node.js dependencies:
```npm
rush update
```
3. Install Python dependecies:
```pip
cd apps/ml-service && pip install -r requirements.txt
cd apps/prediction-service && pip install -r requirements.txt
```
4. Run services (select the `start` options for 3 of them):
```terminal
rush start
```
Example:

<img width="800" alt="image" src="https://user-images.githubusercontent.com/43621483/235783174-293aa2cc-f63e-4a1a-a730-d2c4f0d09ea1.png">

