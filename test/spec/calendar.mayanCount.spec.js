/* global Calendrical data2 describe it expect:true*/
/* eslint no-undef: "error"*/

'use strict';

describe ("Mayan Count calendar spec", function () {
  var cal = Calendrical.calendar,
      date, julian, expected, actual;

  it ("should convert a Mayan Count to Julian day", function () {
    data2.forEach (function (data) {
        expected = data.rataDie + cal.constants.J0000;
        date = data.mayanLong;
        actual = cal.mayanCountToJd (date.baktun, date.katun, date.tun, date.uinal, date.kin);

        expect (expected).toEqual (actual);
    });
  });

  it ("should convert a Julian day to a Mayan Count", function () {
    data2.forEach (function (data) {
        julian = data.rataDie + cal.constants.J0000;
        date = data.mayanLong;
        expected = [ date.baktun, date.katun, date.tun, date.uinal, date.kin ];
        actual = cal.jdToMayanCount (julian);

        expect (expected).toEqual (actual);
    });
  });
});
