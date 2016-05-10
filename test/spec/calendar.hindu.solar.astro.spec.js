/* global cal data4 describe expect it: true */

'use strict';

describe ('Hindu Solar Astro calendar spec', function () {
  var date, expected, actual;

  it ('should convert a Hindu Solar Astro date to a Julian day', function () {
    data4.forEach (function (data) {
      date     = data.hinduSolarAstro;
      expected = data.rataDie + cal.constants.J0000;
      actual   = cal.hinduSolarAstroToJd (date.year, date.month, date.day);
      expect (expected).to.be.equal (actual);
    });
  });

  it ('should convert a Julian day to a Hindu Solar Astro date', function () {
    data4.forEach (function (data) {
      date     = data.hinduSolarAstro;
      expected = [ date.year, date.month, date.day ];
      actual   = cal.jdToHinduSolarAstro (data.rataDie + cal.constants.J0000);
      expect (expected).to.be.eql (actual);
    });
  });
});
