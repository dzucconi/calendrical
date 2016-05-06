/* global Calendrical data4 describe it expect:true*/
/* es lint no-undef: "error"*/

'use strict';

describe ("Hindu Solar Astro calendar spec", function () {
  var cal = Calendrical.calendar,
      date, expected, actual;

  /*
  it ("should calculate various Hindu Solar Astro characteristics", function () {
      expect (cal.hinduSine (39.314167)).toBeCloseTo (0.6332686, 7);
      expect (cal.hinduMeanPosition (-214215, cal.constants.hindu.ANOMALISTIC_YEAR)).toBeCloseTo (39.314146, 6);
      expect (cal.hinduEquationOfTime (-214215)).toBeCloseTo (0.00375, 5);
      expect (cal.hinduSunrise (-214215)).toBeCloseTo (-214214.78, 2);
  });
  */

  it ("should convert a Hindu Solar Astro date to a Julian day", function () {
    data4.forEach (function (data) {
      date     = data.hinduSolarAstro;
      expected = data.rataDie + cal.constants.J0000;
      actual   = cal.hinduSolarAstroToJd (date.year, date.month, date.day);
      expect (expected).toEqual (actual);
    });
  });

  it ("should convert a Julian day to a Hindu Solar Astro date", function () {
    data4.forEach (function (data) {
        date     = data.hinduSolarAstro;
        expected = [ date.year, date.month, date.day ];
        actual   = cal.jdToHinduSolarAstro (data.rataDie + cal.constants.J0000);
        expect (expected).toEqual (actual);
    });
  });
});
