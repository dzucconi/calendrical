/* global Calendrical data2 describe it expect:true*/

'use strict';

describe ('Islamic calendar spec', function () {
  var cal, julian, date, expected, actual;

  cal = Calendrical.calendar;

  it ('should convert a Islamic date to Julian day', function () {
    data2.forEach (function (data) {
      expected = data.rataDie + cal.constants.J0000;
      date     = data.islamic;
      actual   = cal.islamicToJd (date.year, date.month, date.day);

      expect (expected).toEqual (actual);
    });
  });

  it ('should convert a Julian day to a Islamic date', function () {
    data2.forEach (function (data) {
      julian   = data.rataDie + cal.constants.J0000;
      date     = data.islamic;
      expected = [ date.year, date.month, date.day ];
      actual   = cal.jdToIslamic (julian);

      expect (expected).toEqual (actual);
    });
  });

  it ('should determine whether a Islamic year is leap year', function () {
    expect (cal.leapIslamic (1)).toBe (false);
    expect (cal.leapIslamic (168)).toBe (true);
    expect (cal.leapIslamic (169)).toBe (false);
    expect (cal.leapIslamic (170)).toBe (false);
    expect (cal.leapIslamic (173)).toBe (false);
    expect (cal.leapIslamic (174)).toBe (true);
    expect (cal.leapIslamic (220)).toBe (true);
  });
});
