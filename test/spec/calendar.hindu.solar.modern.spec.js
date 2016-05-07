/* global Calendrical data4 describe it expect:true*/

'use strict';

describe ("Hindu Solar Modern calendar spec", function () {
  var cal = Calendrical.calendar,
      date, expected, actual;

  it ("should convert a Hindu Solar Modern date to a Julian day", function () {
    data4.forEach (function (data) {
      date     = data.hinduSolarNew;
      expected = data.rataDie + cal.constants.J0000;
      actual   = cal.hinduSolarToJd (date.year, date.month, date.day);
      expect (expected).toEqual (actual);
    });
  });

  it ("should convert a Julian day to a Hindu Solar Modern date", function () {
    data4.forEach (function (data) {
        date     = data.hinduSolarNew;
        expected = [ date.year, date.month, date.day ];
        actual   = cal.jdToHinduSolar (data.rataDie + cal.constants.J0000);
        expect (expected).toEqual (actual);
    });
  });
});
