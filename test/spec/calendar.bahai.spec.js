/* global Calendrical describe beforeEach it expect:true*/
/* eslint no-undef: "error"*/

'use strict';

describe ("Bahai calendar spec", function () {
  var cal = Calendrical.calendar,
      date = new Date (2013, 5, 24),
      julian = date.getJulian ();

  it ("should convert a date to Bahai calendar", function () {
    expect (date.getBahai()).toEqual ({
        kull_i_shay: 1,
        vahid: 9,
        year: 'Abhá',
        month: 'Rahmat',
        day: 'Bahá',
        weekday: 'Jalál',
        leap: false,
        official: true
      }
    );
  });

  it ("should convert a Bahai date to Julian day", function () {
    expect (cal.bahaiToJd(1, 9, 18, 6, 1)).toEqual (julian);
  });

  it ("should convert a Julian day to a Bahai date", function () {
    expect (cal.jdToBahai(julian)).toEqual ([ 1, 9, 18, 6, 1 ]);
  });

  it ("should determine whether a Bahai year is leap year", function () {
    // the Bahai years 1 and 169 are the limits of the old leap rule
    expect (cal.leapBahai(1)).toBe (true);
    expect (cal.leapBahai(168)).toBe (false);
    expect (cal.leapBahai(169)).toBe (true);
    expect (cal.leapBahai(170)).toBe (false);

    // starting with the Bahai year 172, the new rule is in place
    expect (cal.leapBahai(173)).toBe (false);
    expect (cal.leapBahai(174)).toBe (true);
    expect (cal.leapBahai(220)).toBe (true);
  });
});
