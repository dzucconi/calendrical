/* global Calendrical data1 describe it expect:true*/
/* eslint no-undef: "error"*/

'use strict';

describe ("Gregorian calendar spec", function () {
  var cal, date, jdExpected, jdActual, dateExpected, dateActual;

  cal = Calendrical.calendar;

  it ("should convert a Gregorian date to Julian day", function () {
    data1.forEach (function (data) {
        date = data.gregorian;
        jdExpected = data.julianDay;
        jdActual = cal.gregorianToJd (date.year, date.month, date.day);

        expect (jdExpected).toEqual (jdActual);
    });
  });

  it ("should convert a Julian day to a Gregorian date", function () {
    data1.forEach (function (data) {
        date = data.gregorian;
        dateExpected = [ date.year, date.month, date.day ];
        dateActual = cal.jdToGregorian (data.julianDay);

        expect (dateExpected).toEqual (dateActual);
    });
  });

  it ("should determine whether a Gregorian year is leap year", function () {
      [ 0, 4, 20, 1600, 1760, 1840, 1904, 1980, 2000 ].forEach (function (year) {
          expect (cal.leapGregorian (year)).toBe (true);
      });

      [ 1, 2, 3, 5, 1599, 1700, 1800, 1900, 1970, 2001 ].forEach (function (year) {
          expect (cal.leapGregorian (year)).toBe (false);
      });
  });
});
