/* global cal data3 describe expect it: true */

'use strict';

describe ('Hebrew calendar spec', function () {
  var date, expected, actual;

  it ('should convert a Hebrew date to Julian day', function () {
    data3.forEach (function (data) {
      date = data.hebrew;
      expected = data.rataDie + cal.constants.J0000;
      actual = cal.hebrewToJd (date.year, date.month, date.day);

      expect (expected).to.be.equal (actual);
    });
  });

  it ('should convert a Julian day to a Hebrew date', function () {
    data3.forEach (function (data) {
      date = data.hebrew;
      expected = [ date.year, date.month, date.day ];
      actual = cal.jdToHebrew (data.rataDie + cal.constants.J0000);

      expect (expected).to.be.eql (actual);
    });
  });

  it ('should determine whether a Hebrew year is leap year', function () {
    [ 5700, 5703, 5706, 5708, 5711, 5714, 5717 ].forEach (function (year) {
      expect (cal.hebrewLeap (year)).to.be.true ();
    });

    [ 5699, 5701, 5702, 5704, 5705, 5709, 5710 ].forEach (function (year) {
      expect (cal.hebrewLeap (year)).to.be.false ();
    });
  });
});
