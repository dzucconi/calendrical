/* global cal data4 describe expect it: true */

'use strict';

describe ('Hindu Solar Modern calendar spec', function () {
  var date, expected, actual;

  it ('should convert a Hindu Solar Modern date to a Julian day', function () {
    data4.forEach (function (data) {
      date     = data.hinduSolarNew;
      expected = data.rataDie + cal.constants.J0000;
      actual   = cal.hinduSolarToJd (date.year, date.month, date.day);
      expect (expected).to.be.equal (actual);
    });
  });

  it ('should convert a Julian day to a Hindu Solar Modern date', function () {
    data4.forEach (function (data) {
      date     = data.hinduSolarNew;
      expected = [ date.year, date.month, date.day ];
      actual   = cal.jdToHinduSolar (data.rataDie + cal.constants.J0000);
      expect (expected).to.be.eql (actual);
    });
  });
});
