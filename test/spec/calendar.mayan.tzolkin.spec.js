/* global cal data2 describe expect it: true */

'use strict';

describe ('Mayan Tzolkin calendar spec', function () {
  var date, julian, expected, actual;

  it ('should convert a Julian day to a Mayan Tzolkin', function () {
    data2.forEach (function (data) {
      julian   = data.rataDie + cal.constants.J0000;
      date     = data.mayanTzolkin;
      expected = [ date.day, date.month ];
      actual   = cal.jdToMayanTzolkin (julian);

      expect (expected).to.be.eql (actual);
    });
  });
});
