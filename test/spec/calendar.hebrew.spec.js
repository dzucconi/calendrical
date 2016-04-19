/* global Calendrical data3 describe it expect:true*/
/* eslint no-undef: "error"*/

'use strict';

describe ("Hebrew calendar spec", function () {
  var cal, date, expected, actual;

  cal = Calendrical.calendar;

  it ("should convert a Hebrew date to Julian day", function () {
    data3.forEach (function (data) {
        date = data.hebrew;
        expected = data.rataDie + cal.constants.J0000;
        actual = cal.hebrewToJd (date.year, date.month, date.day);

        expect (expected).toEqual (actual);
    });
  });

  it ("should convert a Julian day to a Hebrew date", function () {
    data3.forEach (function (data) {
        date = data.hebrew;
        expected = [ date.year, date.month, date.day ];
        actual = cal.jdToHebrew (data.rataDie + cal.constants.J0000);

        expect (expected).toEqual (actual);
    });
  });

  it ("should determine whether a Hebrew year is leap year", function () {
      [ 5700, 5703, 5706, 5708, 5711, 5714, 5717 ].forEach (function (year) {
          expect (cal.hebrewLeap (year)).toBe (true);
      });

      [ 5699, 5701, 5702, 5704, 5705, 5709, 5710 ].forEach (function (year) {
          expect (cal.hebrewLeap (year)).toBe (false);
      });
  });
});
