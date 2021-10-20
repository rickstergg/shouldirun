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
 * Get a feed URL used for the API request based off of a Train number / letter.
 *
 * getFeedUrlFromTrain('A') => 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace'
 * where the list is from https://api.mta.info/#/subwayRealTimeFeeds.
 */
const getFeedUrlFromTrain = (trainId) => {
  const baseUrl = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs';
  switch(trainId) {
    case '1': case '2': case '3': case '4': case '5': case '6': case '7':
      return baseUrl;
    case 'A': case 'C': case 'E':
      return baseUrl + '-ace';
    case 'N': case 'Q': case 'R': case 'W':
      return baseUrl + '-nqrw';
    case 'B': case 'D': case 'F': case 'M':
      return baseUrl + '-bdfm';
    case 'L':
      return baseUrl + '-l';
    case 'G':
      return baseUrl + '-g';
    case 'J': case 'Z':
      return baseUrl + '-jz';
    default:
      return '9001';
  }
}

module.exports = {
  compare,
  getFeedUrlFromTrain,
  getNextTrainTimes,
}
