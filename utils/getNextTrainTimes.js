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

/*
 * Get a feed ID used for the API request based off of a Train ID.
 *
 * getFeedIDFromTrain('3') => '1'
 * where the list is from https://datamine.mta.info/list-of-feeds.
 */
const getFeedIDFromTrain = (trainId) => {
  switch(trainId) {
    case "1": case "2": case "3": case "4": case "5": case "6": case "S":
      return "1";
    case "A": case "C": case "E":
      return "26";
    case "N": case "Q": case "R": case "W":
      return "16";
    case "B": case "D": case "F": case "M":
      return "21";
    case "L":
      return "2";
    case "G":
      return "31";
    case "J": case "Z":
      return "36";
    case "7":
      return "51";
    default:
      return "9001";
  }
}

module.exports = {
  compare,
  getFeedIDFromTrain,
  getNextTrainTimes,
}
