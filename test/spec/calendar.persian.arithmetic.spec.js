/* global Calendrical data3 describe it expect:true*/

'use strict';

describe ('Persian arithmetic calendar spec', function () {
  var cal, date, expected, actual;

  cal = Calendrical.calendar;

  it ('should convert a Persian arithmetic date to Julian day', function () {
    data3.forEach (function (data) {
      date     = data.persianArith;
      expected = data.rataDie + cal.constants.J0000;
        // expected = data.rataDie;
      actual   = cal.persianArithmeticToJd (date.year, date.month, date.day);
      expect (expected).toEqual (actual);
    });
  });

  it ('should convert a Julian day to a Persian arithmetic year', function () {
    data3.forEach (function (data) {
      date     = data.persianArith;
      expected = date.year;
      actual   = cal.jdToPersianArithmeticYear (data.rataDie + cal.constants.J0000);
      expect (expected).toEqual (actual);
    });
  });

  it ('should convert a Julian day to a Persian arithmetic date', function () {
    data3.forEach (function (data) {
      date     = data.persianArith;
      expected = [ date.year, date.month, date.day ];
      actual   = cal.jdToPersianArithmetic (data.rataDie + cal.constants.J0000);
      expect (expected).toEqual (actual);
    });
  });

  it ('should determine whether a Persian arithmetic year is leap year', function () {
    [ 4, 124, 165, 206, 739, 780, 821, 1313, 1354, 1395 ].forEach (function (year) {
      expect (cal.leapPersianArithmetic (year)).toBe (true);
    });

    [ 1, 48, 142, 189, 236, 283, 377, 424, 471, 518, 612, 659, 753, 800, 847,
        894, 988, 1035, 1082, 1129, 1223, 1270, 1364 ].forEach (function (year) {
          expect (cal.leapPersianArithmetic (year)).toBe (false);
        });
  });
});
