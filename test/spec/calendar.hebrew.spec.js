/* global Calendrical data3 describe it expect:true*/
/* eslint no-undef: "error"*/

'use strict';

describe ("Hebrew calendar spec", function () {
  var cal, date, jdExpected, jdActual, dateExpected, dateActual;

  cal = Calendrical.calendar;

  it ("should convert a Hebrew date to Julian day", function () {
    data3.forEach (function (data) {
        date = data.hebrew;
        jdExpected = data.rataDie + cal.constants.J0000;
        jdActual = cal.hebrewToJd (date.year, date.month, date.day);

        expect (jdExpected).toEqual (jdActual);
    });
  });

  it ("should convert a Julian day to a Hebrew date", function () {
    data3.forEach (function (data) {
        date = data.hebrew;
        dateExpected = [ date.year, date.month, date.day ];
        dateActual = cal.jdToHebrew (data.rataDie + cal.constants.J0000);

        expect (dateExpected).toEqual (dateActual);
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
