/* global Calendrical data1 describe it expect:true*/
/* eslint no-undef: "error"*/

'use strict';

describe ("Julian calendar spec", function () {
  var cal, date, jdExpected, jdActual, dateExpected, dateActual;

  cal = Calendrical.calendar;

  it ("should convert a Julian date to Julian day", function () {
    data1.forEach (function (data) {
        date = data.julianDate;
        jdExpected = data.julianDay;
        jdActual = cal.julianToJd (date.year, date.month, date.day);

        expect (jdExpected).toEqual (jdActual);
    });
  });

  it ("should convert a Julian day to a Julian date", function () {
    data1.forEach (function (data) {
        date = data.julianDate;
        dateExpected = [ date.year, date.month, date.day ];
        dateActual = cal.jdToJulian (data.julianDay);

        expect (dateExpected).toEqual (dateActual);
    });
  });

  it ("should determine whether a Julian year is leap year", function () {
      [ 4, 20, 1600, 1700, 1760, 1800, 1840, 1904, 1980, 2000 ].forEach (function (year) {
          expect (cal.leapJulian (year)).toBe (true);
      });

      [ 1, 2, 3, 5, 1599, 1970, 2001 ].forEach (function (year) {
          expect (cal.leapJulian (year)).toBe (false);
      });
  });
});
