/* global Calendrical data4 describe it expect:true*/

'use strict';

describe ("Hindu Solar Old calendar spec", function () {
  var cal, date, expected, actual;

  cal = Calendrical.calendar;

  it ("should convert a Hindu Solar Old date to Julian day", function () {
    data4.forEach (function (data) {
        date     = data.hinduSolarOld;
        expected = data.rataDie + cal.constants.J0000;
        actual   = cal.hinduSolarOldToJd (date.year, date.month, date.day);

        expect (expected).toEqual (actual);
    });
  });

  it ("should convert a Julian day to a Hindu Solar Old date", function () {
    data4.forEach (function (data) {
        date     = data.hinduSolarOld;
        expected = [ date.year, date.month, date.day ];
        actual   = cal.jdToHinduSolarOld (data.rataDie + cal.constants.J0000);

        expect (expected).toEqual (actual);
    });
  });

});
