const request = require('request');
const protobuf = require("protobufjs");
const express = require('express');
const path = require('path');
const readline = require('readline');
const fs = require('fs');
const pug = require('pug');
const app = express();
const stops = require('./data/stops.json');
const routes = require('./data/routes.json');

app.set('view engine', 'pug');

const requestSettings = {
  method: 'GET',
  url: 'http://datamine.mta.info/mta_esi.php?key=e26f09accebd90636922e54bf4de06cf&feed_id=1',
  encoding: null
};

app.post('/', function (req, res) {
  protobuf.load("mta.proto", function(err, root) {
    // Load the mta.proto and gtfs-realtime.proto into protobuf
    if (err)
      throw err;

    // Get the buffer from MTA.
    request(requestSettings, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const FeedMessage = root.lookupType("transit_realtime.FeedMessage");
        const message = FeedMessage.decode(body);
        const timings = [];
        message.entity.forEach((entity) => {
          if (entity.vehicle && entity.vehicle.trip.routeId === '1') {
            // Vehicle Position
          } else if(entity.tripUpdate && entity.tripUpdate.trip.routeId === '1' && entity.tripUpdate.trip['.nyctTripDescriptor'].direction === 3) {
            // Trip Update
            // Find the relevant stop, 124S
            entity.tripUpdate.stopTimeUpdate.forEach((stop) => {
              if (stop.stopId === '124S') {
                const d = new Date();
                const posix = d.getTime() / 1000;
                const difference = stop.arrival.time.low - posix;
                const minutes = Math.round(difference / 60);
                console.log(minutes);
                timings.push(minutes);
              }
            });
          }
        });

        res.send(timings.join(', '));
      }
    });
  });
});

app.get('/', function (req, res) {
  res.render('index', { stops, routes });
});

app.listen(process.env.PORT || 5000);


