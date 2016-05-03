/* global Calendrical describe it expect:true*/
/* eslint no-undef: "error"*/

'use strict';

describe ("Astro spec", function () {
  var astro = Calendrical.astro,
      cal = Calendrical.calendar,
      date = new Date (2013, 5, 24, 21, 24, 3), // Mon Jun 24 2013 21:24:03 GMT
      julian = date.getJulian (),
      fixed = julian - cal.constants.J0000;

  it ("should determine the week-day", function () {
    expect (astro.jwday (julian)).toBe (6); // Monday
  });

  it ("should calculate a polynomial", function () {
    expect (astro.poly (1, [
        -0.00002, 0.000297, 0.025184, -0.181133,
         0.553040, -0.861938, 0.677066, -0.212591 ])).toEqual (-0.00009500000000002161);

    expect (astro.poly (50, [
       -0.00002, 0.000297, 0.025184, -0.181133,
        0.553040, -0.861938, 0.677066, -0.212591 ])).toEqual (-1.557734842036502e+11);

     expect (astro.poly (7000, [
        -0.00002, 0.000297, 0.025184, -0.181133,
         0.553040, -0.861938, 0.677066, -0.212591 ])).toEqual (-1.749981882604302e+26);
  });

  it ("should calculate a Julian centuries relative to 2000-01-01", function () {
    expect (astro.julianCenturies (584023)).toEqual (-3.99993151306895);
  });

   it ("should calculate the obliquity of an ecliptic of a fixed date", function () {
    expect (astro.obliquity (fixed)).toEqual (23.437538210850892);
  });

  it ("should calculate an ephemeris correction", function () {
    expect (astro.ephemerisCorrection (584023)).toEqual (0.0014851565792882565);
  });

  it ("should calculate the equation of time", function () {
    expect (astro.equationOfTime (fixed)).toEqual (-0.0017755066724487007);

    expect (astro.equationOfTime (49203.35716666667)).toEqual (0.004100478836863293);
  });

  it ("should calculate a sigma of a matrix", function () {
    var matrix = [ [ 1, 2, 3, 4 ], [ 5, 6, 7, 8 ], [ 9, 10, 11, 12 ] ];

    expect (astro.sigma (matrix, function (x0, y0, z0) {
      return x0 * y0 * z0;
    })).toEqual (780);
  });

  it ("should calculate a nutation", function () {
    var tee, jd, actual;

    jd = cal.gregorianToJd (1992, cal.constants.APRIL, 12) - cal.constants.J0000;
    tee = astro.dynamicalToUniversal (jd);
    actual = astro.nutation (tee);
    expect (actual).toEqual (0.004523893533647379);
  });

  it ("should determine apparent-to-local point", function () {
    expect (astro.apparentToLocal (49203.5, cal.constants.persian.TEHRAN_LOCATION)).toEqual (49203.495899521164);
  });

  it ("should calculate mid-day of a location", function () {
    expect (astro.midDay (49203, cal.constants.persian.TEHRAN_LOCATION)).toEqual (49203.49889952117);
  });
});
