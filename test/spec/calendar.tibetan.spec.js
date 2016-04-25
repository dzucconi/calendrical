/* global Calendrical data4 describe it expect:true*/
/* eslint no-undef: "error"*/

'use strict';

describe ("Tibetan calendar spec", function () {
  var cal, date, expected, actual;

  cal = Calendrical.calendar;

  it ("should convert a Tibetan date to Julian day", function () {
    data4.forEach (function (data) {
        date     = data.tibetan;
        expected = data.rataDie + cal.constants.J0000;
        actual   = cal.tibetanToJd ([ date.year, date.month, date.leapMonth, date.day, date.leapDay ]);
        expect (expected).toEqual (actual);
    });
  });

  it ("should convert a Julian day to a Tibetan date", function () {
    data4.forEach (function (data) {
        date     = data.tibetan;
        expected = [ date.year, date.month, date.leapMonth, date.day, date.leapDay ];
        actual   = cal.jdToTibetan (data.rataDie + cal.constants.J0000);

        expect (expected).toEqual (actual);
    });
  });

  it ("should establish whether a Tibetan month is leap", function () {
      data4.forEach (function (data) {
          date     = data.tibetan;
          expected = date.leapMonth;
          actual   = cal.tibetanMonthLeap (date.year, date.month);

          expect (expected).toEqual (actual);
      });
  });
});
