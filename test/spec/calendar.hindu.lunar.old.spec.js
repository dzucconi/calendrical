/* global cal data4 describe expect it: true */

'use strict';

describe ('Hindu Lunar Old calendar spec', function () {
  var date, expected, actual;

  it ('should convert a Hindu Lunar Old date to Julian day', function () {
    data4.forEach (function (data) {
      date     = data.hinduLunarOld;
      expected = data.rataDie + cal.constants.J0000;
      actual   = cal.hinduLunarOldToJd ([ date.year, date.month, date.leap, date.day ]);

      expect (expected).to.be.equal (actual);
    });
  });

  it ('should convert a Julian day to a Hindu Lunar Old date', function () {
    data4.forEach (function (data) {
      date     = data.hinduLunarOld;
      expected = [ date.year, date.month, date.leap, date.day ];
      actual   = cal.jdToHinduLunarOld (data.rataDie + cal.constants.J0000);

      expect (expected).to.be.eql (actual);
    });
  });

  it ('should establish whether a Hindu Lunar Old year is leap', function () {
    [ 2933, 3570, 3795, 4197, 4340, 4389,
        4492, 4536, 4593, 4660, 4869, 4940
      ].forEach (function (year) {
        actual   = cal.leapHinduLunarOld (year);
        expect (true).to.be.equal (actual);
      });

    [ 2515, 3171, 3236, 3677, 4114, 4291, 4399, 4654, 4749, 4781,
        4817, 4920, 5004, 5030, 5042, 5044, 5092, 5096, 5139, 5195
      ].forEach (function (year) {
        actual   = cal.leapHinduLunarOld (year);
        expect (false).to.be.equal (actual);
      });
  });
});
