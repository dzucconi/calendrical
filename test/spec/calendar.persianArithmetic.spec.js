/* global Calendrical data3 describe it expect:true*/
/* eslint no-undef: "error"*/

'use strict';

describe ("Persian astronomical calendar spec", function () {
  var cal, date, expected, actual;

  cal = Calendrical.calendar;

  it ("should convert a Persian astronomical date to Julian day", function () {
      expected = 171307;
      actual = cal.persianToJd (-153, 10, 18);
      expect (expected).toEqual (actual);

      // expected = 210155;
      // actual = cal.persianToJd (-46, 2, 30);
      // expect (expected).toEqual (actual);

      // expected = 400085;
      // actual = cal.persianToJd (475, 3, 3);
      // expect (expected).toEqual (actual);
    data3.forEach (function (data) {
        //if (data.rataDie !== 171307 && data.rataDie !== 210155 && data.rataDie !== 400085) {
            date     = data.persianAstro;
            // expected = data.rataDie + cal.constants.J0000;
            expected = data.rataDie;
            actual   = cal.persianToJd (date.year, date.month, date.day);
            expect (expected).toEqual (actual);
        //}
    });
  });

  it ("should convert a Julian day to a Persian astronomical date", function () {
      expected = [ -153, 10, 18 ];
      actual = cal.jdToPersian (171307);
      expect (expected).toEqual (actual);

      // expected = [ -46, 2, 30 ];
      // actual = cal.jdToPersian (210155);
      // expect (expected).toEqual (actual);

      // expected = [ 475, 3, 3 ];
      // actual = cal.jdToPersian (400085);
      // expect (expected).toEqual (actual);

    data3.forEach (function (data) {
        //if (data.rataDie !== 171307 && data.rataDie !== 210155 && data.rataDie !== 400085) {
            date     = data.persianAstro;
            expected = [ date.year, date.month, date.day ];
            // actual   = cal.jdToPersian (data.rataDie + cal.constants.J0000);
            actual   = cal.jdToPersian (data.rataDie);
            expect (expected).toEqual (actual);
        //}
    });
  });

  it ("should determine whether a Persian astronomical year is leap year", function () {
      [ 4 ].forEach (function (year) {
          expect (cal.leapPersian (year)).toBe (true);
      });

      [ 1, 2, 3 ].forEach (function (year) {
          expect (cal.leapPersian (year)).toBe (false);
      });
  });
});
