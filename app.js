const express = require('express');
const pug = require('pug');
const app = express();
const stops = require('./data/stops.json');
const routes = require('./data/routes.json');
const { getNextTrainTimes } = require('./utils/getNextTrainTimes');

app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));

app.post('/', function (req, res) {
  const { stopId, routeId, direction } = req.body;
  getNextTrainTimes(stopId.toString(), routeId.toString(), direction.toString(), res);
});

app.get('/', function (req, res) {
  res.render('index', { stops, routes });
});

app.listen(process.env.PORT || 5000);


