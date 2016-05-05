/* eslint
  func-style: [ "error", "declaration" ],
  max-statements: [ "error", 26, { "ignoreTopLevelFunctions": true } ],
  no-use-before-define: [ "error", { "functions": true, "classes": true } ],
  max-params: [ "error", 5 ] */

"use strict";

var Calendrical = (function (exports) {
  var astro, calendar, priv;

  exports.calendar = exports.calendar || {};

  // Aliases
  astro = exports.astro;
  calendar = exports.calendar;
  priv = {};

  // Is a given year in the Gregorian calendar a leap year?
  calendar.leapGregorian = function (year) {
    return year % 4 === 0 &&
      (year % 100 !== 0 || year % 400 === 0);
  };

  // Determine Julian day number from Gregorian calendar date
  calendar.gregorianToJd = function (year, month, day) {
      var y1 = year - 1;

    return this.constants.gregorian.EPOCH - 1 + 365 * y1 +
      Math.floor (y1 / 4) -
      Math.floor (y1 / 100) +
      Math.floor (y1 / 400) +
      Math.floor ((367 * month - 362) / 12 +
        (month <= 2 ? 0 : this.leapGregorian (year) ? -1 : -2) +
        day);
  };

  calendar.jdToGregorianYear = function (jd) {
    var wjd, depoch, quadricent, dqc, cent, dcent, quad, dquad, yindex, year;

    wjd        = Math.floor (jd - 0.5) + 0.5;
    depoch     = wjd - this.constants.gregorian.EPOCH;
    quadricent = Math.floor (depoch / 146097);
    dqc        = astro.mod (depoch, 146097);
    cent       = Math.floor (dqc / 36524);
    dcent      = astro.mod (dqc, 36524);
    quad       = Math.floor (dcent / 1461);
    dquad      = astro.mod (dcent, 1461);
    yindex     = Math.floor (dquad / 365);
    year       = quadricent * 400 + cent * 100 + quad * 4 + yindex;

    if (cent !== 4 && yindex !== 4) {
        year += 1;
    }

    return year;
  };

  // Calculate Gregorian calendar date from Julian day
  calendar.jdToGregorian = function (jd) {
    var wjd, year, yearday, leapadj, month, day;

    wjd = Math.floor (jd - 0.5) + 0.5;
    year = this.jdToGregorianYear (jd);
    yearday = wjd - this.gregorianToJd (year, 1, 1);
    leapadj = wjd < this.gregorianToJd (year, 3, 1) ? 0 : this.leapGregorian (year) ? 1 : 2;
    month = Math.floor (((yearday + leapadj) * 12 + 373) / 367);
    day   = wjd - this.gregorianToJd (year, month, 1) + 1;

    return [ year, month, day ];
  };

  calendar.gregorianDateDifference = function (date1, date2) {
      return this.gregorianToJd (date2) - this.gregorianToJd (date1);
  };

  // Return Julian day of given ISO year, week, and day
  calendar.nWeeks = function (weekday, jd, nthweek) {
    var j0 = 7 * nthweek;

    if (nthweek > 0) {
      j0 += this.previousWeekday (weekday, jd);
    } else {
      j0 += this.nextWeekday (weekday, jd);
    }

    return j0;
  };

  calendar.isoToJulian = function (year, week, day) {
    return day + this.nWeeks (0, this.gregorianToJd (year - 1, 12, 28), week);
 };

  // Return array of ISO (year, week, day) for Julian day
  calendar.jdToIso = function (jd) {
    var year, week, day;

    year = this.jdToGregorian (jd - 3)[0];

    if (jd >= this.isoToJulian (year + 1, 1, 1)) {
        year += 1;
    }

    week = Math.floor ((jd - this.isoToJulian (year, 1, 1)) / 7) + 1;
    day  = astro.jwday (jd);

    if (day === 0) {
        day = 7;
    }

    return [ year, week, day ];
  };

  // Return Julian day of given ISO year, and day of year
  calendar.isoDayToJulian = function (year, day) {
    return day - 1 + this.gregorianToJd (year, 1, 1);
  };

  // Return array of ISO (year, day_of_year) for Julian day
  calendar.jdToIsoDay = function (jd) {
    var year, day;

    year = this.jdToGregorian (jd)[0];
    day = Math.floor (jd - this.gregorianToJd (year, 1, 1)) + 1;

    return [ year, day ];
  };

  // Determine Julian day number from Julian calendar date
  calendar.leapJulian = function (year) {
    return astro.mod (year, 4) === (year > 0 ? 0 : 3);
  };

  calendar.julianToJd = function (year, month, day) {
      var y0 = year,
          m0 = month;

    // Adjust negative common era years to the zero-based notation we use.
    if (y0 < 1) {
        y0 += 1;
    }

    // Algorithm as given in *Meeus, **Astronomical Algorithms**, Chapter 7, page 61*
    if (m0 <= 2) {
      y0 -= 1;
      m0 += 12;
    }

    return Math.floor (365.25 * (y0 + 4716)) +
      Math.floor (30.6001 * (m0 + 1)) +
      day - 1524.5;
  };

  // Calculate Julian calendar date from Julian day
  calendar.jdToJulian = function (jd) {
    var b0, c0, d0, e0, year, month, day;

    b0 = Math.floor (jd + 0.5) + 1524;
    c0 = Math.floor ((b0 - 122.1) / 365.25);
    d0 = Math.floor (365.25 * c0);
    e0 = Math.floor ((b0 - d0) / 30.6001);

    month = Math.floor (e0 < 14 ? e0 - 1 : e0 - 13);
    year = Math.floor (month > 2 ? c0 - 4716 : c0 - 4715);
    day = b0 - d0 - Math.floor (30.6001 * e0);

    // If year is less than 1, subtract one to convert from
    // a zero based date system to the common era system in
    // which the year -1 (1 B.C.E) is followed by year 1 (1 C.E.).
    if (year < 1) {
        year -= 1;
    }

    return [ year, month, day ];
  };

  // Determine Julian day from Hebrew date
  //
  // Is a given Hebrew year a leap year?
  calendar.hebrewLeap = function (year) {
    return astro.mod (year * 7 + 1, 19) < 7;
  };

  // How many months are there in a Hebrew year (12 = normal, 13 = leap)
  calendar.hebrewYearMonths = function (year) {
    return this.hebrewLeap (year) ? 13 : 12;
  };

  // Test for delay of start of new year and to avoid
  // Sunday, Wednesday, and Friday as start of the new year.
  calendar.hebrewDelay1 = function (year) {
    var months, day, parts;

    months = Math.floor ((235 * year - 234) / 19);
    parts  = 12084 + 13753 * months;
    day    = months * 29 + Math.floor (parts / 25920);

    if (astro.mod (3 * (day + 1), 7) < 3) {
      day += 1;
    }

    return day;
  };

  // Check for delay in start of new year due to length of adjacent years
  calendar.hebrewDelay2 = function (year) {
    var last, present, next;

    last    = this.hebrewDelay1 (year - 1);
    present = this.hebrewDelay1 (year);
    next    = this.hebrewDelay1 (year + 1);

    return next - present === 356 ? 2 : present - last === 382 ? 1 : 0;
  };

  // How many days are in a Hebrew year?
  calendar.hebrewYearDays = function (year) {
    return this.hebrewToJd (year + 1, 7, 1) - this.hebrewToJd (year, 7, 1);
  };

  // How many days are in a given month of a given year
  calendar.hebrewMonthDays = function (year, month) {
    // First of all, dispose of fixed-length 29 day months
    if (month === 2 || month === 4 || month === 6 || month === 10 || month === 13) {
      return 29;
    }

    // If it's not a leap year, Adar has 29 days
    if (month === 12 && !this.hebrewLeap (year)) {
      return 29;
    }

    // If it's Heshvan, days depend on length of year
    if (month === 8 && astro.mod (this.hebrewYearDays (year), 10) !== 5) {
      return 29;
    }

    // Similarly, Kislev varies with the length of year
    if (month === 9 && astro.mod (this.hebrewYearDays (year), 10) === 3) {
      return 29;
    }

    // Nope, it's a 30 day month
    return 30;
  };

  // Finally, wrap it all up into...
  calendar.hebrewToJd = function (year, month, day) {
    var jd, mon, months;

    months = this.hebrewYearMonths (year);

    jd = this.constants.hebrew.EPOCH + this.hebrewDelay1 (year) +
      this.hebrewDelay2 (year) + day + 1;

    if (month < 7) {
      for (mon = 7; mon <= months; mon += 1) {
        jd += this.hebrewMonthDays (year, mon);
      }
      for (mon = 1; mon < month; mon += 1) {
        jd += this.hebrewMonthDays (year, mon);
      }
    } else {
      for (mon = 7; mon < month; mon += 1) {
        jd += this.hebrewMonthDays (year, mon);
      }
    }

    return jd;
  };

  // Convert Julian date to Hebrew date
  // This works by making multiple calls to
  // the inverse function, and is this very slow.
  calendar.jdToHebrew = function (jd) {
    var jd0, year, month, day, index, count, first;

    jd0   = Math.floor (jd) + 0.5;
    count = Math.floor ((jd0 - this.constants.hebrew.EPOCH) * 98496.0 / 35975351.0);
    year  = count - 1;

    for (index = count; jd0 >= this.hebrewToJd (index, 7, 1); index += 1) {
      year += 1;
    }

    first = jd0 < this.hebrewToJd (year, 1, 1) ? 7 : 1;
    month = first;

    for (index = first; jd0 > this.hebrewToJd (year, index, this.hebrewMonthDays (year, index)); index += 1) {
      month += 1;
    }

    day = jd0 - this.hebrewToJd (year, month, 1) + 1;

    return [ year, month, day ];
  };

  // Determine Julian day and fraction of the
  // September equinox at the Paris meridian in
  // a given Gregorian year.
  calendar.equinoxeAParis = function (year) {
    var equJED, equJD, equAPP, equParis, dtParis;

    // September equinox in dynamical time
    equJED = astro.equinox (year, 2);

    // Correct for delta T to obtain Universal time
    equJD = equJED - astro.deltat (year) / (24 * 60 * 60);

    // Apply the equation of time to yield the apparent time at Greenwich
    equAPP = equJD + astro.equationOfTime (equJED);

    // Finally, we must correct for the constant difference between
    // the Greenwich meridian and that of Paris, 2°20'15" to the East.
    dtParis = (2 + 20 / 60.0 + 15 / (60 * 60.0)) / 360;
    equParis = equAPP + dtParis;

    return equParis;
  };

  // Calculate Julian day during which the
  // September equinox, reckoned from the Paris
  // meridian, occurred for a given Gregorian year.
  calendar.parisEquinoxeJd = function (year) {
    var ep, epg;

    ep  = this.equinoxeAParis (year);
    epg = Math.floor (ep - 0.5) + 0.5;

    return epg;
  };

  // Determine the year in the French
  // revolutionary calendar in which a given Julian day falls.
  // Returns an array of two elements:
  //
  // **[0]** Année de la Révolution
  // **[1]** Julian day number containing equinox for this year.
  calendar.anneeDaLaRevolution = function (jd) {
    var guess = this.jdToGregorian (jd)[0] - 2,
      lasteq, nexteq, adr;

    lasteq = this.parisEquinoxeJd (guess);

    while (lasteq > jd) {
      guess -= 1;
      lasteq = this.parisEquinoxeJd (guess);
    }

    nexteq = lasteq - 1;

    while (lasteq > jd || jd >= nexteq) {
      lasteq = nexteq;
      guess += 1;
      nexteq = this.parisEquinoxeJd (guess);
    }

    adr = Math.round (
        (lasteq - this.constants.french_revolutionary.EPOCH) /
        astro.constants.TROPICAL_YEAR) + 1;

    return [ adr, lasteq ];
  };

  // Calculate date in the French Revolutionary
  // calendar from Julian day. The five or six
  // "sansculottides" are considered a thirteenth
  // month in the results of this function.
  calendar.jdToFrenchRevolutionary = function (jd) {
    var jd0, an, mois, decadi, jour, adr, equinoxe;

    jd0      = Math.floor (jd) + 0.5;
    adr      = this.anneeDaLaRevolution (jd0);
    an       = adr[0];
    equinoxe = adr[1];
    mois     = Math.floor ((jd0 - equinoxe) / 30) + 1;
    jour     = (jd0 - equinoxe) % 30;
    decadi   = Math.floor (jour / 10) + 1;
    jour     = jour % 10 + 1;

    return [ an, mois, decadi, jour ];
  };

  // Obtain Julian day from a given French
  // Revolutionary calendar date.
  calendar.frenchRevolutionaryToJd = function (an, mois, decade, jour) {
    var adr, equinoxe, guess, jd;

    guess = this.constants.french_revolutionary.EPOCH +
           astro.constants.TROPICAL_YEAR * (an - 2);
    adr = [ an - 1, 0 ];

    while (adr[0] < an) {
      adr = this.anneeDaLaRevolution (guess);
      guess = adr[1] + (astro.constants.TROPICAL_YEAR + 2);
    }

    equinoxe = adr[1];
    jd = equinoxe + 30 * (mois - 1) + 10 * (decade - 1) + jour - 1;

    return jd;
  };

  // Is a given year a leap year in the Islamic calendar?
  calendar.leapIslamic = function (year) {
    return (year * 11 + 14) % 30 < 11;
  };

  // Determine Julian day from Islamic date
  calendar.islamicToJd = function (year, month, day) {
    return day +
      Math.ceil (29.5 * (month - 1)) +
      (year - 1) * 354 +
      Math.floor ((3 + 11 * year) / 30) +
      this.constants.islamic.EPOCH - 1;
  };

  // Calculate Islamic date from Julian day
  calendar.jdToIslamic = function (jd) {
    var jd0, year, month, day;

    jd0   = Math.floor (jd) + 0.5;
    year  = Math.floor ((30 * (jd0 - this.constants.islamic.EPOCH) + 10646) / 10631);
    month = Math.min (12, Math.ceil ((jd0 - (29 + this.islamicToJd (year, 1, 1))) / 29.5) + 1);
    day   = jd0 - this.islamicToJd (year, month, 1) + 1;

    return [ year, month, day ];
  };

  // Determine Julian day and fraction of the
  // March equinox at the Tehran meridian in
  // a given Gregorian year.
  calendar.tehranEquinox = function (year) {
    var equJED, equJD, equAPP, equTehran, dtTehran;

    // March equinox in dynamical time
    equJED = astro.equinox (year, 0);

    // Correct for delta T to obtain Universal time
    equJD = equJED - astro.deltat (year) / (24 * 60 * 60);

    // Apply the equation of time to yield the apparent time at Greenwich
    equAPP = equJD + astro.equationOfTime (equJED);

    // Finally, we must correct for the constant difference between
    // the Greenwich meridian andthe time zone standard for
    // Iran Standard time, 52°30' to the East.
    dtTehran  = 52.5 / 360;
    equTehran = equAPP + dtTehran;

    return equTehran;
  };

  // Calculate Julian day during which the
  // March equinox, reckoned from the Tehran
  // meridian, occurred for a given Gregorian year.
  calendar.tehranEquinoxJd = function (year) {
    var ep, epg;

    ep  = this.tehranEquinox (year);
    epg = Math.floor (ep - 0.5) + 0.5;

    return epg;
  };

  // Determine the year in the astronomical calendar in which a
  // given Julian day falls, given the epoch.
  // Returns an array of two elements:
  //
  // **[0]** Persian year
  // **[1]** Julian day number containing equinox for this year.
  calendar.lastTehranEquinox = function (jd, epoch) {
    var guess = this.jdToGregorian (jd)[0] - 2,
      lasteq, nexteq, adr;

    lasteq = this.tehranEquinoxJd (guess);

    while (lasteq > jd) {
      guess -= 1;
      lasteq = this.tehranEquinoxJd (guess);
    }

    nexteq = lasteq - 1;

    while (lasteq > jd || jd >= nexteq) {
      lasteq = nexteq;
      guess += 1;
      nexteq = this.tehranEquinoxJd (guess);
    }

    adr = Math.round ((lasteq - epoch) / astro.constants.TROPICAL_YEAR) + 1;

    return [ adr, lasteq ];
  };

  // Obtain Julian day from a given Persian
  // arithmetic calendar date.
  calendar.persianArithmeticToJd = function (year, month, day) {
      var y0     = year > 0 ? year - 474 : year - 473,
          y1     = astro.mod (y0, 2820) + 474,
          offset = month <= 7 ? 31 * (month - 1) : 30 * (month - 1) + 6;

      return this.constants.persian.EPOCH - 1 +
              1029983 * Math.floor (y0 / 2820) +
              365 * (y1 - 1) +
              Math.floor ((31 * y1 - 5) / 128) +
              offset +
              day;
  };

  // Determine the year in the Persian arithmetic calendar in which a
  // given Julian day falls.
  calendar.jdToPersianArithmeticYear = function (jd) {
    var d0, n2820, d1, y2820, year;

    d0    = jd - this.persianArithmeticToJd (475, 1, 1);
    n2820 = Math.floor (d0 / 1029983);
    d1    = astro.mod (d0, 1029983);
    y2820 = d1 === 1029982 ? 2820 : Math.floor ((128 * d1 + 46878) / 46751);
    year  = 474 + 2820 * n2820 + y2820;

    return year > 0 ? year : year - 1;
  };

  // Calculate date in the Persian astronomical
  // calendar from Julian day.
  calendar.jdToPersianArithmetic = function (jd) {
      var year, month, yDay, day;

      year  = this.jdToPersianArithmeticYear (jd);
      yDay  = jd - this.persianArithmeticToJd (year, 1, 1) + 1;
      //      month = yDay <= 186 ? Math.ceil (yDay / 31) : Math.ceil ((yDay - 6) / 30);
      //      day   = jd - this.persianArithmeticToJd (year, month, 1) + 1;
      if (yDay <= 186) {
          month = Math.ceil (yDay / 31);
          day   = astro.amod (yDay, 31);
      } else {
          yDay -= 6;
          month = Math.ceil (yDay / 30);
          day   = astro.amod (yDay, 30);
      }

      return [ year, month, day ];
  };

  // Is a given year a leap year in the Persian arithmetic alendar?
  calendar.leapPersianArithmetic = function (year) {
      var y0 = year > 0 ? year - 474 : year - 473,
          y1 = astro.mod (y0, 2820) + 474;

      return astro.mod ((y1 + 38) * 31, 128) < 31;
  };

  // Return  Universal time of midday on fixed date, date, in Tehran
  calendar.midDayInTehran = function (date) {
      return astro.standardToUniversal (
          astro.midDay (date, this.constants.persian.TEHRAN_LOCATION),
          this.constants.persian.TEHRAN_LOCATION);
  };

  // Return the fixed date of Astronomical Persian New Year on or before fixed date
  calendar.persianNewYearOnOrBefore = function (date) {
      var approx = astro.estimatePriorSolarLongitude (this.constants.SPRING, this.midDayInTehran (date));

      return astro.next (Math.floor (approx) - 1, function (day) {
          return astro.solarLongitude (calendar.midDayInTehran (day)) <= calendar.constants.SPRING + 2;
      });
  };

  // Determine Julian day from Persian astronomical date
  calendar.persianToJd = function (year, month, day) {
    var temp, nowRuz;

    temp = year > 0 ? year - 1 : year;
    nowRuz = this.persianNewYearOnOrBefore (this.constants.persian.EPOCH_RD + 180 +
        Math.floor (this.constants.MEAN_TROPICAL_YEAR * temp));

    return nowRuz - 1 + day +
            ((month <= 7) ? 31 * (month - 1) : 30 * (month - 1) + 6) +
            this.constants.J0000;
  };

  // Calculate Persian date from Julian day
  calendar.jdToPersian = function (jd) {
    var year, month, day, depoch, cycle, cyear, ycycle,
      aux1, aux2, yday;

    depoch = jd - this.persianToJd (475, 1, 1);
    cycle  = Math.floor (depoch / 1029983);
    cyear  = astro.mod (depoch, 1029983);

    if (cyear === 1029982) {
      ycycle = 2820;
    } else {
      aux1 = Math.floor (cyear / 366);
      aux2 = astro.mod (cyear, 366);
      ycycle = Math.floor ((2134 * aux1 + 2816 * aux2 + 2815) / 1028522) + aux1 + 1;
    }

    year = ycycle + 2820 * cycle + 474;

    if (year <= 0) {
        year -= 1;
    }

    yday  = jd - this.persianToJd (year, 1, 1) + 1;

    if (yday <= 186) {
        month = Math.ceil (yday / 31);
        day   = astro.amod (yday, 31);
    } else {
        yday -= 6;
        month = Math.ceil (yday / 30);
        day   = astro.amod (yday, 30);
    }

    return [ year, month, day ];
  };

  // Is a given year a leap year in the Persian
  // astronomical calendar?
  calendar.leapPersian = function (year) {
    return this.persianToJd (year + 1, 1, 1) -
      this.persianToJd (year, 1, 1) > 365;
  };

  // Determine Julian day from Mayan long count
  calendar.mayanCountToJd = function (baktun, katun, tun, uinal, kin) {
    return this.constants.mayan.COUNT_EPOCH +
      baktun * 144000 +
      katun * 7200 +
      tun * 360 +
      uinal * 20 +
      kin;
  };

  // Calculate Mayan long count from Julian day
  calendar.jdToMayanCount = function (jd) {
    var d0, baktun, katun, tun, uinal, kin;

    d0     = Math.floor (jd) + 0.5 - this.constants.mayan.COUNT_EPOCH;
    baktun = Math.floor (d0 / 144000);
    d0     = astro.mod (d0, 144000);
    katun  = Math.floor (d0 / 7200);
    d0     = astro.mod (d0, 7200);
    tun    = Math.floor (d0 / 360);
    d0     = astro.mod (d0, 360);
    uinal  = Math.floor (d0 / 20);
    kin    = astro.mod (d0, 20);

    return [ baktun, katun, tun, uinal, kin ];
  };

  // Determine Mayan Haab "month" and day from Julian day
  calendar.jdToMayanHaab = function (jd) {
    var lcount, day;

    lcount = Math.floor (jd) + 0.5 - this.constants.mayan.COUNT_EPOCH;
    day    = astro.mod (lcount + 8 + (18 - 1) * 20, 365);

    return [ Math.floor (day / 20) + 1, astro.mod (day, 20) ];
  };

  // Determine Mayan Tzolkin "month" and day from Julian day
  calendar.jdToMayanTzolkin = function (jd) {
    var lcount = Math.floor (jd) + 0.5 - this.constants.mayan.COUNT_EPOCH;

    return [ astro.amod (lcount + 20, 20), astro.amod (lcount + 4, 13) ];
  };

  // Determine the year in the Bahai // astronomical calendar in which a
  // given Julian day falls.
  // Returns an array of two elements:
  //
  // **[0]** Bahai year
  // **[1]** Julian day number containing equinox for this year.
  calendar.bahaiYear = function (jd) {
     return this.lastTehranEquinox (jd, this.constants.bahai.EPOCH);
  };

  // Bahai uses same leap rule as Gregorian until 171 Bahai Era
  // From 172 onwards, it uses the Bahai leap year algorithm
  // The year 171 of the Bahai Era corresponds to Gregorian year 2015
  calendar.leapBahai = function (bahaiYear) {
    var gy = 1843 + bahaiYear,
        days, eq1, eq2;

    if (gy < 2015) {
      return this.leapGregorian (gy);
    }

    eq1 = astro.equinox (gy, 0);
    eq1 = Math.floor (eq1 - 0.115192) + 0.5;

    eq2 = astro.equinox (gy + 1, 0);
    eq2 = Math.floor (eq2 - 0.115192) + 0.5;
    days = eq2 - eq1;

    return days > 365;
  };

  // Determine Julian day from Bahai date
  calendar.bahaiToJd = function (major, vahid, year, month, day) {
    var by, gy, jd, leap, yearDays;

    by = 361 * (major - 1) + 19 * (vahid - 1) + year;
    gy = by + this.jdToGregorian (this.constants.bahai.EPOCH)[0] - 1;

    if (by < 172) {
      leap = this.leapGregorian (gy + 1);
      jd = this.gregorianToJd (gy, 3, 20);
    } else {
      leap = this.leapBahai (by);
      jd = this.tehranEquinoxJd (gy);
    }

    if (month === 0) {
        yearDays = 342;
    } else if (month === 19) {
        yearDays = 342 + (leap ? 5 : 4);
    } else {
        yearDays = (month - 1) * 19;
    }

    return jd + yearDays + day;
  };

  // Calculate Bahai date from Julian day
  calendar.jdToBahai = function (jd) {
    var jd0, major, vahid, year, month, day, gy, bstarty, by, bys, days, old, leap, leapDays;

    jd0 = Math.floor (jd - 0.5) + 0.5;
    old = jd0 < this.constants.bahai.EPOCH172;

    if (old) {
      gy      = this.jdToGregorian (jd0)[0];
      leap    = this.leapGregorian (gy + 1);
      bstarty = this.jdToGregorian (this.constants.bahai.EPOCH)[0];
      bys     = gy - (bstarty + (this.gregorianToJd (gy, 1, 1) <= jd &&
                    jd <= this.gregorianToJd (gy, 3, 20) ? 1 : 0)) + 1;
    } else {
      by      = this.bahaiYear (jd0);
      bys     = by[0];
      leap    = this.leapBahai (bys);
      days    = jd0 - by[1];
    }

    major     = Math.floor (bys / 361) + 1;
    vahid     = Math.floor (astro.mod (bys - 1, 361) / 19) + 1;
    year      = astro.amod (bys, 19);
    leapDays  = leap ? 5 : 4;

    if (old) {
      days    = jd0 - this.bahaiToJd (major, vahid, year, 1, 1) + 1;
    }

    if (days <= 18 * 19) {
        month = 1 + Math.floor ((days - 1) / 19);
        day   = astro.amod (days, 19);
    } else if (days > 18 * 19 + leapDays) {
        month = 19;
        day   = astro.amod (days - leapDays - 1, 19);
    } else {
        month = 0;
        day   = days - 18 * 19;
    }

    return [ major, vahid, year, month, day ];
  };

  priv.jdToHinduDayCount = function (jd) {
     return jd - calendar.constants.hindu.EPOCH;
  };

  calendar.jdToHinduSolarOld = function (jd) {
     var sun, year, month, day;

     sun = priv.jdToHinduDayCount (jd) + 0.25;
     year = Math.floor (sun / this.constants.ARYA_SOLAR_YEAR);
     month = astro.mod (Math.floor (sun / this.constants.ARYA_SOLAR_MONTH), 12) + 1;
     day = Math.floor (astro.mod (sun, this.constants.ARYA_SOLAR_MONTH)) + 1;

     return [ year, month, day ];
  };

  calendar.hinduSolarOldToJd = function (date) {
    var year, month, day;

    year = date[0];
    month = date[1];
    day = date[2];

    return Math.ceil (
        this.constants.hindu.EPOCH +
        year * this.constants.ARYA_SOLAR_YEAR +
        (month - 1) * this.constants.ARYA_SOLAR_MONTH +
        day - 0.75
    ) - 0.5;
  };

  calendar.jdToHinduLunarOld = function (jd) {
     var sun, newMoon, leap, year, month, day;

     sun = priv.jdToHinduDayCount (jd) + 0.25;
     newMoon = sun - astro.mod (sun, this.constants.ARYA_LUNAR_MONTH);
     leap = this.constants.ARYA_SOLAR_MONTH - this.constants.ARYA_LUNAR_MONTH >=
             astro.mod (newMoon, this.constants.ARYA_SOLAR_MONTH) &&
             astro.mod (newMoon, this.constants.ARYA_SOLAR_MONTH) > 0;
     month = astro.mod (Math.ceil (newMoon / this.constants.ARYA_SOLAR_MONTH), 12) + 1;
     day = astro.mod (Math.floor (sun / this.constants.ARYA_LUNAR_DAY), 30) + 1;
     year = Math.ceil ((newMoon + this.constants.ARYA_SOLAR_MONTH) / this.constants.ARYA_SOLAR_YEAR) - 1;

     return [ year, month, leap, day ];
  };

  calendar.hinduLunarOldToJd = function (date) {
    var year, month, leap, day, mina, lunarNewYear, temp;

    year = date[0];
    month = date[1];
    leap = date[2];
    day = date[3];
    mina = (12 * year - 1) * this.constants.ARYA_SOLAR_MONTH;
    lunarNewYear = this.constants.ARYA_LUNAR_MONTH * Math.ceil (mina / this.constants.ARYA_LUNAR_MONTH);

    temp = Math.ceil ((lunarNewYear - mina) / (this.constants.ARYA_SOLAR_MONTH - this.constants.ARYA_LUNAR_MONTH));

    if (leap || temp > month) {
        temp = month - 1;
    } else {
        temp = month;
    }

    return Math.ceil (
        this.constants.hindu.EPOCH +
        lunarNewYear +
        this.constants.ARYA_LUNAR_MONTH * temp +
        (day - 1) * this.constants.ARYA_LUNAR_DAY -
        0.75) + 0.5;
  };

  // Is an Old Hindu Lunar year leap ?
  calendar.leapHinduLunarOld = function (year) {
      return astro.mod (year * this.constants.ARYA_SOLAR_YEAR - this.constants.ARYA_SOLAR_MONTH,
                 this.constants.ARYA_LUNAR_MONTH) >= 23902504679 / 1282400064;
  };

  priv.hinduEquationOfTime = function (jd) {
      var offset, equationSun;

      offset = priv.hinduSine (priv.hinduMeanPosition (jd, calendar.constants.hindu.ANOMALISTIC_YEAR));
      equationSun = offset * astro.angle (57, 18, 0) * (14 / 360 - Math.abs (offset) / 1080);

      return priv.hinduDailyMotion (jd) / 360 * equationSun / 360 * calendar.constants.hindu.SIDERAL_YEAR;
  };

  priv.hinduAscensionalDifference = function (jd, location) {
      var sinDelta, phi, diurnal, tanPhi, earthSine;

      sinDelta  = 1397 / 3438 * priv.hinduSine (priv.hinduTropicalLongitude (jd));
      phi       = location[0];
      diurnal   = priv.hinduSine (90 + priv.hinduArcsin (sinDelta));
      tanPhi    = priv.hinduSine (phi) / priv.hinduSine (90 + phi);
      earthSine = sinDelta * tanPhi;

      return priv.hinduArcsin (-earthSine / diurnal);
  };

  priv.hinduTropicalLongitude = function (jd) {
      var days, precession;

      days       = Math.floor (jd - calendar.constants.hindu.EPOCH_RD);
      precession = 27 - Math.abs (54 - astro.mod (27 + 108 * 600 / 1577917828 * days, 108));

      return astro.mod (priv.hinduSolarLongitude (jd) - precession, 360);
  };

  priv.hinduRisingSign = function (jd) {
      var index = astro.mod (Math.floor (priv.hinduTropicalLongitude (jd) / 30), 6);

      return [ 1670, 1795, 1935, 1935, 1795, 1670 ][index] / 1800;
  };

  priv.hinduDailyMotion = function (jd) {
      var motion, anomaly, epicycle, entry, step, factor;

      motion   = 360 / calendar.constants.hindu.SIDERAL_YEAR;
      anomaly  = priv.hinduMeanPosition (jd, calendar.constants.hindu.ANOMALISTIC_YEAR);
      epicycle = 14 / 360 - Math.abs (priv.hinduSine (anomaly)) / 1080;
      entry    = Math.floor (anomaly / astro.angle (0, 225, 0));
      step     = priv.hinduSineTable (entry + 1) - priv.hinduSineTable (entry);
      factor   = -3438 / 225 * step * epicycle;

      return motion * (factor + 1);
  };

  priv.hinduSolarSiderealDifference = function (jd) {
      return priv.hinduDailyMotion (jd) * priv.hinduRisingSign (jd);
  };

  priv.hinduSunrise = function (jd) {
      return jd + 0.25 -
              priv.hinduEquationOfTime (jd) +
              1577917828 / 1582237828 / 360 *
               (priv.hinduAscensionalDifference (jd, calendar.constants.hindu.UJJAIN_LOCATION) +
                priv.hinduSolarSiderealDifference (jd) / 4);
  };

  priv.hinduSineTable = function (entry) {
    var exact, error;

    exact = 3438 * astro.sinDeg (entry * astro.angle (0, 225, 0));
    error = 0.215 * Math.sign (exact) * Math.sign (Math.abs (exact) - 1716);

    return Math.round (exact + error) / 3438;
  };

  priv.hinduSine = function (theta) {
    var entry, fraction;

    entry    = theta / astro.angle (0, 225, 0);
    fraction = astro.mod (entry, 1);

    return fraction * priv.hinduSineTable (Math.ceil (entry)) +
            (1 - fraction) * priv.hinduSineTable (Math.floor (entry));
  };

  priv.hinduArcsin = function (amp) {
    var pos, below;

    if (amp < 0) {
      return -priv.hinduArcsin (-amp);
    }

    pos = astro.next (0, function (index) {
      return amp <= priv.hinduSineTable (index);
    });
    below = priv.hinduSineTable (pos - 1);

    return astro.angle (0, 225, 0) *
                (pos - 1 + (amp - below) / (priv.hinduSineTable (pos) - below));
  };

  priv.hinduMeanPosition = function (tee, period) {
      return 360 * astro.mod ((tee - calendar.constants.hindu.CREATION) / period, 1);
  };

  priv.hinduTruePosition = function (tee, period, size, anomalistic, change) {
      var lambda, offset, contraction, equation;

      lambda      = priv.hinduMeanPosition (tee, period);
      offset      = priv.hinduSine (priv.hinduMeanPosition (tee, anomalistic));
      contraction = Math.abs (offset) * change * size;
      equation    = priv.hinduArcsin (offset * (size - contraction));

      return astro.mod (lambda - equation, 360);
  };

  priv.hinduSolarLongitude = function (tee) {
    return priv.hinduTruePosition (
        tee,
        calendar.constants.hindu.SIDERAL_YEAR,
        14 / 360,
        calendar.constants.hindu.ANOMALISTIC_YEAR,
        1 / 42);
  };

  priv.hinduZodiac = function (tee) {
      return Math.floor (priv.hinduSolarLongitude (tee) / 30) + 1;
  };

  // Return the lunar longitude at moment tee.
  priv.hinduLunarLongitude = function (tee) {
    return priv.hinduTruePosition (
        tee,
        calendar.constants.hindu.SIDERAL_MONTH,
        32 / 360,
        calendar.constants.hindu.ANOMALISTIC_MONTH,
        1 / 96);
  };

  // Return the longitudinal distance between the sun and moon at moment tee
  priv.hinduLunarPhase = function (tee) {
      return astro.mod (
          priv.hinduLunarLongitude (tee) - priv.hinduSolarLongitude (tee), 360);
  };

  // Return the phase of moon (tithi) at moment tee in the range [ 1 .. 30 ]
  priv.hinduLunarDayFromMoment = function (tee) {
      return Math.floor (priv.hinduLunarPhase (tee) / 12) + 1;
  };

  priv.hinduCalendarYear = function (tee) {
      return Math.round ((tee - calendar.constants.hindu.EPOCH_RD) / calendar.constants.hindu.SIDERAL_YEAR -
                 priv.hinduSolarLongitude (tee) / 360);
  };

  // Return the approximate moment of last new moon preceding moment tee,
  // close enough to determine zodiacal sign.
  priv.hinduNewMoonBefore = function (tee) {
    var eps = 7.888609052210118e-31,
        tau = tee - priv.hinduLunarPhase (tee) * calendar.constants.hindu.SYNODIC_MONTH / 360;

    return astro.binarySearch (tau - 1, Math.min (tee, tau + 1),
        function (lower, upper) {
             return priv.hinduZodiac (lower) === priv.hinduZodiac (upper) || upper - lower < eps;
        },
        function (x0) {
             return priv.hinduLunarPhase (x0) < 180;
        });
  };

  calendar.jdToHinduSolar = function (jd) {
      var jd0, critical, month, year, day, approx, begin;

      jd0      = jd - this.constants.J0000;
      critical = priv.hinduSunrise (jd0 + 1);
      month    = priv.hinduZodiac (critical);
      year     = priv.hinduCalendarYear (critical) - this.constants.hindu.SOLAR_ERA;
      approx   = jd0 - 3 - astro.mod (Math.floor (priv.hinduSolarLongitude (critical)), 30);

      begin    = astro.next (approx, function (index) {
          return priv.hinduZodiac (priv.hinduSunrise (index + 1)) === month;
      });

      day      = jd0 - begin + 1;

      return [ year, month, day ];
  };

  calendar.hinduSolarToJd = function (year, month, day) {
      var begin = Math.floor ((year + this.constants.hindu.SOLAR_ERA +
                 (month - 1) / 12) *
                 this.constants.hindu.SIDERAL_YEAR +
                 this.constants.hindu.EPOCH_RD);

      return day - 1 + astro.next (begin - 3, function (param) {
          var zodiac, sunrise;

          sunrise = priv.hinduSunrise (param + 1);
          zodiac = priv.hinduZodiac (sunrise);

          return zodiac === month;
      }) + calendar.constants.J0000;
  };

  // Return the Hindu lunar date, new_moon scheme, equivalent to fixed date
  calendar.jdToHinduLunar = function (jd) {
      var jd0, critical, day, dayLeap, lastNewMoon, nextNewMoon, monthSolar,
          monthLeap, month, year;

      jd0      = jd - this.constants.J0000;
      critical = priv.hinduSunrise (jd0);
      day      = priv.hinduLunarDayFromMoment (critical);
      dayLeap  = day === priv.hinduLunarDayFromMoment (priv.hinduSunrise (jd0 - 1));
      lastNewMoon = priv.hinduNewMoonBefore (critical);
      nextNewMoon = priv.hinduNewMoonBefore (Math.floor (lastNewMoon) + 35);
      monthSolar  = priv.hinduZodiac (lastNewMoon);
      monthLeap   = monthSolar === priv.hinduZodiac (nextNewMoon);
      month    = astro.amod (monthSolar + 1, 12);
      year     = priv.hinduCalendarYear (month <= 2 ? jd0 + 180 : jd0) -
                     this.constants.hindu.LUNAR_ERA;

      return [ year, month, monthLeap, day, dayLeap ];
  };

  calendar.hinduLunarToJd = function (year, month, monthLeap, day, dayLeap) {
    var approx, s0, k0, temp, mid, est, tau, date;

    approx = this.constants.hindu.EPOCH_RD +
             this.constants.hindu.SIDERAL_YEAR *
             (year + this.constants.hindu.LUNAR_ERA + (month - 1) / 12);
    s0     = Math.floor (
               approx + 180 - this.constants.hindu.SIDERAL_YEAR *
               astro.mod (priv.hinduSolarLongitude (approx) -
               (month - 1) * 30 + 180, 360) / 360);
    k0     = priv.hinduLunarDayFromMoment (s0 + 0.25);

    if (k0 > 3 && k0 < 27) {
        temp = k0;
    } else {
        mid = calendar.jdToHinduLunar (s0 - 15 + calendar.constants.J0000);

        if (mid[1] !== month || (mid[2] && !monthLeap)) {
            temp = astro.mod (k0 + 15, 30) - 15;
        } else {
            temp = astro.mod (k0 - 15, 30) + 15;
        }
    }

    est = s0 + day - temp;
    tau = est - astro.mod (priv.hinduLunarDayFromMoment (est + 0.25) - day + 15, 30) + 15;

    date = astro.next (tau - 1, function (d0) {
        var d1 = priv.hinduLunarDayFromMoment (priv.hinduSunrise (d0)),
            d2 = astro.amod (day + 1, 30);

        return d1 === day || d1 === d2;
    });

    if (dayLeap) {
        date += 1;
    }

    return date + calendar.constants.J0000;
  };

  // Obtain Julian day for Indian Civil date
  calendar.indianCivilToJd = function (year, month, day) {
    var Caitra, gyear, leap, start, jd, m0;

    gyear  = year + 78;
    leap   = this.leapGregorian (gyear); // Is this a leap year ?
    start  = this.gregorianToJd (gyear, 3, leap ? 21 : 22);
    Caitra = leap ? 31 : 30;

    if (month === 1) {
      return start + day - 1;
    }

    jd = start + Caitra;
    m0 = month - 2;
    m0 = Math.min (m0, 5);
    jd += m0 * 31;

    if (month >= 8) {
        m0 = month - 7;
        jd += m0 * 30;
    }

    return jd + day - 1;
  };

  // Calculate Indian Civil date from Julian day
  calendar.jdToIndianCivil = function (jd) {
    var jd0, Caitra, Saka, greg, greg0, leap, start, year, month, day, yday, mday;

    // Offset in years from Saka era to Gregorian epoch
    Saka  = 79 - 1;
    // Day offset between Saka and Gregorian
    start = 80;

    jd0    = Math.floor (jd) + 0.5;
    greg   = this.jdToGregorian (jd0); // Gregorian date for Julian day
    leap   = this.leapGregorian (greg[0]); // Is this a leap year?
    year   = greg[0] - Saka; // Tentative year in Saka era
    greg0  = this.gregorianToJd (greg[0], 1, 1); // JD at start of Gregorian year
    yday   = jd0 - greg0; // Day number (0 based) in Gregorian year
    Caitra = leap ? 31 : 30; // Days in Caitra this year

    if (yday < start) {
      // Day is at the end of the preceding Saka year
      year -= 1;
      yday += Caitra + 31 * 5 + 30 * 3 + 10 + start;
    }

    yday -= start;

    if (yday < Caitra) {
      month = 1;
      day = yday + 1;
    } else {
      mday = yday - Caitra;
      if (mday < 31 * 5) {
        month = Math.floor (mday / 31) + 2;
        day = mday % 31 + 1;
      } else {
        mday -= 31 * 5;
        month = Math.floor (mday / 30) + 7;
        day = mday % 30 + 1;
      }
    }

    return [ year, month, day ];
  };

  priv.isFloat = function (num) {
      return Boolean (Boolean (num % 1));
  };

  priv.tibetanSunEquation = function (alpha) {
      var alphaInt = Math.floor (alpha);

    if (alpha > 6) {
        return -priv.tibetanSunEquation (alpha - 6);
    }

    if (alpha > 3) {
        return priv.tibetanSunEquation (6 - alpha);
    }

    if (!priv.isFloat (alpha)) {
        return [ 0, 6, 10, 11 ][alphaInt] / 60;
    }

    return astro.mod ( alpha, 1) * priv.tibetanSunEquation (Math.ceil (alpha)) +
           astro.mod (-alpha, 1) * priv.tibetanSunEquation (alphaInt);
  };

  priv.tibetanMoonEquation = function (alpha) {
      var alphaInt = Math.floor (alpha);

    if (alpha > 14) {
        return -priv.tibetanMoonEquation (alpha - 14);
    }

    if (alpha > 7) {
        return priv.tibetanMoonEquation (14 - alpha);
    }

    if (!priv.isFloat (alpha)) {
        return [ 0, 5, 10, 15, 19, 22, 24, 25 ][alphaInt] / 60;
    }

    return astro.mod ( alpha, 1) * priv.tibetanMoonEquation (Math.ceil (alpha)) +
           astro.mod (-alpha, 1) * priv.tibetanMoonEquation (alphaInt);
  };

  calendar.tibetanToJd = function (date) {
      var year, month, monthLeap, day, dayLeap, months, days, mean, solAnomaly, lunAnomaly, sun, moon;

    year       = date[0];
    month      = date[1];
    monthLeap  = date[2];
    day        = date[3];
    dayLeap    = date[4];
    months     = Math.floor (804 / 65 * (year - 1) + 67 / 65 * month + (monthLeap ? -1 : 0) + 64 / 65);
    days       = 30 * months + day;
    mean       = days * 11135 / 11312 - 30 + (dayLeap ? 0 : -1) + 1071 / 1616;
    solAnomaly = astro.mod (days * 13 / 4824 + 2117 / 4824, 1);
    lunAnomaly = astro.mod (days * 3781 / 105840 + 2837 / 15120, 1);
    sun        = priv.tibetanSunEquation (12 * solAnomaly);
    moon       = priv.tibetanMoonEquation (28 * lunAnomaly);

    return Math.floor (this.constants.tibetan.EPOCH + mean - sun + moon - 0.5) + 0.5;
  };

  calendar.jdToTibetan = function (jd) {
      var capY, years, year0, month0, est, day0, monthLeap, day, month, year, temp, dayLeap;

      capY = 365 + 4975 / 18382;
      years = Math.ceil ((jd - this.constants.tibetan.EPOCH) / capY);

      year0 = astro.final (years, function (y0) {
          return jd >= calendar.tibetanToJd ([ y0, 1, false, 1, false ]);
      });

      month0 = astro.final (1, function (m0) {
          return jd >= calendar.tibetanToJd ([ year0, m0, false, 1, false ]);
      });

      est = jd - this.tibetanToJd ([ year0, month0, false, 1, false ]);

      day0 = astro.final (est - 2, function (d0) {
          return jd >= calendar.tibetanToJd ([ year0, month0, false, d0, false ]);
      });

      monthLeap = day0 > 30;
      day = astro.amod (day0, 30);

      if (day > day0) {
          temp = month0 - 1;
      } else if (monthLeap) {
          temp = month0 + 1;
      } else {
          temp = month0;
      }

      month = astro.amod (temp, 12);

      if (day > day0 && month0 === 1) {
          year = year0 - 1;
      } else if (monthLeap && month0 === 12) {
          year = year0 + 1;
      } else {
          year = year0;
      }

      dayLeap = jd === this.tibetanToJd ([ year, month, monthLeap, day, true ]);

      return [ year, month, monthLeap, day, dayLeap ];
  };

  calendar.tibetanMonthLeap = function (year, month) {
      return month ===
              this.jdToTibetan (this.tibetanToJd ([ year, month, true, 2, false ]))[1];
  };

  return exports;
} (Calendrical || {}));
