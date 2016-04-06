/* global Calendrical describe beforeEach it expect:true*/
/* eslint no-undef: "error"*/

'use strict';

describe ("Bahai calendar spec", function () {
  var cal, date, julian;

  beforeEach (function () {
      cal = Calendrical.calendar;
      date = new Date (2013, 5, 24, 21, 0, 0); // Mon Jun 24 2013 21:00:00 GMT
      julian = date.getJulian ();

    cal.updateBahai (julian);
  });

  it ("should convert a date to Bahai calendar", function () {
    expect (date.getBahai()).toEqual ({
        kull_i_shay: 1,
        vahid: 9,
        year: 'Abhá',
        month: 'Rahmat',
        day: 'Jalál',
        weekday: 'Kamál',
        leap: false }
    );
  });

  it ("should convert a Bahai date to Julian day", function () {
    expect (cal.bahaiToJd(1, 9, 18, 6, 2)).toEqual (julian + 0.125);
  });

  it ("should convert a Julian day to a Bahai date", function () {
    expect (cal.jdToBahai(julian)).toEqual ([ 1, 9, 18, 6, 2 ]);
  });
});
