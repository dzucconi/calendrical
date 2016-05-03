"use strict";

var Calendrical = (function (exports) {
    var astro, calendar;

  exports.astro = exports.astro || {};
  exports.calendar = exports.calendar || {};

  astro = exports.astro;
  calendar = exports.calendar;

  // astro.constants
  // ---------------
  astro.constants = {
    // *Julian day of J2000 epoch*
    J2000: 2451545.0,

    // *Days in Julian century*
    JULIAN_CENTURY: 36525.0,

    // *Days in Julian millennium*
    JULIAN_MILLENIUM: 365250,

    // *Astronomical unit in kilometres*
    ASTRONOMICAL_UNIT: 149597870.0,

    // *Mean solar tropical year*
    TROPICAL_YEAR: 365.24219878,

    // *Weekdays*
    WEEKDAYS: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],

    // *Terms used in calculating the obliquity of the ecliptic*
    // from **Astronomy and Astrophysics**, Vol 157, p68 (1986),
    // *New Formulas for the Precession, Valid Over 10000 years*, Table 8.
    O_TERMS: [-4680.93, -1.55, 1999.25, -51.38, -249.67, -39.05, 7.12, 27.87, 5.79, 2.45],

    // Periodic terms for nutation in longiude (delta \Psi) and
    // obliquity (delta \Epsilon) as given in table 21.A of
    // *Meeus, **Astronomical Algorithms**, first edition*.

    // *Argument of Multiple*
    NUT_ARG_MULT: [
       0,  0,  0,  0,  1,
      -2,  0,  0,  2,  2,
       0,  0,  0,  2,  2,
       0,  0,  0,  0,  2,
       0,  1,  0,  0,  0,
       0,  0,  1,  0,  0,
      -2,  1,  0,  2,  2,
       0,  0,  0,  2,  1,
       0,  0,  1,  2,  2,
      -2, -1,  0,  2,  2,
      -2,  0,  1,  0,  0,
      -2,  0,  0,  2,  1,
       0,  0, -1,  2,  2,
       2,  0,  0,  0,  0,
       0,  0,  1,  0,  1,
       2,  0, -1,  2,  2,
       0,  0, -1,  0,  1,
       0,  0,  1,  2,  1,
      -2,  0,  2,  0,  0,
       0,  0, -2,  2,  1,
       2,  0,  0,  2,  2,
       0,  0,  2,  2,  2,
       0,  0,  2,  0,  0,
      -2,  0,  1,  2,  2,
       0,  0,  0,  2,  0,
      -2,  0,  0,  2,  0,
       0,  0, -1,  2,  1,
       0,  2,  0,  0,  0,
       2,  0, -1,  0,  1,
      -2,  2,  0,  2,  2,
       0,  1,  0,  0,  1,
      -2,  0,  1,  0,  1,
       0, -1,  0,  0,  1,
       0,  0,  2, -2,  0,
       2,  0, -1,  2,  1,
       2,  0,  1,  2,  2,
       0,  1,  0,  2,  2,
      -2,  1,  1,  0,  0,
       0, -1,  0,  2,  2,
       2,  0,  0,  2,  1,
       2,  0,  1,  0,  0,
      -2,  0,  2,  2,  2,
      -2,  0,  1,  2,  1,
       2,  0, -2,  0,  1,
       2,  0,  0,  0,  1,
       0, -1,  1,  0,  0,
      -2, -1,  0,  2,  1,
      -2,  0,  0,  0,  1,
       0,  0,  2,  2,  1,
      -2,  0,  2,  0,  1,
      -2,  1,  0,  2,  1,
       0,  0,  1, -2,  0,
      -1,  0,  1,  0,  0,
      -2,  1,  0,  0,  0,
       1,  0,  0,  0,  0,
       0,  0,  1,  2,  0,
      -1, -1,  1,  0,  0,
       0,  1,  1,  0,  0,
       0, -1,  1,  2,  2,
       2, -1, -1,  2,  2,
       0,  0, -2,  2,  2,
       0,  0,  3,  2,  2,
       2, -1,  0,  2,  2
    ],

    // *Coefficient of the sine of the argument*
    // and *Coefficient of the cosine of the argument*
    NUT_ARG_COEFF: [
      -171996,   -1742,   92095,      89, //  0,  0,  0,  0,  1
       -13187,     -16,    5736,     -31, // -2,  0,  0,  2,  2
        -2274,      -2,     977,      -5, //  0,  0,  0,  2,  2
         2062,       2,    -895,       5, //  0,  0,  0,  0,  2
         1426,     -34,      54,      -1, //  0,  1,  0,  0,  0
          712,       1,      -7,       0, //  0,  0,  1,  0,  0
         -517,      12,     224,      -6, // -2,  1,  0,  2,  2
         -386,      -4,     200,       0, //  0,  0,  0,  2,  1
         -301,       0,     129,      -1, //  0,  0,  1,  2,  2
          217,      -5,     -95,       3, // -2, -1,  0,  2,  2
         -158,       0,       0,       0, // -2,  0,  1,  0,  0
          129,       1,     -70,       0, // -2,  0,  0,  2,  1
          123,       0,     -53,       0, //  0,  0, -1,  2,  2
           63,       0,       0,       0, //  2,  0,  0,  0,  0
           63,       1,     -33,       0, //  0,  0,  1,  0,  1
          -59,       0,      26,       0, //  2,  0, -1,  2,  2
          -58,      -1,      32,       0, //  0,  0, -1,  0,  1
          -51,       0,      27,       0, //  0,  0,  1,  2,  1
           48,       0,       0,       0, // -2,  0,  2,  0,  0
           46,       0,     -24,       0, //  0,  0, -2,  2,  1
          -38,       0,      16,       0, //  2,  0,  0,  2,  2
          -31,       0,      13,       0, //  0,  0,  2,  2,  2
           29,       0,       0,       0, //  0,  0,  2,  0,  0
           29,       0,     -12,       0, // -2,  0,  1,  2,  2
           26,       0,       0,       0, //  0,  0,  0,  2,  0
          -22,       0,       0,       0, // -2,  0,  0,  2,  0
           21,       0,     -10,       0, //  0,  0, -1,  2,  1
           17,      -1,       0,       0, //  0,  2,  0,  0,  0
           16,       0,      -8,       0, //  2,  0, -1,  0,  1
          -16,       1,       7,       0, // -2,  2,  0,  2,  2
          -15,       0,       9,       0, //  0,  1,  0,  0,  1
          -13,       0,       7,       0, // -2,  0,  1,  0,  1
          -12,       0,       6,       0, //  0, -1,  0,  0,  1
           11,       0,       0,       0, //  0,  0,  2, -2,  0
          -10,       0,       5,       0, //  2,  0, -1,  2,  1
           -8,       0,       3,       0, //  2,  0,  1,  2,  2
            7,       0,      -3,       0, //  0,  1,  0,  2,  2
           -7,       0,       0,       0, // -2,  1,  1,  0,  0
           -7,       0,       3,       0, //  0, -1,  0,  2,  2
           -7,       0,       3,       0, //  2,  0,  0,  2,  1
            6,       0,       0,       0, //  2,  0,  1,  0,  0
            6,       0,      -3,       0, // -2,  0,  2,  2,  2
            6,       0,      -3,       0, // -2,  0,  1,  2,  1
           -6,       0,       3,       0, //  2,  0, -2,  0,  1
           -6,       0,       3,       0, //  2,  0,  0,  0,  1
            5,       0,       0,       0, //  0, -1,  1,  0,  0
           -5,       0,       3,       0, // -2, -1,  0,  2,  1
           -5,       0,       3,       0, // -2,  0,  0,  0,  1
           -5,       0,       3,       0, //  0,  0,  2,  2,  1
            4,       0,       0,       0, // -2,  0,  2,  0,  1
            4,       0,       0,       0, // -2,  1,  0,  2,  1
            4,       0,       0,       0, //  0,  0,  1, -2,  0
           -4,       0,       0,       0, // -1,  0,  1,  0,  0
           -4,       0,       0,       0, // -2,  1,  0,  0,  0
           -4,       0,       0,       0, //  1,  0,  0,  0,  0
            3,       0,       0,       0, //  0,  0,  1,  2,  0
           -3,       0,       0,       0, // -1, -1,  1,  0,  0
           -3,       0,       0,       0, //  0,  1,  1,  0,  0
           -3,       0,       0,       0, //  0, -1,  1,  2,  2
           -3,       0,       0,       0, //  2, -1, -1,  2,  2
           -3,       0,       0,       0, //  0,  0, -2,  2,  2
           -3,       0,       0,       0, //  0,  0,  3,  2,  2
           -3,       0,       0,       0  //  2, -1,  0,  2,  2
    ],

    // *Table of observed Delta T values at the beginning of
    // even numbered years from 1620 through 2002.*
    DELTA_T_TAB: [
      121, 112, 103, 95, 88, 82, 77, 72, 68, 63, 60, 56,
      53, 51, 48, 46, 44, 42, 40, 38, 35, 33, 31, 29,
      26, 24, 22, 20, 18, 16, 14, 12, 11, 10, 9, 8,
      7, 7, 7, 7, 7, 7, 8, 8, 9, 9, 9, 9,
      9, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11,
      11, 11, 12, 12, 12, 12, 13, 13, 13, 14, 14, 14,
      14, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16,
      16, 16, 15, 15, 14, 13, 13.1, 12.5, 12.2, 12, 12, 12,
      12, 12, 12, 11.9, 11.6, 11, 10.2, 9.2, 8.2, 7.1, 6.2, 5.6,
      5.4, 5.3, 5.4, 5.6, 5.9, 6.2, 6.5, 6.8, 7.1, 7.3, 7.5, 7.6,
      7.7, 7.3, 6.2, 5.2, 2.7, 1.4, -1.2, -2.8, -3.8, -4.8, -5.5, -5.3,
      -5.6, -5.7, -5.9, -6, -6.3, -6.5, -6.2, -4.7, -2.8, -0.1, 2.6, 5.3,
      7.7, 10.4, 13.3, 16, 18.2, 20.2, 21.1, 22.4, 23.5, 23.8, 24.3, 24,
      23.9, 23.9, 23.7, 24, 24.3, 25.3, 26.2, 27.3, 28.2, 29.1, 30, 30.7,
      31.4, 32.2, 33.1, 34, 35, 36.5, 38.3, 40.2, 42.2, 44.5, 46.5, 48.5,
      50.5, 52.2, 53.8, 54.9, 55.8, 56.9, 58.3, 60, 61.6, 63, 65, 66.6
    ],

    // *Periodic terms to obtain true time*
    EQUINOX_P_TERMS: [
      485, 324.96,   1934.136,
      203, 337.23,  32964.467,
      199, 342.08,     20.186,
      182,  27.85, 445267.112,
      156,  73.14,  45036.886,
      136, 171.52,  22518.443,
       77, 222.54,  65928.934,
       74, 296.72,   3034.906,
       70, 243.58,   9037.513,
       58, 119.81,  33718.147,
       52, 297.17,    150.678,
       50,  21.02,   2281.226,
       45, 247.54,  29929.562,
       44, 325.15,  31555.956,
       29,  60.93,   4443.417,
       18, 155.12,  67555.328,
       17, 288.79,   4562.452,
       16, 198.04,  62894.029,
       14, 199.76,  31436.921,
       12,  95.39,  14577.848,
       12, 287.11,  31931.756,
       12, 320.81,  34777.259,
        9, 227.73,   1222.114,
        8,  15.45,  16859.074
    ],

    JDE0_TAB_1000: [
      [ 1721139.29189, 365242.13740,  0.06134,  0.00111, -0.00071 ],
      [ 1721233.25401, 365241.72562, -0.05323,  0.00907,  0.00025 ],
      [ 1721325.70455, 365242.49558, -0.11677, -0.00297,  0.00074 ],
      [ 1721414.39987, 365242.88257, -0.00769, -0.00933, -0.00006 ]
    ],

    JDE0_TAB_2000: [
      [ 2451623.80984, 365242.37404,  0.05169, -0.00411, -0.00057 ],
      [ 2451716.56767, 365241.62603,  0.00325,  0.00888, -0.00030 ],
      [ 2451810.21715, 365242.01767, -0.11575,  0.00337,  0.00078 ],
      [ 2451900.05952, 365242.74049, -0.06223, -0.00823,  0.00032 ]
    ],

    SOLAR_LONGITUDE_COEFFICIENTS: [
        403406, 195207, 119433, 112392, 3891, 2819, 1721,
        660, 350, 334, 314, 268, 242, 234, 158, 132, 129, 114,
        99, 93, 86, 78, 72, 68, 64, 46, 38, 37, 32, 29, 28, 27, 27,
        25, 24, 21, 21, 20, 18, 17, 14, 13, 13, 13, 12, 10, 10, 10,
        10
    ],

    SOLAR_LONGITUDE_MULTIPLIERS: [
        0.9287892, 35999.1376958, 35999.4089666,
        35998.7287385, 71998.20261, 71998.4403,
        36000.35726, 71997.4812, 32964.4678,
        -19.4410, 445267.1117, 45036.8840, 3.1008,
        22518.4434, -19.9739, 65928.9345,
        9038.0293, 3034.7684, 33718.148, 3034.448,
        -2280.773, 29929.992, 31556.493, 149.588,
        9037.750, 107997.405, -4444.176, 151.771,
        67555.316, 31556.080, -4561.540,
        107996.706, 1221.655, 62894.167,
        31437.369, 14578.298, -31931.757,
        34777.243, 1221.999, 62894.511,
        -4442.039, 107997.909, 119.066, 16859.071,
        -4.578, 26895.292, -39.127, 12297.536,
        90073.778
    ],

    SOLAR_LONGITUDE_ADDENDS: [
        270.54861, 340.19128, 63.91854, 331.26220,
        317.843, 86.631, 240.052, 310.26, 247.23,
        260.87, 297.82, 343.14, 166.79, 81.53,
        3.50, 132.75, 182.95, 162.03, 29.8,
        266.4, 249.2, 157.6, 257.8, 185.1,
        69.9,  8.0, 197.1, 250.4, 65.3,
        162.7, 341.5, 291.6, 98.5, 146.7,
        110.0, 5.2, 342.6, 230.9, 256.1,
        45.3, 242.9, 115.2, 151.8, 285.3,
        53.3, 126.6, 205.7, 85.9, 146.1
    ]
  };

  // astro Functions
  // ---------------
  // Arc-seconds to radians
  function astor (a) {
    return a * Math.PI / (180.0 * 3600.0);
  }

  astro.astor = astor;

  // Degrees to radians
  function dtr (d) {
    return d * Math.PI / 180.0;
  }

  astro.dtr = dtr;

  // Radians to degrees
  function rtd (r) {
    return r * 180.0 / Math.PI;
  }

  astro.rtd = rtd;

  function angle (degrees, minutes, seconds) {
      return degrees + (minutes + seconds / 60) / 60;
  }

  astro.angle = angle;

  // Range reduce angle in degrees
  function fixangle (a) {
    return a - 360.0 * Math.floor (a / 360.0);
  }

  astro.fixangle = fixangle;

  // Range reduce angle in radians
  function fixangr (a) {
    return a - 2 * Math.PI * Math.floor (a / (2 * Math.PI));
  }

  astro.fixangr = fixangr;

  // Sine of an angle in degrees
  function dsin (theta) {
    return Math.sin (dtr (theta));
  }

  astro.dsin = dsin;

  // Cosine of an angle in degrees
  function dcos (theta) {
    return Math.cos (dtr (theta));
  }

  astro.dcos = dcos;

  // Cosine of an angle in degrees
  function dtan (theta) {
    return Math.tan (dtr (theta));
  }

  astro.dtan = dtan;

  // Modulus function which works for non-integers
  function mod (a, b) {
    return a - b * Math.floor(a / b);
  }

  astro.mod = mod;

  // Modulus function which returns numerator if modulus is zero
  function amod (a, b) {
    return mod (a - 1, b) + 1;
  }

  astro.amod = amod;

  // Return first integer greater or equal to initial index, i,
  // such that condition, p, holds.
  function next (i, p) {
      var iter = i;

    // return p (i) ? i : next (i + 1, p);
    while (!p (iter)) {
        iter += 1;
    }

    return iter;
  }

  astro.next = next;

  // Return last integer greater or equal to initial index, i,
  // such that condition, p, holds.
  function final (i, p) {
    return !p (i) ? i - 1 : final (i + 1, p);
  }

  astro.final = final;

  /*
  Return the sum of applying the function func for indices i [ 1 .. n ]
  running simultaneously thru columns c [ 1 .. n ].
  Martrix matrix is of the form [ [i1 c1] [i1 c2] .. [ in cn ] ].
  */
  function sigma (matrix, func) {
     var columns = matrix[0].length,
         result = 0,
         index, x0, y0, z0;

     for (index = 0; index < columns; index += 1) {
         x0 = matrix[0][index];
         y0 = matrix[1][index];
         z0 = matrix[2][index];
         result += func (x0, y0, z0);
     }

     return result;
  }

  astro.sigma = sigma;

  // Return standard time from tee_rom_u in universal time at location
  function universalToStandard (teeRomU, location) {
      return teeRomU + location[3];
  }

  astro.universalToStandard = universalToStandard;

  // Return universal time from tee_rom_s in standard time at location
  function standardToUniversal (teeRomS, location) {
      return teeRomS - location[3];
  }

  astro.standardToUniversal = standardToUniversal;

  // Return the difference between UT and local mean time at longitude
  // 'phi' as a fraction of a day
  function longitudeToZone (phi) {
      return phi / 360;
  }

  astro.longitudeToZone = longitudeToZone;

  // Return universal time from local tee_ell at location
  function localToUniversal (teeEll, location) {
      return teeEll - longitudeToZone (location[1]);
  }

  astro.localToUniversal = localToUniversal;

  // Return standard time from local tee_ell at loacle, location
  function localToStandard (teeEll, location) {
    return universalToStandard (localToUniversal (teeEll, location), location);
  }

  astro.localToStandard = localToStandard;

  // Return local time from standard tee_rom_s at location, location
  function standardToLocal (teeRomS, location) {
      return universalToLocal (standardToUniversal (teeRomS, location), location);
  }

  astro.standardToLocal = standardToLocal;

  // Return sundial time at local time tee at location, location
  function localToApparent (tee, location) {
      return tee + equationOfTime (localToUniversal (tee, location));
  }

  astro.localToApparent = localToApparent;

  // Return local time from sundial time tee at location, location
  function apparentToLocal (tee, location) {
      return tee - equationOfTime (localToUniversal (tee, location));
  }

  astro.apparentToLocal = apparentToLocal;

  // Return approximate moment at or before tee when solar longitude
  // just exceeded lam degrees.
  function estimatePriorSolarLongitude (lam, tee) {
      var rate = calendar.constants.MEAN_TROPICAL_YEAR / 360,
          tau = tee - rate * mod (solarLongitude (tee) - lam, 360),
          capDelta = mod (solarLongitude (tau) - lam + 180, 360) - 180;

      return Math.min (tee, tau - rate * capDelta);
  }

  astro.estimatePriorSolarLongitude = estimatePriorSolarLongitude;

  // Return standard time on fixed date, date, of midday at location, location
  function midDay (date, location) {
      return localToStandard (apparentToLocal (date + 0.5, location), location);
  }

  astro.midDay = midDay;

  // Return Universal moment from Dynamical time, tee
  function dynamicalToUniversal (tee) {
      return tee - ephemerisCorrection (tee);
  }

  astro.dynamicalToUniversal = dynamicalToUniversal;

  // Return Dynamical time at Universal moment, tee
  function universalToDynamical (tee) {
      return tee + ephemerisCorrection (tee);
  }

  astro.universalToDynamical = universalToDynamical;

  // Return Julian centuries since 2000 at moment tee."""
  function julianCenturies (tee) {
    return (universalToDynamical (tee) - calendar.constants.J2000) / 36525;
  }

  astro.julianCenturies = julianCenturies;

  /*
  Calculate polynomial with coefficients 'a' at point x.
  The polynomial is  a[0] + a[1] * x + a[2] * x^2 + ...a[n-1]x^(n-1)
  the result is      a[0] + x(a[1] + x(a[2] +...+ x(a[n-1])...)
  */
  function poly (term, array) {
    var len = array.length,
        result = array[len - 1],
        index = len - 2;

    while (index >= 0) {
      result = result * term + array[index];
      index -= 1;
    }

  return result;
}

  astro.poly = poly;

  // Convert Julian time to hour, minutes, and seconds,
  // returned as a three-element array
  function jhms (j) {
    var ij;

    // Astronomical to civil
    j += 0.5;

    ij = ((j - Math.floor(j)) * 86400.0) + 0.5;

    return [
      Math.floor(ij / 3600),
      Math.floor((ij / 60) % 60),
      Math.floor(ij % 60)
    ];
  }

  astro.jhms = jhms;

  // Calculate day of week from Julian day
  function jwday (j) {
    return mod (Math.floor ((j - 0.5)), 7);
  }

  astro.jwday = jwday;

  // Calculate the obliquity of the ecliptic for a given
  // Julian date. This uses Laskar's tenth-degree
  // polynomial fit (*J. Laskar, **Astronomy and
  // Astrophysics**, Vol. 157, page 68 [1986]*) which is
  // accurate to within 0.01 arc second between AD 1000
  // and AD 3000, and within a few seconds of arc for
  // +/-10000 years around AD 2000. If we're outside the
  // range in which this fit is valid (deep time) we
  // simply return the J2000 value of the obliquity, which
  // happens to be almost precisely the mean.
  function obliquity (jd) {
    var centuries = julianCenturies (jd);

    return angle (23, 26, 21.448) +
            poly (centuries, [
                0,
                angle (0, 0, -46.8150),
                angle (0, 0, -0.00059),
                angle (0, 0, 0.001813) ]);
  }

  astro.obliquity = obliquity;

  // Return the longitudinal nutation at moment tee
  function nutation (tee) {
      var centuries = julianCenturies (tee),
          capA = poly (centuries, [ 124.90, -1934.134, 0.002063 ]),
          capB = poly (centuries, [ 201.11, 72001.5377, 0.00057 ]);

      return -0.004778  * dsin (capA) +
             -0.0003667 * dsin (capB);
  }

  astro.nutation = nutation;

  // Convert celestial (ecliptical) longitude and
  // latitude into right ascension (in degrees) and
  // declination. We must supply the time of the
  // conversion in order to compensate correctly for the
  // varying obliquity of the ecliptic over time.
  // The right ascension and declination are returned
  // as a two-element Array in that order.
  function ecliptoeq (jd, Lambda, Beta) {
    var eps, Ra, Dec;

    // Obliquity of the ecliptic
    eps = dtr(obliquity(jd));
    Ra = rtd(Math.atan2((Math.cos(eps) * Math.sin(dtr(Lambda)) -
        (Math.tan(dtr(Beta)) * Math.sin(eps))),
      Math.cos(dtr(Lambda))));
    Ra = fixangle(rtd(Math.atan2((Math.cos(eps) * Math.sin(dtr(Lambda)) -
        (Math.tan(dtr(Beta)) * Math.sin(eps))),
      Math.cos(dtr(Lambda)))));
    Dec = rtd(Math.asin((Math.sin(eps) * Math.sin(dtr(Lambda)) * Math.cos(dtr(Beta))) +
      (Math.sin(dtr(Beta)) * Math.cos(eps))));

    return [ Ra, Dec ];
  }

  astro.ecliptoeq = ecliptoeq;

  // Determine the difference, in seconds, between
  // Dynamical time and Universal time.
  function deltat (year) {
    var dt, f, i, t;

    if ((year >= 1620) && (year <= 2000)) {
      i = Math.floor((year - 1620) / 2);
      // Fractional part of year
      f = ((year - 1620) / 2) - i;
      dt = astro.constants.DELTA_T_TAB[i] + ((astro.constants.DELTA_T_TAB[i + 1] - astro.constants.DELTA_T_TAB[i]) * f);
    } else {
      t = (year - 2000) / 100;
      if (year < 948) {
        dt = 2177 + (497 * t) + (44.1 * t * t);
      } else {
        dt = 102 + (102 * t) + (25.3 * t * t);
        if ((year > 2000) && (year < 2100)) {
          dt += 0.37 * (year - 2100);
        }
      }
    }

    return dt;
  }

  astro.deltat = deltat;

  // Determine the Julian Ephemeris Day of an
  // equinox or solstice. The `which` argument
  // selects the item to be computed:
  //
  // **0** - March equinox
  // **1** - June solstice
  // **2** - September equinox
  // **3** - December solstice
  function equinox (year, which) {
    var deltaL, i, j, JDE0, JDE, JDE0tab, S, T, W, Y;

    // Initialise terms for mean equinox and solstices. We
    // have two sets: one for years prior to 1000 and a second
    // for subsequent years.
    if (year < 1000) {
      JDE0tab = astro.constants.JDE0_TAB_1000;
      Y = year / 1000;
    } else {
      JDE0tab = astro.constants.JDE0_TAB_2000;
      Y = (year - 2000) / 1000;
    }

    JDE0 = JDE0tab[which][0] +
      (JDE0tab[which][1] * Y) +
      (JDE0tab[which][2] * Y * Y) +
      (JDE0tab[which][3] * Y * Y * Y) +
      (JDE0tab[which][4] * Y * Y * Y * Y);

    T      = (JDE0 - 2451545.0) / 36525;
    W      = (35999.373 * T) - 2.47;
    deltaL = 1 + (0.0334 * dcos(W)) + (0.0007 * dcos(2 * W));

    // Sum the periodic terms for time T
    S = 0;
    for (i = j = 0; i < 24; i++) {
      S += astro.constants.EQUINOX_P_TERMS[j] * dcos(astro.constants.EQUINOX_P_TERMS[j + 1] + (astro.constants.EQUINOX_P_TERMS[j + 2] * T));
      j += 3;
    }

    JDE = JDE0 + S * 0.00001 / deltaL;

    return JDE;
  }

  astro.equinox = equinox;

  // Return Dynamical Time minus Universal Time (in days) for
  // moment, tee.  Adapted from "Astronomical Algorithms"
  // by Jean Meeus, Willmann_Bell, Inc., 1991.
  function ephemerisCorrection (tee) {
      var year, centuries, result;

      year = calendar.jdToGregorianYear (Math.floor (tee + calendar.constants.gregorian.EPOCH_RD));

      if (year >= 1988 && year <= 2019) {
         return (year - 1933) / 86400;
      }

      centuries = (calendar.gregorianToJd (year, calendar.constants.JULY, 1) -
            calendar.gregorianToJd (1900, calendar.constants.JANUARY, 1)) / 36525;

      if (year >= 1900 && year <= 1987) {
          return poly (centuries, [
              -0.00002, 0.000297, 0.025184, -0.181133,
              0.553040, -0.861938, 0.677066, -0.212591 ]);
      }

      if (year >= 1800 && year <= 1899) {
          return poly (centuries, [
              -0.000009, 0.003844, 0.083563, 0.865736, 4.867575,
              15.845535, 31.332267, 38.291999, 28.316289, 11.636204, 2.043794 ]);
      }

      if (year >= 1700 && year <= 1799) {
          return poly (year - 1700, [
              8.118780842, -0.005092142, 0.003336121, -0.0000266484 ]) / 86400;
      }

      if (year >= 1620 && year <= 1699) {
          return poly (year - 1600, [ 196.58333, -4.0675, 0.0219167 ]) / 86400;
      }

      result = 0.5 + (calendar.gregorianToJd (year, calendar.constants.JANUARY, 1) -
               calendar.gregorianToJd (1810, calendar.constants.JANUARY, 1)
           );

      return (result * result / 41048480 - 15) / 86400;
  }

  astro.ephemerisCorrection = ephemerisCorrection;

  // Compute equation of time for a given moment.
  // Returns the equation of time as a fraction of
  // a day.
  // Return the equation of time (as fraction of day) for moment, tee.
  // Adapted from "Astronomical Algorithms" by Jean Meeus,
  // Willmann_Bell, Inc., 1991.
  function equationOfTime (tee) {
    var centuries, lambda, anomaly, eccentricity, varepsilon, y0, equation;

    centuries = julianCenturies (tee);

    lambda = poly (centuries, [ 280.46645, 36000.76983, 0.0003032 ]);
    anomaly = poly (centuries, [ 357.52910, 35999.05030, -0.0001559, -0.00000048 ]);
    eccentricity = poly (centuries, [ 0.016708617, -0.000042037, -0.0000001236 ]);
    varepsilon = obliquity (tee);
    y0 = dtan (varepsilon / 2);
    y0 *= y0;

    equation = (0.5 / Math.PI) * (y0 * dsin (2 * lambda) +
                -2 * eccentricity * dsin (anomaly) +
                4 * eccentricity * y0 * dsin (anomaly) * dcos (2 * lambda) +
                -0.5 * y0 * y0 * dsin (4 * lambda) +
                -1.25 * eccentricity * eccentricity * dsin (2 * anomaly));

    return Math.sign (equation) * Math.min (Math.abs (equation), 0.5);
  }

  astro.equationOfTime = equationOfTime;

  // Return the aberration at moment, tee.
  function aberration (tee) {
      var centuries = julianCenturies (tee);

      return 0.0000974 * dcos (177.63 + 35999.01848 * centuries) - 0.005575;
  }

  astro.aberration = aberration;

  /*
  Return the longitude of sun at moment 'tee'.
    Adapted from 'Planetary Programs and Tables from -4000 to +2800'
    by Pierre Bretagnon and Jean_Louis Simon, Willmann_Bell, Inc., 1986.
    See also pag 166 of 'Astronomical Algorithms' by Jean Meeus, 2nd Ed 1998,
    with corrections Jun 2005.
  */
  function solarLongitude (tee) {
    var centuries, lam;

    centuries = julianCenturies (tee);
    lam = 282.7771834 + 36000.76953744 * centuries + 0.000005729577951308232 *
         sigma ([
             astro.constants.SOLAR_LONGITUDE_COEFFICIENTS,
             astro.constants.SOLAR_LONGITUDE_ADDENDS,
             astro.constants.SOLAR_LONGITUDE_MULTIPLIERS ], function (x0, y0, z0) {
                return x0 * dsin (y0 + z0 * centuries);
             }
    );

    return mod (lam + aberration (tee) + nutation (tee), 360);
  }

  astro.solarLongitude = solarLongitude;

  return exports;
}(Calendrical || {}));
