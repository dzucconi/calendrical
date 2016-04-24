/* global Calendrical data4 describe it expect:true*/
/* eslint no-undef: "error"*/

'use strict';

describe ("Tibetan calendar spec", function () {
  var cal, date, expected, actual;

  cal = Calendrical.calendar;

  it ("should convert a Tibetan date to Julian day", function () {
    data4.forEach (function (data) {
        date     = data.tibetan;
        expected = data.rataDie + cal.constants.J0000;
        actual   = cal.tibetanToJd ([ date.year, date.month, date.leapMonth, date.day, date.leapDay ]);
        expect (expected).toEqual (actual);
    });
  });

  it ("should convert a Julian day to a Tibetan date", function () {
    data4.forEach (function (data) {
        date     = data.tibetan;
        expected = [ date.year, date.month, date.leapMonth, date.day, date.leapDay ];
        actual   = cal.jdToTibetan (data.rataDie + cal.constants.J0000);

        expect (expected).toEqual (actual);
    });
  });

  it ("should establish whether a Tibetan month is leap", function () {
      [ 2933, 3570, 3795, 4197, 4340, 4389,
        4492, 4536, 4593, 4660, 4869, 4940
      ].forEach (function (year) {
          actual   = cal.leapHinduLunarOld (year);
          expect (true).toEqual (actual);
      });

      [ 2515, 3171, 3236, 3677, 4114, 4291, 4399, 4654, 4749, 4781,
        4817, 4920, 5004, 5030, 5042, 5044, 5092, 5096, 5139, 5195
      ].forEach (function (year) {
          actual   = cal.leapHinduLunarOld (year);
          expect (false).toEqual (actual);
      });
  });
});
