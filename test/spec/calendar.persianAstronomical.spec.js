/* global Calendrical data3 describe it expect:true*/
/* eslint no-undef: "error"*/

'use strict';

describe ("Persian astronomical calendar spec", function () {
  var cal, date, expected, actual;

  cal = Calendrical.calendar;

  it ("should convert a Persian astronomical date to Julian day", function () {
    data3.forEach (function (data) {
        date     = data.persianAstro;
        expected = data.rataDie + cal.constants.J0000;
        actual   = cal.persianaToJd (date.year, date.month, date.day);

        expect (expected).toEqual (actual);
    });
  });

  it ("should convert a Julian day to a Persian astronomical date", function () {
    data3.forEach (function (data) {
        date     = data.persianAstro;
        expected = [ date.year, date.month, date.day ];
        actual   = cal.jdToPersian (data.rataDie + cal.constants.J0000);

        expect (expected).toEqual (actual);
    });
  });

  it ("should determine whether a Persian astronomical year is leap year", function () {
      [ 2 ].forEach (function (year) {
          expect (cal.leapPersiana (year)).toBe (true);
      });

      [ 1 ].forEach (function (year) {
          expect (cal.leapPersiana (year)).toBe (false);
      });
  });
});
