/*
 * Print out the next predicted arrival times of the next train for a certain stop.
 *
 * getNextTrainTimes('124', '1', '3', res)
 * where 'res' is the express response
 */
const getNextTrainTimes = (feedMessage, stopId, routeId, direction) => {
  const upcomingArrivals = [];
  feedMessage.entity.forEach((entity) => {
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

  return upcomingArrivals;
}

module.exports = {
  getNextTrainTimes,
}
