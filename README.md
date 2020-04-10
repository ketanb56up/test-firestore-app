
RUN
export GOOGLE_APPLICATION_CREDENTIALS=./google-firestore.json

APIS:-

GET http://localhost:5000/events?startDate=2020-04-09&&endDate=2020-04-10 

POST http://localhost:5000/events

{
    "datetime": "2020-04-10 05:00 PM",
    "duration": 30
}

GET http://localhost:5000/events/free-slots?date=2020-04-10