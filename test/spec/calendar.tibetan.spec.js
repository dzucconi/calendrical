/* global cal data4 describe expect it: true */

'use strict';

describe ('Tibetan calendar spec', function () {
  var date, expected, actual;

  it ('should convert a Tibetan date to Julian day', function () {
    data4.forEach (function (data) {
      date     = data.tibetan;
      expected = data.rataDie + cal.constants.J0000;
      actual   = cal.tibetanToJd (date.year, date.month, date.monthLeap, date.day, date.dayLeap);
      expect (expected).to.be.equal (actual);
    });
  });

  it ('should convert a Julian day to a Tibetan date', function () {
    data4.forEach (function (data) {
      date     = data.tibetan;
      expected = [ date.year, date.month, date.monthLeap, date.day, date.dayLeap ];
      actual   = cal.jdToTibetan (data.rataDie + cal.constants.J0000);

      expect (expected).to.be.eql (actual);
    });
  });

  it ('should establish whether a Tibetan month is leap', function () {
    data4.forEach (function (data) {
      date     = data.tibetan;
      expected = date.monthLeap;
      actual   = cal.tibetanMonthLeap (date.year, date.month);

      expect (expected).to.be.equal (actual);
    });
  });
});
