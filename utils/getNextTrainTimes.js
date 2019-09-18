// Need to know what the direction enumerations really mean.
const directionMapping = {
  1: 'NORTH',
  3: 'SOUTH',
}

/*
 * Print out the next predicted arrival times of the next train for a certain stop.
 *
 * getNextTrainTimes('124', '1', '3', res)
 * where 'res' is the express response
 */
const getNextTrainTimes = (feedMessage, stopId, routeId, direction) => {
  const upcomingArrivals = [];
  feedMessage.entity.forEach((entity) => {
    if(entity.tripUpdate) {
      const tripRouteId = entity.tripUpdate.trip.routeId;
      const tripDirection = entity.tripUpdate.trip['.nyctTripDescriptor'].direction;
      const stopTimeUpdates = entity.tripUpdate.stopTimeUpdate;

      if (tripRouteId == routeId && ((tripDirection == direction) || (tripDirection == directionMapping[direction]))) {
        stopTimeUpdates.forEach((stop) => {
          if (stop.stopId == stopId + (direction == '1' ? 'N' : 'S')) {
            const today = Date.now();
            const minutesUntilArrival = Math.round((stop.arrival.time.low - (today / 1000)) / 60);
            upcomingArrivals.push(minutesUntilArrival);
          }
        });
      }
    }
  });
  return upcomingArrivals;
}

module.exports = {
  getNextTrainTimes,
}
