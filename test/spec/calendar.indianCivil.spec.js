/* global Calendrical data4 describe it expect:true*/
/* eslint no-undef: "error"*/

'use strict';

describe ("Indian Civil calendar spec", function () {
  var cal, date, expected, actual;

  cal = Calendrical.calendar;

  it ("should convert a Indian Civil date to Julian day", function () {
    data4.forEach (function (data) {
        // Not sure which one it is: hinduSolarAstro, hinduSolarNew ??
        date     = data.hinduSolarAstro;
        expected = data.rataDie + cal.constants.J0000;
        actual   = cal.indianCivilToJd (date.year, date.month, date.day);

        expect (expected).toEqual (actual);
    });
  });

  it ("should convert a Julian day to a Indian Civil date", function () {
    data4.forEach (function (data) {
        date     = data.hinduSolarNew;
        expected = [ date.year, date.month, date.day ];
        actual   = cal.jdToIndianCivil (data.rataDie + cal.constants.J0000);

        expect (expected).toEqual (actual);
    });
  });
});
