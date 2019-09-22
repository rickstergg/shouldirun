const express = require('express');
const pug = require('pug');
const app = express();
const request = require('request');
const protobuf = require('protobufjs');
const stops = require('./data/stops.json');
const routes = require('./data/routes.json');
const { getNextTrainTimes } = require('./utils/getNextTrainTimes');

app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));

// TODO, create a feedId mapping for different routes.
const requestSettings = {
  method: 'GET',
  url: 'http://datamine.mta.info/mta_esi.php?key=e26f09accebd90636922e54bf4de06cf&feed_id=1',
  encoding: null
};

app.post('/', function (req, res) {
  const { stopId, routeId, direction } = req.body;

  // Load the mta.proto and gtfs-realtime.proto into protobuf
  protobuf.load("./data/proto/mta.proto", function(err, root) {
    if (err) {
      throw err;
    }

    request(requestSettings, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const message = root.lookupType("transit_realtime.FeedMessage").decode(body);
        const upcomingArrivals = getNextTrainTimes(message, stopId.toString(), routeId.toString(), direction.toString());
        upcomingArrivals.length ? res.send(upcomingArrivals.join(', ')) : res.send('There are currently no trains going to this stop.');
      }
    });
  });
});

app.get('/', function (req, res) {
  res.render('index', { stops, routes });
});

app.listen(process.env.PORT || 5000);


