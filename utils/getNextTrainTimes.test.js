const { getNextTrainTimes } = require('./getNextTrainTimes');
const data = require('../test/data/standardResp');

describe('getNextTrainTimes', () => {
  it('gets the next train times properly', () => {
    global.Date.now = jest.fn(() => 1568685805992);

    const times = [3, 9, 15, 24, 34, 44, 54, 64];
    expect(getNextTrainTimes(data, '124', '1', '3')).toEqual(times);
  });

  it('should ignore negative number values', () => {
    // 3 and some minutes latehre
    global.Date.now = jest.fn(() => 1568686105992);

    const times = [4, 10, 19, 29, 39, 49, 59];
    expect(getNextTrainTimes(data, '124', '1', '3')).toEqual(times);
  });
});
