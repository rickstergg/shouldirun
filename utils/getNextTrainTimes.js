const request = require('request');
const protobuf = require("protobufjs");

// TODO, create a feedId mapping for different routes.
const requestSettings = {
  method: 'GET',
  url: 'http://datamine.mta.info/mta_esi.php?key=e26f09accebd90636922e54bf4de06cf&feed_id=1',
  encoding: null
};

/*
 * Print out the next predicted arrival times of the next train for a certain stop.
 *
 * getNextTrainTimes('124', '1', '3', res)
 * where 'res' is the express response
 */
const getNextTrainTimes = (stopId, routeId, direction, res) => {
// Load the mta.proto and gtfs-realtime.proto into protobuf
  protobuf.load("./data/proto/mta.proto", function(err, root) {
    if (err) {
      throw err;
    }

    request(requestSettings, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const message = root.lookupType("transit_realtime.FeedMessage").decode(body);
        const upcomingArrivals = [];
        message.entity.forEach((entity) => {
          if (entity.vehicle && entity.vehicle.trip.routeId === routeId) {
            // Vehicle Position
          } else if(entity.tripUpdate && entity.tripUpdate.trip.routeId == routeId && entity.tripUpdate.trip['.nyctTripDescriptor'].direction == direction) {
            // Trip Update
            entity.tripUpdate.stopTimeUpdate.forEach((stop) => {
              if (stop.stopId == stopId.toString() + (direction === '1' ? 'N' : 'S')) {
                const today = new Date();
                const minutesUntilArrival = Math.round((stop.arrival.time.low - (today.getTime() / 1000)) / 60);
                upcomingArrivals.push(minutesUntilArrival);
              }
            });
          }
        });

        res.send(upcomingArrivals.join(', '));
      }
    });
  });
}

module.exports = {
  getNextTrainTimes,
}
