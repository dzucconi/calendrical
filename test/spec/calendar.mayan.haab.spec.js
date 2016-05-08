/* global Calendrical data2 describe it expect:true*/

'use strict';

describe ('Mayan Haab calendar spec', function () {
  var cal = Calendrical.calendar,
      date, julian, expected, actual;

  it ('should convert a Julian day to a Mayan Haab', function () {
    data2.forEach (function (data) {
      julian   = data.rataDie + cal.constants.J0000;
      date     = data.mayanHaab;
      expected = [ date.month, date.day ];
      actual   = cal.jdToMayanHaab (julian);

      expect (expected).toEqual (actual);
    });
  });
});
