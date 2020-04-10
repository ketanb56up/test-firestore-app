const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();
const DURATION = 30

const add = async (timestamp, duration) => {
  const startTime = Date.parse(timestamp)
  const endTime = startTime + duration * 60000
  let collectionRef = firestore.collection('events');

  const events = await list(startTime, endTime)
  if (events.length > 0) {
    return false
  }

  return collectionRef.add({ startTime, endTime }).then(documentReference => {
    return documentReference
  });
}

const list = async (startTime, endTime) => {
  const events = [];
  let collectionRef = firestore.collection('events');
  return collectionRef.where('startTime', '>=', startTime).where('startTime', '<=', endTime).get().then(querySnapshot => {
    if (!querySnapshot.empty) {
      querySnapshot.forEach(documentSnapshot => {
        events.push(documentSnapshot.data())
      });
      return events;
    }
    else {
      return [];
    }
  });
}

const getLocalTimezoneEvents = events => {
  return events.map(e => ({ startTime: getLocalString(e.startTime), endTime: getLocalString(e.endTime) }));
}

const slots = async (startTime, endTime) => {
  const events = [];
  let collectionRef = firestore.collection('events');
  const arr = []
  for (let dt = startTime; dt < endTime; dt = dt + (DURATION * 60000)) {
    arr.push(dt)
  }

  const existingEvents = await collectionRef.where('startTime', '>=', startTime).where('startTime', '<', endTime).get().then(querySnapshot => {
    if (!querySnapshot.empty) {
      querySnapshot.forEach(documentSnapshot => {
        events.push(documentSnapshot.data())
      });
      return events
    }
    else {
      return [];
    }
  });

  const bookedEvents = [].concat.apply([], existingEvents.map(existEvent => {
    const temp = []
    for (let dt = existEvent.startTime; dt < existEvent.endTime; dt = dt + (DURATION * 60000)) {
      temp.push(dt)
    }
    return temp
  }));


  const freeSlots = arr.filter(el => {
    return bookedEvents.indexOf(el) < 0;
  });

  return freeSlots.map(e => {
    return new Date(e).toLocaleString()
  })
}

const getLocalString = time => {
  return new Date(time).toLocaleString()
}

module.exports = {
  add,
  list,
  slots,
  getLocalTimezoneEvents
}