// const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const request = require('request');
const protobuf = require("protobufjs");
const express = require('express');
const path = require('path');
const readline = require('readline');
const fs = require('fs');
const app = express();

const requestSettings = {
  method: 'GET',
  url: 'http://datamine.mta.info/mta_esi.php?key=e26f09accebd90636922e54bf4de06cf&feed_id=1',
  encoding: null
};

const getStopsHash = (path) => {
  let hash = {};

  const readInterface = readline.createInterface({
    input: fs.createReadStream(path),
  });

  let index = 0;
  readInterface.on('line', function(line) {
    // Skip headers, process every direction-less stop.
    if (index !== 0 && index % 3 === 1) {
      const commaDelimited = line.split(',');
      // Stop Name => Stop ID
      hash[`${commaDelimited[2]}`] = commaDelimited[0];
      console.log(hash);
    }
    index++;
  });

  return hash;
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
  // Build the stops hash using stops.txt in data.
  const stops = getStopsHash('data/stops.txt');
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(process.env.PORT || 5000);


