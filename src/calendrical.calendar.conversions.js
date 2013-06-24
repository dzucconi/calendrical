var Calendrical = (function(exports){
  "use strict";

  exports.calendar = exports.calendar || {};

  // Aliases
  var astro    = exports.astro,
      calendar = exports.calendar;

  // Is a given year in the Gregorian calendar a leap year?
  calendar.leapGregorian = function(year) {
    return ((year % 4) == 0) &&
      (!(((year % 100) == 0) && ((year % 400) != 0)));
  }

  // Determine Julian day number from Gregorian calendar date
  calendar.gregorianToJd = function(year, month, day) {
    return (this.constants.gregorian.EPOCH - 1) +
      (365 * (year - 1)) +
      Math.floor((year - 1) / 4) +
      (-Math.floor((year - 1) / 100)) +
      Math.floor((year - 1) / 400) +
      Math.floor((((367 * month) - 362) / 12) +
        ((month <= 2) ? 0 :
          (this.leapGregorian(year) ? -1 : -2)
        ) +
        day);
  }

  // Calculate Gregorian calendar date from Julian day
  calendar.jdToGregorian = function(jd) {
    var wjd, depoch, quadricent, dqc, cent, dcent, quad, dquad,
      yindex, dyindex, year, yearday, leapadj, month, day;

    wjd        = Math.floor(jd - 0.5) + 0.5;
    depoch     = wjd - this.constants.gregorian.EPOCH;
    quadricent = Math.floor(depoch / 146097);
    dqc        = astro.mod(depoch, 146097);
    cent       = Math.floor(dqc / 36524);
    dcent      = astro.mod(dqc, 36524);
    quad       = Math.floor(dcent / 1461);
    dquad      = astro.mod(dcent, 1461);
    yindex     = Math.floor(dquad / 365);
    year       = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;

    if (!((cent == 4) || (yindex == 4))) { year++; }

    yearday = wjd - this.gregorianToJd(year, 1, 1);
    leapadj = ((wjd < this.gregorianToJd(year, 3, 1)) ? 0 :
      (this.leapGregorian(year) ? 1 : 2)
    );
    month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
    day   = (wjd - this.gregorianToJd(year, month, 1)) + 1;

    return [year, month, day];
  }

  // Return Julian day of given ISO year, week, and day
  calendar.nWeeks = function(weekday, jd, nthweek) {
    var j = 7 * nthweek;

    if (nthweek > 0) {
      j += this.previousWeekday(weekday, jd);
    } else {
      j += this.nextWeekday(weekday, jd);
    }

    return j;
  }

  calendar.isoToJulian = function(year, week, day) {
    return day + this.nWeeks(0, this.gregorianToJd(year - 1, 12, 28), week);
  }

  // Return array of ISO (year, week, day) for Julian day
  calendar.jdToIso = function(jd) {
    var year, week, day;

    year = this.jdToGregorian(jd - 3)[0];

    if (jd >= this.isoToJulian(year + 1, 1, 1)) { year++; }

    week = Math.floor((jd - this.isoToJulian(year, 1, 1)) / 7) + 1;
    day  = astro.jwday(jd);

    if (day == 0) { day = 7; }

    return [year, week, day];
  }

  // Return Julian day of given ISO year, and day of year
  calendar.isoDayToJulian = function(year, day) {
    return (day - 1) + this.gregorianToJd(year, 1, 1);
  }

  // Return array of ISO (year, day_of_year) for Julian day
  calendar.jdToIsoDay = function(jd) {
    var year, day;

    year = this.jdToGregorian(jd)[0];
    day = Math.floor(jd - this.gregorianToJd(year, 1, 1)) + 1;
    return [year, day];
  }

  // Pad a string to a given length with a given fill character.
  calendar.pad = function(str, howlong, padwith) {
    var s = str.toString();

    while (s.length < howlong) {
      s = padwith + s;
    }

    return s;
  }

  // Determine Julian day number from Julian calendar date
  calendar.leapJulian = function(year) {
    return astro.mod(year, 4) == ((year > 0) ? 0 : 3);
  }

  calendar.julianToJd = function(year, month, day) {
    // Adjust negative common era years to the zero-based notation we use.
    if (year < 1) { year++; }

    // Algorithm as given in *Meeus, **Astronomical Algorithms**, Chapter 7, page 61*
    if (month <= 2) {
      year--;
      month += 12;
    }

    return ((Math.floor((365.25 * (year + 4716))) +
      Math.floor((30.6001 * (month + 1))) +
      day) - 1524.5);
  }

  // Calculate Julian calendar date from Julian day
  calendar.jdToJulian = function(td) {
    var z, a, alpha, b, c, d, e, year, month, day;

    td += 0.5;
    z = Math.floor(td);

    a = z;
    b = a + 1524;
    c = Math.floor((b - 122.1) / 365.25);
    d = Math.floor(365.25 * c);
    e = Math.floor((b - d) / 30.6001);

    month = Math.floor((e < 14) ? (e - 1) : (e - 13));
    year = Math.floor((month > 2) ? (c - 4716) : (c - 4715));
    day = b - d - Math.floor(30.6001 * e);

    // If year is less than 1, subtract one to convert from
    // a zero based date system to the common era system in
    // which the year -1 (1 B.C.E) is followed by year 1 (1 C.E.).
    if (year < 1) { year--; }

    return [year, month, day];
  }

  // Determine Julian day from Hebrew date
  //
  // Is a given Hebrew year a leap year?
  calendar.hebrewLeap = function(year) {
    return astro.mod(((year * 7) + 1), 19) < 7;
  }

  // How many months are there in a Hebrew year (12 = normal, 13 = leap)
  calendar.hebrewYearMonths = function(year) {
    return this.hebrewLeap(year) ? 13 : 12;
  }

  // Test for delay of start of new year and to avoid
  // Sunday, Wednesday, and Friday as start of the new year.
  calendar.hebrewDelay1 = function(year) {
    var months, day, parts;

    months = Math.floor(((235 * year) - 234) / 19);
    parts  = 12084 + (13753 * months);
    day    = (months * 29) + Math.floor(parts / 25920);

    if (astro.mod((3 * (day + 1)), 7) < 3) {
      day++;
    }

    return day;
  }

  // Check for delay in start of new year due to length of adjacent years
  calendar.hebrewDelay2 = function(year) {
    var last, present, next;

    last    = this.hebrewDelay1(year - 1);
    present = this.hebrewDelay1(year);
    next    = this.hebrewDelay1(year + 1);

    return ((next - present) == 356) ? 2 :
      (((present - last) == 382) ? 1 : 0);
  }

  // How many days are in a Hebrew year?
  calendar.hebrewYearDays = function(year) {
    return this.hebrewToJd(year + 1, 7, 1) - this.hebrewToJd(year, 7, 1);
  }

  // How many days are in a given month of a given year
  calendar.hebrewMonthDays = function(year, month) {
    // First of all, dispose of fixed-length 29 day months
    if (month == 2 || month == 4 || month == 6 ||
      month == 10 || month == 13) {
      return 29;
    }

    // If it's not a leap year, Adar has 29 days
    if (month == 12 && !this.hebrewLeap(year)) {
      return 29;
    }

    // If it's Heshvan, days depend on length of year
    if (month == 8 && !(astro.mod(this.hebrewYearDays(year), 10) == 5)) {
      return 29;
    }

    // Similarly, Kislev varies with the length of year
    if (month == 9 && (astro.mod(this.hebrewYearDays(year), 10) == 3)) {
      return 29;
    }

    // Nope, it's a 30 day month
    return 30;
  }

  // Finally, wrap it all up into...
  calendar.hebrewToJd = function(year, month, day) {
    var jd, mon, months;

    months = this.hebrewYearMonths(year);

    jd = this.constants.hebrew.EPOCH + this.hebrewDelay1(year) +
      this.hebrewDelay2(year) + day + 1;

    if (month < 7) {
      for (mon = 7; mon <= months; mon++) {
        jd += this.hebrewMonthDays(year, mon);
      }
      for (mon = 1; mon < month; mon++) {
        jd += this.hebrewMonthDays(year, mon);
      }
    } else {
      for (mon = 7; mon < month; mon++) {
        jd += this.hebrewMonthDays(year, mon);
      }
    }

    return jd;
  }

  // Convert Julian date to Hebrew date
  // This works by making multiple calls to
  // the inverse function, and is this very slow.
  calendar.jdToHebrew = function(jd) {
    var year, month, day, i, count, first;

    jd    = Math.floor(jd) + 0.5;
    count = Math.floor(((jd - this.constants.hebrew.EPOCH) * 98496.0) / 35975351.0);
    year  = count - 1;

    for (i = count; jd >= this.hebrewToJd(i, 7, 1); i++) {
      year++;
    }

    first = (jd < this.hebrewToJd(year, 1, 1)) ? 7 : 1;
    month = first;

    for (i = first; jd > this.hebrewToJd(year, i, this.hebrewMonthDays(year, i)); i++) {
      month++;
    }

    day = (jd - this.hebrewToJd(year, month, 1)) + 1;

    return [year, month, day];
  }


  // Determine Julian day and fraction of the
  // September equinox at the Paris meridian in
  // a given Gregorian year.
  calendar.equinoxeAParis = function(year) {
    var equJED, equJD, equAPP, equParis, dtParis;

    // September equinox in dynamical time
    equJED = astro.equinox(year, 2);

    // Correct for delta T to obtain Universal time
    equJD = equJED - (astro.deltat(year) / (24 * 60 * 60));

    // Apply the equation of time to yield the apparent time at Greenwich
    equAPP = equJD + astro.equationOfTime(equJED);

    // Finally, we must correct for the constant difference between
    // the Greenwich meridian and that of Paris, 2°20'15" to the East.
    dtParis = (2 + (20 / 60.0) + (15 / (60 * 60.0))) / 360;
    equParis = equAPP + dtParis;

    return equParis;
  }

  // Calculate Julian day during which the
  // September equinox, reckoned from the Paris
  // meridian, occurred for a given Gregorian year.
  calendar.parisEquinoxeJd = function(year) {
    var ep, epg;

    ep  = this.equinoxeAParis(year);
    epg = Math.floor(ep - 0.5) + 0.5;

    return epg;
  }

  // Determine the year in the French
  // revolutionary calendar in which a given Julian day falls.
  // Returns an array of two elements:
  //
  // **[0]** Année de la Révolution
  // **[1]** Julian day number containing equinox for this year.
  calendar.anneeDaLaRevolution = function(jd) {
    var guess = this.jdToGregorian(jd)[0] - 2,
      lasteq, nexteq, adr;

    lasteq = this.parisEquinoxeJd(guess);

    while (lasteq > jd) {
      guess--;
      lasteq = this.parisEquinoxeJd(guess);
    }

    nexteq = lasteq - 1;

    while (!((lasteq <= jd) && (jd < nexteq))) {
      lasteq = nexteq;
      guess++;
      nexteq = this.parisEquinoxeJd(guess);
    }

    adr = Math.round((lasteq - this.constants.french_revolutionary.EPOCH) /
                        astro.constants.TROPICAL_YEAR) + 1;

    return [adr, lasteq];
  }

  // Calculate date in the French Revolutionary
  // calendar from Julian day. The five or six
  // "sansculottides" are considered a thirteenth
  // month in the results of this function.
  calendar.jdToFrenchRevolutionary = function(jd) {
    var an, mois, decade, jour,
      adr, equinoxe;

    jd       = Math.floor(jd) + 0.5;
    adr      = this.anneeDaLaRevolution(jd);
    an       = adr[0];
    equinoxe = adr[1];
    mois     = Math.floor((jd - equinoxe) / 30) + 1;
    jour     = (jd - equinoxe) % 30;
    decade   = Math.floor(jour / 10) + 1;
    jour     = (jour % 10) + 1;

    return [an, mois, decade, jour];
  }

  // Obtain Julian day from a given French
  // Revolutionary calendar date.
  calendar.frenchRevolutionaryToJd = function(an, mois, decade, jour) {
    var adr, equinoxe, guess, jd;

    guess = this.constants.french_revolutionary.EPOCH + (astro.constants.TROPICAL_YEAR * ((an - 1) - 1));
    adr = [an - 1, 0];

    while (adr[0] < an) {
      adr = this.anneeDaLaRevolution(guess);
      guess = adr[1] + (astro.constants.TROPICAL_YEAR + 2);
    }
    equinoxe = adr[1];

    jd = equinoxe + (30 * (mois - 1)) + (10 * (decade - 1)) + (jour - 1);
    return jd;
  }

  // Is a given year a leap year in the Islamic calendar?
  calendar.leapIslamic = function(year) {
    return (((year * 11) + 14) % 30) < 11;
  }

  // Determine Julian day from Islamic date
  calendar.islamicToJd = function(year, month, day) {
    return (day +
      Math.ceil(29.5 * (month - 1)) +
      (year - 1) * 354 +
      Math.floor((3 + (11 * year)) / 30) +
      this.constants.islamic.EPOCH) - 1;
  }

  // Calculate Islamic date from Julian day
  calendar.jdToIslamic = function(jd) {
    var year, month, day;

    jd    = Math.floor(jd) + 0.5;
    year  = Math.floor(((30 * (jd - this.constants.islamic.EPOCH)) + 10646) / 10631);
    month = Math.min(12, Math.ceil((jd - (29 + this.islamicToJd(year, 1, 1))) / 29.5) + 1);
    day   = (jd - this.islamicToJd(year, month, 1)) + 1;

    return [year, month, day];
  }

  // Determine Julian day and fraction of the
  // March equinox at the Tehran meridian in
  // a given Gregorian year.
  calendar.tehranEquinox = function(year) {
    var equJED, equJD, equAPP, equTehran, dtTehran;

    // March equinox in dynamical time
    equJED = astro.equinox(year, 0);

    // Correct for delta T to obtain Universal time
    equJD = equJED - (astro.deltat(year) / (24 * 60 * 60));

    // Apply the equation of time to yield the apparent time at Greenwich
    equAPP = equJD + astro.equationOfTime(equJED);

    // Finally, we must correct for the constant difference between
    // the Greenwich meridian andthe time zone standard for
    // Iran Standard time, 52°30' to the East.
    dtTehran  = (52 + (30 / 60.0) + (0 / (60.0 * 60.0))) / 360;
    equTehran = equAPP + dtTehran;

    return equTehran;
  }

  // Calculate Julian day during which the
  // March equinox, reckoned from the Tehran
  // meridian, occurred for a given Gregorian year.
  calendar.tehranEquinoxJd = function(year) {
    var ep, epg;

    ep  = this.tehranEquinox(year);
    epg = Math.floor(ep);

    return epg;
  }

  // Determine the year in the Persian
  // astronomical calendar in which a
  // given Julian day falls. Returns an
  // array of two elements:
  //
  // **[0]** Persian year
  // **[1]** Julian day number containing equinox for this year.
  calendar.persianaYear = function(jd) {
    var guess = this.jdToGregorian(jd)[0] - 2,
      lasteq, nexteq, adr;

    lasteq = this.tehranEquinoxJd(guess);

    while (lasteq > jd) {
      guess--;
      lasteq = this.tehranEquinoxJd(guess);
    }

    nexteq = lasteq - 1;

    while (!((lasteq <= jd) && (jd < nexteq))) {
      lasteq = nexteq;
      guess++;
      nexteq = this.tehranEquinoxJd(guess);
    }

    adr = Math.round((lasteq - this.constants.persian.EPOCH) /
                        astro.constants.TROPICAL_YEAR) + 1;

    return [adr, lasteq];
  }

  // Calculate date in the Persian astronomical
  // calendar from Julian day.
  calendar.jdToPersiana = function(jd) {
    var year, month, day, adr, equinox, yday;

    jd      = Math.floor(jd) + 0.5;
    adr     = this.persianaYear(jd);
    year    = adr[0];
    equinox = adr[1];
    day     = Math.floor((jd - equinox) / 30) + 1;

    yday  = (Math.floor(jd) - this.persianaToJd(year, 1, 1)) + 1;
    month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
    day   = (Math.floor(jd) - this.persianaToJd(year, month, 1)) + 1;

    return [year, month, day];
  }

  // Obtain Julian day from a given Persian
  // astronomical calendar date.
  calendar.persianaToJd = function(year, month, day) {
    var adr, equinox, guess, jd;

    guess = (this.constants.persian.EPOCH - 1) +
              (astro.constants.TROPICAL_YEAR * ((year - 1) - 1));
    adr   = [year - 1, 0];

    while (adr[0] < year) {
      adr   = this.persianaYear(guess);
      guess = adr[1] + (astro.constants.TROPICAL_YEAR + 2);
    }

    equinox = adr[1];

    jd = equinox +
      ((month <= 7) ?
      ((month - 1) * 31) :
      (((month - 1) * 30) + 6)
    ) +
      (day - 1);

    return jd;
  }

  // Is a given year a leap year in the Persian
  // astronomical calendar?
  calendar.leapPersiana = function(year) {
    return (this.persianaToJd(year + 1, 1, 1) -
      this.persianaToJd(year, 1, 1)) > 365;
  }

  // Is a given year a leap year in the Persian calendar?
  calendar.leapPersian = function(year) {
    return ((((((year - ((year > 0) ? 474 : 473)) % 2820) + 474) + 38) * 682) % 2816) < 682;
  }

  // Determine Julian day from Persian date
  calendar.persianToJd = function(year, month, day) {
    var epbase, epyear;

    epbase = year - ((year >= 0) ? 474 : 473);
    epyear = 474 + astro.mod(epbase, 2820);

    return day +
      ((month <= 7) ?
      ((month - 1) * 31) :
      (((month - 1) * 30) + 6)
    ) +
      Math.floor(((epyear * 682) - 110) / 2816) +
      (epyear - 1) * 365 +
      Math.floor(epbase / 2820) * 1029983 +
      (this.constants.persian.EPOCH - 1);
  }

  // Calculate Persian date from Julian day
  calendar.jdToPersian = function(jd) {
    var year, month, day, depoch, cycle, cyear, ycycle,
      aux1, aux2, yday;

    jd = Math.floor(jd) + 0.5;

    depoch = jd - this.persianToJd(475, 1, 1);
    cycle  = Math.floor(depoch / 1029983);
    cyear  = astro.mod(depoch, 1029983);

    if (cyear == 1029982) {
      ycycle = 2820;
    } else {
      aux1 = Math.floor(cyear / 366);
      aux2 = astro.mod(cyear, 366);
      ycycle = Math.floor(((2134 * aux1) + (2816 * aux2) + 2815) / 1028522) +
        aux1 + 1;
    }

    year = ycycle + (2820 * cycle) + 474;

    if (year <= 0) { year--; }

    yday  = (jd - this.persianToJd(year, 1, 1)) + 1;
    month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
    day   = (jd - this.persianToJd(year, month, 1)) + 1;

    return [year, month, day];
  }

  // Determine Julian day from Mayan long count
  calendar.mayanCountToJd = function(baktun, katun, tun, uinal, kin) {
    return this.constants.mayan.COUNT_EPOCH +
      (baktun * 144000) +
      (katun * 7200) +
      (tun * 360) +
      (uinal * 20) +
      kin;
  }

  // Calculate Mayan long count from Julian day
  calendar.jdToMayanCount = function(jd) {
    var d, baktun, katun, tun, uinal, kin;

    jd     = Math.floor(jd) + 0.5;
    d      = jd - this.constants.mayan.COUNT_EPOCH;
    baktun = Math.floor(d / 144000);
    d      = astro.mod(d, 144000);
    katun  = Math.floor(d / 7200);
    d      = astro.mod(d, 7200);
    tun    = Math.floor(d / 360);
    d      = astro.mod(d, 360);
    uinal  = Math.floor(d / 20);
    kin    = astro.mod(d, 20);

    return [baktun, katun, tun, uinal, kin];
  }

  // Determine Mayan Haab "month" and day from Julian day
  calendar.jdToMayanHaab = function(jd) {
    var lcount, day;

    jd     = Math.floor(jd) + 0.5;
    lcount = jd - this.constants.mayan.COUNT_EPOCH;
    day    = astro.mod(lcount + 8 + ((18 - 1) * 20), 365);

    return [Math.floor(day / 20) + 1, astro.mod(day, 20)];
  }

  // Determine Mayan Tzolkin "month" and day from Julian day
  calendar.jdToMayanTzolkin = function(jd) {
    var lcount;

    jd     = Math.floor(jd) + 0.5;
    lcount = jd - this.constants.mayan.COUNT_EPOCH;

    return [astro.amod(lcount + 20, 20), astro.amod(lcount + 4, 13)];
  }

  // Determine Julian day from Bahai date
  calendar.bahaiToJd = function(major, cycle, year, month, day) {
    var gy;

    gy = (361 * (major - 1)) + (19 * (cycle - 1)) + (year - 1) +
      this.jdToGregorian(this.constants.bahai.EPOCH)[0];
    return this.gregorianToJd(gy, 3, 20) + (19 * (month - 1)) +
      ((month != 20) ? 0 : (this.leapGregorian(gy + 1) ? -14 : -15)) +
      day;
  }

  // Calculate Bahai date from Julian day
  calendar.jdToBahai = function(jd) {
    var major, cycle, year, month, day,
      gy, bstarty, bys, days, bld;

    jd      = Math.floor(jd) + 0.5;
    gy      = this.jdToGregorian(jd)[0];
    bstarty = this.jdToGregorian(this.constants.bahai.EPOCH)[0];
    bys     = gy - (bstarty + (((this.gregorianToJd(gy, 1, 1) <= jd) &&
                (jd <= this.gregorianToJd(gy, 3, 20))) ? 1 : 0));
    major   = Math.floor(bys / 361) + 1;
    cycle   = Math.floor(astro.mod(bys, 361) / 19) + 1;
    year    = astro.mod(bys, 19) + 1;
    days    = jd - this.bahaiToJd(major, cycle, year, 1, 1);
    bld     = this.bahaiToJd(major, cycle, year, 20, 1);
    month   = (jd >= bld) ? 20 : (Math.floor(days / 19) + 1);
    day     = (jd + 1) - this.bahaiToJd(major, cycle, year, month, 1);

    return [major, cycle, year, month, day];
  }

  // Obtain Julian day for Indian Civil date
  calendar.indianCivilToJd = function(year, month, day) {
    var Caitra, gyear, leap, start, jd, m;

    gyear  = year + 78;
    leap   = this.leapGregorian(gyear); // Is this a leap year ?
    start  = this.gregorianToJd(gyear, 3, leap ? 21 : 22);
    Caitra = leap ? 31 : 30;

    if (month == 1) {
      jd = start + (day - 1);
    } else {
      jd = start + Caitra;
      m = month - 2;
      m = Math.min(m, 5);
      jd += m * 31;

      if (month >= 8) {
        m = month - 7;
        jd += m * 30;
      }

      jd += day - 1;
    }

    return jd;
  }

  // Calculate Indian Civil date from Julian day
  calendar.jdToIndianCivil = function(jd) {
    var Caitra, Saka, greg, greg0, leap, start, year, month, day, yday, mday;

    // Offset in years from Saka era to Gregorian epoch
    Saka  = 79 - 1;
    // Day offset between Saka and Gregorian
    start = 80;

    jd     = Math.floor(jd) + 0.5;
    greg   = this.jdToGregorian(jd); // Gregorian date for Julian day
    leap   = this.leapGregorian(greg[0]); // Is this a leap year?
    year   = greg[0] - Saka; // Tentative year in Saka era
    greg0  = this.gregorianToJd(greg[0], 1, 1); // JD at start of Gregorian year
    yday   = jd - greg0; // Day number (0 based) in Gregorian year
    Caitra = leap ? 31 : 30; // Days in Caitra this year

    if (yday < start) {
      // Day is at the end of the preceding Saka year
      year--;
      yday += Caitra + (31 * 5) + (30 * 3) + 10 + start;
    }

    yday -= start;

    if (yday < Caitra) {
      month = 1;
      day = yday + 1;
    } else {
      mday = yday - Caitra;
      if (mday < (31 * 5)) {
        month = Math.floor(mday / 31) + 2;
        day = (mday % 31) + 1;
      } else {
        mday -= 31 * 5;
        month = Math.floor(mday / 30) + 7;
        day = (mday % 30) + 1;
      }
    }

    return [year, month, day];
  }

  return exports;
}(Calendrical || {}));
