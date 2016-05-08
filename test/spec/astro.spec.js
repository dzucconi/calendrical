/* global Calendrical describe it expect:true*/
/* eslint
  max-params: [ "error", 4 ] */

'use strict';

describe ('Astro spec', function () {
  var astro = Calendrical.astro,
      cal = Calendrical.calendar,
      date = new Date (2013, 5, 24, 21, 24, 3), // Mon Jun 24 2013 21:24:03 GMT
      julian = date.getJulian (),
      fixed = julian - cal.constants.J0000;

  it ('should determine the week-day', function () {
    expect (astro.jwday (julian)).toBe (6); // Monday
  });

  it ('should calculate a polynomial', function () {
    expect (astro.poly (1, [
      -0.00002, 0.000297, 0.025184, -0.181133,
      0.553040, -0.861938, 0.677066, -0.212591 ])).toBeCloseTo (-0.000095, 6);

    expect (astro.poly (50, [
      -0.00002, 0.000297, 0.025184, -0.181133,
      0.553040, -0.861938, 0.677066, -0.212591 ])).toEqual (-1.557734842036502e+11);

    expect (astro.poly (7000, [
      -0.00002, 0.000297, 0.025184, -0.181133,
      0.553040, -0.861938, 0.677066, -0.212591 ])).toEqual (-1.749981882604302e+26);
  });

  it ('should calculate a Julian centuries relative to 2000-01-01', function () {
    expect (astro.julianCenturies (584023)).toBeCloseTo (-4, 1);
  });

  it ('should calculate the obliquity of an ecliptic of a fixed date', function () {
    expect (astro.obliquity (fixed)).toEqual (23.437538210850892);
  });

  it ('should calculate an ephemeris correction', function () {
    expect (astro.ephemerisCorrection (584023)).toBeCloseTo (0.001485, 5);
  });

  it ('should calculate the equation of time', function () {
    expect (astro.equationOfTime (fixed)).toBeCloseTo (-0.0017755, 7);

    expect (astro.equationOfTime (49203.35716666667)).toBeCloseTo (0.00410048, 8);
  });

  it ('should calculate a sigma of a matrix', function () {
    var matrix = [ [ 1, 2, 3, 4 ], [ 5, 6, 7, 8 ], [ 9, 10, 11, 12 ] ];

    expect (astro.sigma (matrix, function (x0, y0, z0) {
      return x0 * y0 * z0;
    })).toEqual (780);
  });

  it ('should calculate a nutation', function () {
    var tee, jd, actual;

    jd = cal.gregorianToJd (1992, cal.constants.APRIL, 12) - cal.constants.J0000;
    tee = astro.dynamicalToUniversal (jd);
    actual = astro.nutation (tee);
    expect (actual).toEqual (0.004523893533647379);
  });

  it ('should determine apparent-to-local point', function () {
    expect (astro.apparentToLocal (49203.5, cal.constants.persian.TEHRAN_LOCATION)).toEqual (49203.495899521164);
  });

  it ('should calculate mid-day of a location', function () {
    expect (astro.midDay (49203, cal.constants.persian.TEHRAN_LOCATION)).toEqual (49203.49889952117);
  });

  it ('should sort an array with binary search', function () {
    var fMinusY, predicate, discriminator, func,
        y1 = 1.0;

    func = function (arg) {
      return arg;
    };

    fMinusY = function (x0, y0) {
      return func (x0) - y0;
    };

    predicate = function (a0, b0) {
      return Math.abs (fMinusY ((a0 + b0) / 2, y1)) <= 1e-5;
    };

    discriminator = function (x0) {
      return fMinusY (x0, y1) >= 0;
    };

    expect (astro.binarySearch (0.0, 3.1, predicate, discriminator)).toBeCloseTo (1.0, 4);

    y1 = 0.0;
    func = function (x0) {
      return x0 * x0 - 4 * x0 + 4;
    };

    expect (astro.binarySearch (1.5, 2.5, predicate, discriminator)).toBeCloseTo (2.0, 4);
  });
});
