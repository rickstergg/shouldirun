/*
 * Compare to elements in an array for sorting.
 *
 * compare(a, b);
 */
const compare = (a, b) => (a - b);

/*
 * Print out the next predicted arrival times of the next train for a certain stop.
 *
 * getNextTrainTimes({ message }, '124', '1', '3')
 * where 'message' is the feed message from the MTA API.
 */
const getNextTrainTimes = (feedMessage, stopId, routeId, direction) => {
  let upcomingArrivals = [];
  feedMessage.entity.forEach((entity) => {
    if(entity.tripUpdate) {
      const tripRouteId = entity.tripUpdate.trip.routeId;
      const tripDirection = entity.tripUpdate.trip['.nyctTripDescriptor'].direction;
      const stopTimeUpdates = entity.tripUpdate.stopTimeUpdate;

      if (tripRouteId == routeId && (tripDirection == direction)) {
        stopTimeUpdates.forEach((stop) => {
          if (stop.stopId == stopId + (direction == '1' ? 'N' : 'S')) {
            const today = Date.now();
            if (stop.arrival) {
              const minutesUntilArrival = Math.round((stop.arrival.time.low - (today / 1000)) / 60);
              upcomingArrivals.push(minutesUntilArrival);
            }
          }
        });
      }
    }
  });

  upcomingArrivals = upcomingArrivals.filter((number) => number > -1);
  return upcomingArrivals.sort(compare);
}

module.exports = {
  compare,
  getNextTrainTimes,
}
