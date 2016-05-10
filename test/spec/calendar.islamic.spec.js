/* global cal data2 describe expect it: true */

'use strict';

describe ('Islamic calendar spec', function () {
  var julian, date, expected, actual;

  it ('should convert a Islamic date to Julian day', function () {
    data2.forEach (function (data) {
      expected = data.rataDie + cal.constants.J0000;
      date     = data.islamic;
      actual   = cal.islamicToJd (date.year, date.month, date.day);

      expect (expected).to.be.equal (actual);
    });
  });

  it ('should convert a Julian day to a Islamic date', function () {
    data2.forEach (function (data) {
      julian   = data.rataDie + cal.constants.J0000;
      date     = data.islamic;
      expected = [ date.year, date.month, date.day ];
      actual   = cal.jdToIslamic (julian);

      expect (expected).to.be.eql (actual);
    });
  });

  it ('should determine whether a Islamic year is leap year', function () {
    expect (cal.leapIslamic (1)).to.be.false ();
    expect (cal.leapIslamic (168)).to.be.true ();
    expect (cal.leapIslamic (169)).to.be.false ();
    expect (cal.leapIslamic (170)).to.be.false ();
    expect (cal.leapIslamic (173)).to.be.false ();
    expect (cal.leapIslamic (174)).to.be.true ();
    expect (cal.leapIslamic (220)).to.be.true ();
  });
});
