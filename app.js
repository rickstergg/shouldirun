// var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var request = require('request');
var protobuf = require("protobufjs");

var requestSettings = {
  method: 'GET',
  url: 'http://datamine.mta.info/mta_esi.php?key=e26f09accebd90636922e54bf4de06cf&feed_id=1',
  encoding: null
};

protobuf.load("mta.proto", function(err, root) {
  // Load the mta.proto and gtfs-realtime.proto into protobuf
  if (err)
    throw err;

  // Get the buffer from MTA.
  request(requestSettings, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var FeedMessage = root.lookupType("transit_realtime.FeedMessage");
      var message = FeedMessage.decode(body);
      message.entity.forEach((entity) => {
        if (entity.vehicle && entity.vehicle.trip.routeId === '1') {
          // Vehicle Position
          // console.log(entity.vehicle.trip['.nyctTripDescriptor']);
        } else if(entity.tripUpdate && entity.tripUpdate.trip.routeId === '1' && entity.tripUpdate.trip['.nyctTripDescriptor'].direction === 3) {
          // Trip Update
          // Find the relevant stop, 124S
          entity.tripUpdate.stopTimeUpdate.forEach((stop) => {
            if (stop.stopId === '124S') {
              var d = new Date();
              var posix = d.getTime() / 1000;
              var difference = stop.arrival.time.low - posix;
              console.log(Math.round(difference / 60));
            }
          });
        }
      });
    }
  });
});
