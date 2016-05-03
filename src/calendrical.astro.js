/* eslint
  func-style: [ "error", "declaration" ],
  max-statements: [ "error", 16, { "ignoreTopLevelFunctions": true } ],
  no-use-before-define: [ "error", { "functions": true, "classes": true } ] */

"use strict";

var Calendrical = (function (exports) {
    var astro, calendar;

  exports.astro = exports.astro || {};
  exports.calendar = exports.calendar || {};

  astro = exports.astro;
  calendar = exports.calendar;

  // astro.constants
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
    WEEKDAYS: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],

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


  // Pad a string to a given length with a given fill character.
  astro.pad = function (str, length, filler) {
    var s0 = str.toString ();

    while (s0.length < length) {
      s0 = filler + s0;
    }

    return s0;
  };

  /**
   * arc seconds to radians
   * @param {float} arcs arc seconds
   * @return {float} radians value
   */
  function astor (arcs) {
    return arcs * Math.PI / (180.0 * 3600.0);
  }

  astro.astor = astor;

  /**
   * degrees to radians
   * @param {float} degrees angle in degrees
   * @return {float} radians value
   */
  function dtr (degrees) {
    return degrees * Math.PI / 180.0;
  }

  astro.dtr = dtr;

  /**
   * radians to degrees
   * @param {float} radians angle in radians
   * @return {float} degrees value
   */
  function rtd (radians) {
    return radians * 180.0 / Math.PI;
  }

  astro.rtd = rtd;

  /**
   * angle from degrees:minutes:seconds
   * @param {float} degrees angle integral portion
   * @param {float} minutes angle minutes fraction
   * @param {float} seconds angle seconds fraction
   * @return {float} angle
   */
  function angle (degrees, minutes, seconds) {
      return degrees + (minutes + seconds / 60) / 60;
  }

  astro.angle = angle;

  /**
   * Range reduce angle in degrees
   * @param {float} alpha angle
   * @return {float} degrees
   */
  function fixangle (alpha) {
    return alpha - 360.0 * Math.floor (alpha / 360.0);
  }

  astro.fixangle = fixangle;

  /**
   * Range reduce angle in radians
   * @param {float} alpha angle
   * @return {float} radians
   */
  function fixangr (alpha) {
    return alpha - 2 * Math.PI * Math.floor (alpha / (2 * Math.PI));
  }

  astro.fixangr = fixangr;

  /**
   * Sine of an angle in degrees
   * @param {float} theta angle
   * @return {float} degrees
   */
  function dsin (theta) {
    return Math.sin (dtr (theta));
  }

  astro.dsin = dsin;

  /**
   * Cosine of an angle in degrees
   * @param {float} theta angle
   * @return {float} degrees
   */
  function dcos (theta) {
    return Math.cos (dtr (theta));
  }

  astro.dcos = dcos;

  /**
   * Tangens of an angle in degrees
   * @param {float} theta angle
   * @return {float} degrees
   */
  function dtan (theta) {
    return Math.tan (dtr (theta));
  }

  astro.dtan = dtan;

  /**
   * Modulus function which works for non-integers
   * @param {float} amount dividend
   * @param {float} numerator numerator
   * @return {float} modulo value
   */
  function mod (amount, numerator) {
    return amount - numerator * Math.floor (amount / numerator);
  }

  astro.mod = mod;

  /**
   * Modulus function which returns numerator if modulus is zero
   * @param {float} amount dividend
   * @param {float} numerator numerator
   * @return {float} modulo value
   */
  function amod (amount, numerator) {
    return mod (amount - 1, numerator) + 1;
  }

  astro.amod = amod;

  /**
   * Return first integer greater or equal to initial index iter,
   * such that condition predicate holds.
   * @param {int} iter iterator
   * @param {function} predicate boolean function applied to each iter until true
   * @return {int} iterator satisfying the predicate
   */
  function next (iter, predicate) {
    return predicate (iter) ? iter : next (iter + 1, predicate);
  }

  astro.next = next;

  /**
   * Return last integer greater or equal to initial index iter,
   * such that condition predicate holds.
   * @param {int} iter iterator
   * @param {function} predicate boolean function applied to each iter until false
   * @return {int} iterator satisfying the predicate
   */
  function final (iter, predicate) {
    return predicate (iter) ? final (iter + 1, predicate) : iter - 1;
  }

  astro.final = final;

  /**
   * Calculate polynomial with coefficients 'a' at point x.
   * The polynomial is  a[0] + a[1] * x + a[2] * x^2 + ...a[n-1]x^(n-1)
   * the result is      a[0] + x(a[1] + x(a[2] +...+ x(a[n-1])...)
   * @param {float} term denotes x in the formula above
   * @param {float[]} array denotes a[] in the formula above
   * @return {float} polynomial value
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

  /**
   * Return the sum of applying the function func for indices i [ 1 .. n ]
   * running simultaneously thru columns c [ 1 .. n ].
   * Matrix matrix is of the form [ [i1 c1] [i1 c2] .. [ in cn ] ].
   * @param {float[]} matrix 2-dimensional array of floats
   * @param {function} func application function
   * @return {float} sum of products
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

  /**
   * Return standard time from teeRomU in universal time at location
   * @param {float} teeRomU moment in time
   * @param {location} location geographic location
   * @return {float} converted time
   */
  function universalToStandard (teeRomU, location) {
      return teeRomU + location[3];
  }

  astro.universalToStandard = universalToStandard;

  /**
   * Return universal time from teeRomU in standard time at location
   * @param {float} teeRomS moment in time
   * @param {location} location geographic location
   * @return {float} converted time
   */
  function standardToUniversal (teeRomS, location) {
      return teeRomS - location[3];
  }

  astro.standardToUniversal = standardToUniversal;

  /**
   * Return the difference between UT and local mean time at longitude
   * 'phi' as a fraction of a day
   * @param {float} phi geo-location
   * @return {float} fraction of a day
   */
  function longitudeToZone (phi) {
      return phi / 360;
  }

  astro.longitudeToZone = longitudeToZone;

  /**
   * Return local time from teeRomU in universal time at location
   * @param {float} teeRomU moment in time
   * @param {location} location geographic location
   * @return {float} converted time
   */
  function universalToLocal (teeRomU, location) {
      return teeRomU + longitudeToZone (location[1]);
  }

  /**
   * Return universal time from teeEll in local time at location
   * @param {float} teeEll moment in time
   * @param {location} location geographic location
   * @return {float} converted time
   */
  function localToUniversal (teeEll, location) {
      return teeEll - longitudeToZone (location[1]);
  }

  astro.localToUniversal = localToUniversal;

  /**
   * Return standard time from teeEll in local time at location
   * @param {float} teeEll moment in time
   * @param {location} location geographic location
   * @return {float} converted time
   */
  function localToStandard (teeEll, location) {
    return universalToStandard (localToUniversal (teeEll, location), location);
  }

  astro.localToStandard = localToStandard;

  /**
   * Return local time from teeRomS in standard time at location
   * @param {float} teeRomS moment in time
   * @param {location} location geographic location
   * @return {float} converted time
   */
  function standardToLocal (teeRomS, location) {
      return universalToLocal (standardToUniversal (teeRomS, location), location);
  }

  astro.standardToLocal = standardToLocal;

  /**
   * Return Dynamical Time minus Universal Time (in days) for moment, tee.
   * Adapted from "Astronomical Algorithms" by Jean Meeus, Willmann_Bell, Inc., 1991.
   * @param {float} tee moment in time
   * @return {float} converted time
   */
  function ephemerisCorrection (tee) {
      var year, centuries, result;

      year = calendar.jdToGregorianYear (Math.floor (tee + calendar.constants.gregorian.EPOCH));

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

  /**
   * Return Dynamical Time at Universal moment tee
   * @param {float} tee moment in time
   * @return {float} converted time
   */
  function universalToDynamical (tee) {
      return tee + ephemerisCorrection (tee);
  }

  astro.universalToDynamical = universalToDynamical;

  /**
   * Return Julian centuries since 2000 at moment tee.
   * @param {float} tee moment in time
   * @return {int} number of centuries relative to 2000-01-01
   */
  function julianCenturies (tee) {
    return (universalToDynamical (tee) - calendar.constants.J2000) / 36525;
  }

  astro.julianCenturies = julianCenturies;

  /**
   * Calculate the obliquity of the ecliptic for a given Julian date.
   * This uses Laskar's tenth-degree polynomial fit (*J.
   * Laskar, **Astronomy and Astrophysics**, Vol. 157, page 68 [1986]*) which is
   * accurate to within 0.01 arc second between AD 1000 and AD 3000, and within
   * a few seconds of arc for +/-10000 years around AD 2000. If we're outside the
   * range in which this fit is valid (deep time) we simply return the J2000
   * value of the obliquity, which happens to be almost precisely the mean.
   * @param {float} jd Julian day number
   * @return {float} obliquity at moment jd
   */
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

  /**
   * Compute equation of time for a given moment.
   * Return the equation of time (as fraction of day) for moment, tee.
   * Adapted from "Astronomical Algorithms" by Jean Meeus, Willmann_Bell, Inc., 1991.
   * @param {float} tee moment in time
   * @return {float} equation of time
   */
  function equationOfTime (tee) {
    var centuries, lambda, anomaly, eccentricity, varepsilon, y0, equation;

    centuries = julianCenturies (tee);

    lambda = poly (centuries, [ 280.46645, 36000.76983, 0.0003032 ]);
    anomaly = poly (centuries, [ 357.52910, 35999.05030, -0.0001559, -0.00000048 ]);
    eccentricity = poly (centuries, [ 0.016708617, -0.000042037, -0.0000001236 ]);
    varepsilon = obliquity (tee);
    y0 = dtan (varepsilon / 2);
    y0 *= y0;

    equation = 0.5 / Math.PI * (y0 * dsin (2 * lambda) +
               -2 * eccentricity * dsin (anomaly) +
               4 * eccentricity * y0 * dsin (anomaly) * dcos (2 * lambda) +
               -0.5 * y0 * y0 * dsin (4 * lambda) +
               -1.25 * eccentricity * eccentricity * dsin (2 * anomaly));

    return Math.sign (equation) * Math.min (Math.abs (equation), 0.5);
  }

  astro.equationOfTime = equationOfTime;

  /**
   * Return sundial time at local time tee at location, location
   * @param {float} tee moment in time
   * @param {location} location geographic location
   * @return {float} converted time
   */
  function localToApparent (tee, location) {
      return tee + equationOfTime (localToUniversal (tee, location));
  }

  astro.localToApparent = localToApparent;

  /**
   * Return local time from sundial time tee at location, location
   * @param {float} tee moment in time
   * @param {location} location geographic location
   * @return {float} converted time
   */
  function apparentToLocal (tee, location) {
      return tee - equationOfTime (localToUniversal (tee, location));
  }

  astro.apparentToLocal = apparentToLocal;

  /**
   * Return standard time on fixed date date, of midday at location location
   * @param {float} date fixed
   * @param {location} location geographic location
   * @return {float} converted time
   */
  function midDay (date, location) {
      return localToStandard (apparentToLocal (date + 0.5, location), location);
  }

  astro.midDay = midDay;

  /**
   * Return Universal moment from Dynamical time, tee
   * @param {float} tee moment in time
   * @return {float} converted time
   */
  function dynamicalToUniversal (tee) {
      return tee - ephemerisCorrection (tee);
  }

  astro.dynamicalToUniversal = dynamicalToUniversal;

  /**
   * Convert Julian time to hour, minutes, and seconds, returned as a three-element array
   * @param {float} jd Julian day number
   * @return {float[]} day portion of Julian day number, as array [ hours, minutes, seconds ]
   */
  function jhms (jd) {
    var ij, j2;

    // Astronomical to civil
    j2 = jd + 0.5;
    ij = (j2 - Math.floor (j2)) * 86400.0 + 0.5;

    return [
      Math.floor (ij / 3600),
      Math.floor (ij / 60 % 60),
      Math.floor (ij % 60)
    ];
  }

  astro.jhms = jhms;

  /**
   * Calculate day of week from Julian day
   * @param {float} jd Julian day number
   * @return {int} week day
   */
  function jwday (jd) {
    return mod (Math.floor (jd - 0.5), 7);
  }

  astro.jwday = jwday;

  /**
   * Return the longitudinal nutation at moment tee
   * @param {float} tee moment in time
   * @return {float} nutation at tee
   */
  function nutation (tee) {
      var centuries = julianCenturies (tee),
          capA = poly (centuries, [ 124.90, -1934.134, 0.002063 ]),
          capB = poly (centuries, [ 201.11, 72001.5377, 0.00057 ]);

      return -0.004778  * dsin (capA) +
             -0.0003667 * dsin (capB);
  }

  astro.nutation = nutation;

  /**
   * Determine the difference, in seconds, between Dynamical time and Universal time.
   * @param {int} year Gregorian year
   * @return {float} time difference
   */
  function deltat (year) {
    var dt, fraction, index, t0;

    if (year >= 1620 && year <= 2000) {
      index = Math.floor ((year - 1620) / 2);
      // Fractional part of year
      fraction = (year - 1620) / 2 - index;

      return astro.constants.DELTA_T_TAB[index] +
            (astro.constants.DELTA_T_TAB[index + 1] -
             astro.constants.DELTA_T_TAB[index]) * fraction;
    }

    t0 = (year - 2000) / 100;

    if (year < 948) {
        return 2177 + 497 * t0 + 44.1 * t0 * t0;
    }

    dt = 102 + 102 * t0 + 25.3 * t0 * t0;

    if (year > 2000 && year < 2100) {
      dt += 0.37 * (year - 2100);
    }

    return dt;
  }

  astro.deltat = deltat;

  /**
   * Determine the Julian Ephemeris Day of an equinox or solstice.
   * The `which` argument selects the event to be computed:
   *
   * 0 - March equinox
   * 1 - June solstice
   * 2 - September equinox
   * 3 - December solstice
   * @param {int} year the Gregorian year
   * @param {int} which event
   * @return {float} moment in time when event occurs
   */
  function equinox (year, which) {
    var deltaL, index, j0, JDE0, JDE0tab, sum, t0, w0, y0;

    // Initialise terms for mean equinox and solstices. We have two sets:
    // one for years prior to 1000 and a second for subsequent years.
    if (year < 1000) {
      JDE0tab = astro.constants.JDE0_TAB_1000;
      y0 = year / 1000;
    } else {
      JDE0tab = astro.constants.JDE0_TAB_2000;
      y0 = (year - 2000) / 1000;
    }

    JDE0 = JDE0tab[which][0] +
      JDE0tab[which][1] * y0 +
      JDE0tab[which][2] * y0 * y0 +
      JDE0tab[which][3] * y0 * y0 * y0 +
      JDE0tab[which][4] * y0 * y0 * y0 * y0;

    t0     = (JDE0 - 2451545.0) / 36525;
    w0     = 35999.373 * t0 - 2.47;
    deltaL = 1 + 0.0334 * dcos(w0) + 0.0007 * dcos(2 * w0);

    // Sum the periodic terms for time t0
    sum = index = j0 = 0;
    while (index < 24) {
      sum += astro.constants.EQUINOX_P_TERMS[j0] * dcos (astro.constants.EQUINOX_P_TERMS[j0 + 1] +
          astro.constants.EQUINOX_P_TERMS[j0 + 2] * t0);
      j0 += 3;
      index += 1;
    }

    return JDE0 + sum * 0.00001 / deltaL;
  }

  astro.equinox = equinox;

  /**
   * Return the aberration at moment, tee.
   * @param {float} tee moment in time
   * @return {float} aberration
   */
  function aberration (tee) {
      var centuries = julianCenturies (tee);

      return 0.0000974 * dcos (177.63 + 35999.01848 * centuries) - 0.005575;
  }

  astro.aberration = aberration;

  /**
   * Return the longitude of sun at moment 'tee'.
   * Adapted from 'Planetary Programs and Tables from -4000 to +2800'
   * by Pierre Bretagnon and Jean_Louis Simon, Willmann_Bell, Inc., 1986.
   * See also pag 166 of 'Astronomical Algorithms' by Jean Meeus, 2nd Ed 1998,
   * with corrections Jun 2005.
   * @param {float} tee moment in time
   * @return {float} solar longitude
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

  /**
   * Return approximate moment at or before tee when solar longitude
   * just exceeded lam degrees.
   * @param {float} lam degrees
   * @param {float} tee moment in time
   * @return {float} longitude
   */
  function estimatePriorSolarLongitude (lam, tee) {
      var rate = calendar.constants.MEAN_TROPICAL_YEAR / 360,
          tau = tee - rate * mod (solarLongitude (tee) - lam, 360),
          capDelta = mod (solarLongitude (tau) - lam + 180, 360) - 180;

      return Math.min (tee, tau - rate * capDelta);
  }

  astro.estimatePriorSolarLongitude = estimatePriorSolarLongitude;

  return exports;
}(Calendrical || {}));
