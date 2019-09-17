const { getNextTrainTimes } = require('./getNextTrainTimes');
const data = require('../test/data/standardResp');

global.Date.now = jest.fn(() => 1568685805992);

describe('getNextTrainTimes', () => {
  it('gets the next train times properly', () => {
    const times = [3, 9, 15, 24, 34, 44, 54, 64];
    expect(getNextTrainTimes(data, '124', '1', '3')).toEqual(times);
  });
});
