/* global cal data1 describe expect it: true */

'use strict';

describe ('Gregorian calendar spec', function () {
  var date, expected, actual;


  it ('should convert a Gregorian date to Julian day', function () {
    data1.forEach (function (data) {
      date = data.gregorian;
      expected = data.julianDay;
      actual = cal.gregorianToJd (date.year, date.month, date.day);

      expect (expected).to.be.equal (actual);
    });
  });

  it ('should convert a Julian day to a Gregorian date', function () {
    data1.forEach (function (data) {
      date = data.gregorian;
      expected = [ date.year, date.month, date.day ];
      actual = cal.jdToGregorian (data.julianDay);

      expect (expected).to.be.eql (actual);
    });
  });

  it ('should determine whether a Gregorian year is leap year', function () {
    [ 0, 4, 20, 1600, 1760, 1840, 1904, 1980, 2000 ].forEach (function (year) {
      expect (cal.leapGregorian (year)).to.be.true ();
    });

    [ 1, 2, 3, 5, 1599, 1700, 1800, 1900, 1970, 2001 ].forEach (function (year) {
      expect (cal.leapGregorian (year)).to.be.false ();
    });
  });
});
