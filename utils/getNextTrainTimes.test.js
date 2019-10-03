const { compare, getFeedIDFromTrain, getNextTrainTimes } = require('./getNextTrainTimes');
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

describe('getFeedIDFromTrain', () => {
  it('returns the feed ID as a string', () => {
    expect(typeof getFeedIDFromTrain('1')).toBe('string');
  });

  it('returns the right feed ID for 1, 2, 3, 4, 5, 6, S trains', () => {
    expect(getFeedIDFromTrain('1')).toEqual('1');
    expect(getFeedIDFromTrain('2')).toEqual('1');
    expect(getFeedIDFromTrain('3')).toEqual('1');
    expect(getFeedIDFromTrain('4')).toEqual('1');
    expect(getFeedIDFromTrain('5')).toEqual('1');
    expect(getFeedIDFromTrain('6')).toEqual('1');
    expect(getFeedIDFromTrain('S')).toEqual('1');
  });

  it('returns the right feed ID for A, C, E trains', () => {
    expect(getFeedIDFromTrain('A')).toEqual('26');
    expect(getFeedIDFromTrain('C')).toEqual('26');
    expect(getFeedIDFromTrain('E')).toEqual('26');
  });

  it('returns the right feed ID for N, Q, R, W trains', () => {
    expect(getFeedIDFromTrain('N')).toEqual('16');
    expect(getFeedIDFromTrain('Q')).toEqual('16');
    expect(getFeedIDFromTrain('R')).toEqual('16');
    expect(getFeedIDFromTrain('W')).toEqual('16');
  });

  it('returns the right feed ID for B, D, F, M trains', () => {
    expect(getFeedIDFromTrain('B')).toEqual('21');
    expect(getFeedIDFromTrain('D')).toEqual('21');
    expect(getFeedIDFromTrain('F')).toEqual('21');
    expect(getFeedIDFromTrain('M')).toEqual('21');
  });

  it('returns the right feed ID for L trains', () => {
    expect(getFeedIDFromTrain('L')).toEqual('2');
  });

  it('returns the right feed ID for G trains', () => {
    expect(getFeedIDFromTrain('G')).toEqual('31');
  });

  it('returns the right feed ID for J, Z trains', () => {
    expect(getFeedIDFromTrain('J')).toEqual('36');
    expect(getFeedIDFromTrain('Z')).toEqual('36');
  });

  it('returns the right feed ID for 7 trains', () => {
    expect(getFeedIDFromTrain('7')).toEqual('51');
  });

  it('returns over 9000, (there is no way that could be right) if train ID is invalid', () => {
    expect(getFeedIDFromTrain('GG')).toEqual('9001');
  });
});
