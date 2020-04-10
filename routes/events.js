const express = require('express');
const router = express.Router();
const query = require('../query')

router.post('/', async function (req, res, next) {
  const document = await query.add(req.body.datetime, req.body.duration);
  if (document) {
    res.sendStatus(200);
  }
  else {
    res.sendStatus(422);
  }
});

router.get('/', async function (req, res, next) {
  const { startDate, endDate } = req.query
  const startTime = Date.parse(startDate + ' 12:00 AM')
  const endTime = Date.parse(endDate + ' 11:59 PM')
  const events = await query.list(startTime, endTime);
  res.status(200).send(query.getLocalTimezoneEvents(events));
});

router.get('/free-slots', async function (req, res, next) {
  const { date } = req.query
  const startTime = Date.parse(date + ' 12:00 AM')
  const endTime = Date.parse(date + ' 11:59 PM')
  const slots = await query.slots(startTime, endTime);
  res.status(200).send(slots);
});

module.exports = router;
