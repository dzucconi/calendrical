/* global Calendrical data2 describe it expect:true*/
/* eslint no-undef: "error"*/

'use strict';

describe ("Mayan Tzolkin calendar spec", function () {
  var cal = Calendrical.calendar,
      date, julian, expected, actual;

  it ("should convert a Julian day to a Mayan Tzolkin", function () {
    data2.forEach (function (data) {
        julian   = data.rataDie + cal.constants.J0000;
        date     = data.mayanTzolkin;
        expected = [ date.day, date.month ];
        actual   = cal.jdToMayanTzolkin (julian);

        expect (expected).toEqual (actual);
    });
  });
});
