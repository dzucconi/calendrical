/* global cal data2 describe expect it: true */

'use strict';

describe ('Bahai calendar spec', function () {
  var date = new Date (2013, 5, 24),
      julian = date.getJulian (),
      expected, actual;

  it ('should convert a date to Bahai calendar', function () {
    expect (date.getBahai()).to.be.eql ({
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

  it ('should convert a Bahai date to Julian day', function () {
    expect (cal.bahaiToJd ( 1,  9, 18,  6,  1)).to.be.equal (julian);
    expect (cal.bahaiToJd ( 1, 10,  2,  0,  1)).to.be.equal (2457810.5);

    data2.forEach (function (data) {
      expected = data.rataDie + cal.constants.J0000;
      date = data.bahai;
      actual = cal.bahaiToJd (date.kull_i_shay, date.vahid, date.year, date.month, date.day);

      expect (expected).to.be.equal (actual);
    });
  });

  it ('should convert a Julian day to a Bahai date', function () {
    expect (cal.jdToBahai (julian)).to.be.eql ([ 1, 9, 18, 6, 1 ]);
    expect (cal.jdToBahai (2457810.5)).to.be.eql ([ 1, 10,  2,  0,  1 ]);

    data2.forEach (function (data) {
      julian = data.rataDie + cal.constants.J0000;
      date = data.bahai;
      expected = [ date.kull_i_shay, date.vahid, date.year, date.month, date.day ];
      actual = cal.jdToBahai (julian);

      expect (expected).to.be.eql (actual);
    });
  });

  it ('should determine whether a Bahai year is leap year', function () {
    // the Bahai years 1 and 169 are the limits of the old leap rule
    expect (cal.leapBahai (1)).to.be.true ();
    expect (cal.leapBahai (168)).to.be.false ();
    expect (cal.leapBahai (169)).to.be.true ();
    expect (cal.leapBahai (170)).to.be.false ();

    // starting with the Bahai year 172, the new rule is in place
    expect (cal.leapBahai (173)).to.be.false ();
    expect (cal.leapBahai (174)).to.be.true ();
    expect (cal.leapBahai (220)).to.be.true ();
  });
});
