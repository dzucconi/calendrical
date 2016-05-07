/* global Calendrical data4 describe it expect:true*/

'use strict';

describe ("Hindu Lunar Astro calendar spec", function () {
  var cal, date, expected, actual;

  cal = Calendrical.calendar;

  it ("should convert a Hindu Lunar Astro date to Julian day", function () {
    data4.forEach (function (data) {
        date     = data.hinduLunarAstro;
        expected = data.rataDie + cal.constants.J0000;
        actual   = cal.hinduLunarAstroToJd (date.year, date.month, date.monthLeap, date.day, date.dayLeap);
        expect (expected).toEqual (actual);
    });
  });

  it ("should convert a Julian day to a Hindu Lunar Astro date", function () {
    data4.forEach (function (data) {
        date     = data.hinduLunarAstro;
        expected = [ date.year, date.month, date.monthLeap, date.day, date.dayLeap ];
        actual   = cal.jdToHinduLunarAstro (data.rataDie + cal.constants.J0000);
        expect (expected).toEqual (actual);
    });
  });
});
