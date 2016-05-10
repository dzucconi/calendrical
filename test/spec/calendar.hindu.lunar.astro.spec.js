/* global cal data4 describe expect it: true */

'use strict';

describe ('Hindu Lunar Astro calendar spec', function () {
  var date, expected, actual;

  it ('should convert a Hindu Lunar Astro date to Julian day', function () {
    data4.forEach (function (data) {
      date     = data.hinduLunarAstro;
      expected = data.rataDie + cal.constants.J0000;
      actual   = cal.hinduLunarAstroToJd (date.year, date.month, date.monthLeap, date.day, date.dayLeap);
      expect (expected).to.be.equal (actual);
    });
  });

  it ('should convert a Julian day to a Hindu Lunar Astro date', function () {
    data4.forEach (function (data) {
      date     = data.hinduLunarAstro;
      expected = [ date.year, date.month, date.monthLeap, date.day, date.dayLeap ];
      actual   = cal.jdToHinduLunarAstro (data.rataDie + cal.constants.J0000);
      expect (expected).to.be.eql (actual);
    });
  });
});
