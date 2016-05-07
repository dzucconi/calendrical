/* global Calendrical data3 describe it expect:true*/

'use strict';

describe ("Persian astronomical calendar spec", function () {
  var cal, date, expected, actual;

  cal = Calendrical.calendar;

  it ("should convert a Persian astronomical date to Julian day", function () {
    data3.forEach (function (data) {
        date     = data.persianAstro;
        expected = data.rataDie + cal.constants.J0000;
        actual   = cal.persianToJd (date.year, date.month, date.day);
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
      [ 38, 75, 112, 149, 186, 223, 260, 1111, 1148, 1185, 1222, 1259, 1296, 1333, 1370 ].forEach (function (year) {
          expect (cal.leapPersian (year)).toBe (true);
      });

      [ 165, 206, 247, 288, 329, 370, 411, 452, 493, 534, 575, 616, 821, 862,
        903, 944, 985, 1026, 1067, 1108, 1149, 1190, 1231, 1272 ].forEach (function (year) {
          expect (cal.leapPersian (year)).toBe (false);
      });
  });
});
