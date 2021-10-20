const { compare, getFeedUrlFromTrain, getNextTrainTimes } = require('./getNextTrainTimes');
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

describe('compare', () => {
  it('compares two numbers properly', () => {
    expect(compare(10, 1)).toEqual(9);
  });
});

describe('getFeedUrlFromTrain', () => {
  const baseUrl = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs';

  it('returns the feed ID as a string', () => {
    expect(typeof getFeedUrlFromTrain('1')).toBe('string');
  });

  it('returns the right feed ID for 1, 2, 3, 4, 5, 6, S trains', () => {
    expect(getFeedUrlFromTrain('1')).toEqual(baseUrl);
    expect(getFeedUrlFromTrain('2')).toEqual(baseUrl);
    expect(getFeedUrlFromTrain('3')).toEqual(baseUrl);
    expect(getFeedUrlFromTrain('4')).toEqual(baseUrl);
    expect(getFeedUrlFromTrain('5')).toEqual(baseUrl);
    expect(getFeedUrlFromTrain('6')).toEqual(baseUrl);
    expect(getFeedUrlFromTrain('7')).toEqual(baseUrl);
  });

  it('returns the right feed ID for A, C, E trains', () => {
    expect(getFeedUrlFromTrain('A')).toEqual(baseUrl + 'ace');
    expect(getFeedUrlFromTrain('C')).toEqual(baseUrl + 'ace');
    expect(getFeedUrlFromTrain('E')).toEqual(baseUrl + 'ace');
  });

  it('returns the right feed ID for N, Q, R, W trains', () => {
    expect(getFeedUrlFromTrain('N')).toEqual(baseUrl + '-nqrw');
    expect(getFeedUrlFromTrain('Q')).toEqual(baseUrl + '-nqrw');
    expect(getFeedUrlFromTrain('R')).toEqual(baseUrl + '-nqrw');
    expect(getFeedUrlFromTrain('W')).toEqual(baseUrl + '-nqrw');
  });

  it('returns the right feed ID for B, D, F, M trains', () => {
    expect(getFeedUrlFromTrain('B')).toEqual(baseUrl + '-bdfm');
    expect(getFeedUrlFromTrain('D')).toEqual(baseUrl + '-bdfm');
    expect(getFeedUrlFromTrain('F')).toEqual(baseUrl + '-bdfm');
    expect(getFeedUrlFromTrain('M')).toEqual(baseUrl + '-bdfm');
  });

  it('returns the right feed ID for L trains', () => {
    expect(getFeedUrlFromTrain('L')).toEqual(baseUrl + '-l');
  });

  it('returns the right feed ID for G trains', () => {
    expect(getFeedUrlFromTrain('G')).toEqual(baseUrl + '-g');
  });

  it('returns the right feed ID for J, Z trains', () => {
    expect(getFeedUrlFromTrain('J')).toEqual(baseUrl + '-jz');
    expect(getFeedUrlFromTrain('Z')).toEqual(baseUrl + '-jz');
  });

  it('returns over 9000, (there is no way that could be right) if train ID is invalid', () => {
    expect(getFeedUrlFromTrain('GG')).toEqual('9001');
  });
});
