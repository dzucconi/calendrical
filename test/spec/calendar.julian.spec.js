/* global cal data1 describe expect it: true */

'use strict';

describe ('Julian calendar spec', function () {
  var date, expected, actual;

  it ('should convert a Julian date to Julian day', function () {
    data1.forEach (function (data) {
      date = data.julianDate;
      expected = data.julianDay;
      actual = cal.julianToJd (date.year, date.month, date.day);

      expect (expected).to.be.equal (actual);
    });
  });

  it ('should convert a Julian day to a Julian date', function () {
    data1.forEach (function (data) {
      date = data.julianDate;
      expected = [ date.year, date.month, date.day ];
      actual = cal.jdToJulian (data.julianDay);

      expect (expected).to.be.eql (actual);
    });
  });

  it ('should determine whether a Julian year is leap year', function () {
    [ 4, 20, 1600, 1700, 1760, 1800, 1840, 1904, 1980, 2000 ].forEach (function (year) {
      expect (cal.leapJulian (year)).to.be.true ();
    });

    [ 1, 2, 3, 5, 1599, 1970, 2001 ].forEach (function (year) {
      expect (cal.leapJulian (year)).to.be.false ();
    });
  });
});
