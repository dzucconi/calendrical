/* global Calendrical data4 describe it expect:true*/
/* eslint no-undef: "error"*/

'use strict';

describe ("Hindu Lunar Modern calendar spec", function () {
  var cal, date, expected, actual;

  cal = Calendrical.calendar;

  it ("should convert a Hindu Lunar Modern date to Julian day", function () {
    data4.forEach (function (data) {
        date     = data.hinduLunarNew;
        expected = data.rataDie + cal.constants.J0000;
        actual   = cal.hinduLunarToJd (date.year, date.month, date.leapMonth, date.day, date.leapDay);
        expect (expected).toEqual (actual);
    });
  });

  it ("should convert a Julian day to a Hindu Lunar Modern date", function () {
    data4.forEach (function (data) {
        date     = data.hinduLunarNew;
        expected = [ date.year, date.month, date.leapMonth, date.day, date.leapDay ];
        actual   = cal.jdToHinduLunar (data.rataDie + cal.constants.J0000);

        expect (expected).toEqual (actual);
    });
  });
});
