var Ephemerides = (function(exports){
  "use strict";

  exports.calendar = exports.calendar || {};
  exports.data = exports.data || {
    bahai: {},
    excelserial1900: {},
    excelserial1904: {},
    french: {},
    gregorian: {},
    gregserial: {},
    hebrew: {},
    indiancivilcalendar: {},
    islamic: {},
    isoday: {},
    isoweek: {},
    juliancalendar: {},
    julianday: {},
    mayancount: {},
    modifiedjulianday: {},
    persian: {},
    persiana: {},
    unixtime: {}
  };

  // Aliases
  var astro    = exports.astro,
      calendar = exports.calendar,
      data     = exports.data;

  // Return Julian date of given weekday (0 = Sunday)
  // in the seven days ending on jd.
  calendar.weekday_before = function(weekday, jd) {
    return jd - astro.jwday(jd - weekday);
  }

  // Determine the Julian date for:
  //
  // **weekday**      Day of week desired, 0 = Sunday
  // **jd**           Julian date to begin search
  // **direction**    1 = next weekday, -1 = last weekday
  // **offset**       Offset from jd to begin search
  calendar.search_weekday = function(weekday, jd, direction, offset) {
    return this.weekday_before(weekday, jd + (direction * offset));
  }

  // Utility weekday functions, just wrappers for search_weekday
  calendar.nearest_weekday = function(weekday, jd) {
    return this.search_weekday(weekday, jd, 1, 3);
  }

  calendar.next_weekday = function(weekday, jd) {
    return this.search_weekday(weekday, jd, 1, 7);
  }

  calendar.next_or_current_weekday = function(weekday, jd) {
    return this.search_weekday(weekday, jd, 1, 6);
  }

  calendar.previous_weekday = function(weekday, jd) {
    return this.search_weekday(weekday, jd, -1, 1);
  }

  calendar.previous_or_current_weekday = function(weekday, jd) {
    return this.search_weekday(weekday, jd, 1, 0);
  }

  // Is a given year in the Gregorian calendar a leap year?
  calendar.leap_gregorian = function(year) {
    return ((year % 4) == 0) &&
      (!(((year % 100) == 0) && ((year % 400) != 0)));
  }

  // Determine Julian day number from Gregorian calendar date
  calendar.gregorian_to_jd = function(year, month, day) {
    return (this.constants.gregorian.EPOCH - 1) +
      (365 * (year - 1)) +
      Math.floor((year - 1) / 4) +
      (-Math.floor((year - 1) / 100)) +
      Math.floor((year - 1) / 400) +
      Math.floor((((367 * month) - 362) / 12) +
        ((month <= 2) ? 0 :
          (this.leap_gregorian(year) ? -1 : -2)
        ) +
        day);
  }

  // Calculate Gregorian calendar date from Julian day
  calendar.jd_to_gregorian = function(jd) {
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

    yearday = wjd - this.gregorian_to_jd(year, 1, 1);
    leapadj = ((wjd < this.gregorian_to_jd(year, 3, 1)) ? 0 :
      (this.leap_gregorian(year) ? 1 : 2)
    );
    month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
    day   = (wjd - this.gregorian_to_jd(year, month, 1)) + 1;

    return [year, month, day];
  }

  // Return Julian day of given ISO year, week, and day
  calendar.n_weeks = function(weekday, jd, nthweek) {
    var j = 7 * nthweek;

    if (nthweek > 0) {
      j += this.previous_weekday(weekday, jd);
    } else {
      j += this.next_weekday(weekday, jd);
    }

    return j;
  }

  calendar.iso_to_julian = function(year, week, day) {
    return day + this.n_weeks(0, this.gregorian_to_jd(year - 1, 12, 28), week);
  }

  // Return array of ISO (year, week, day) for Julian day
  calendar.jd_to_iso = function(jd) {
    var year, week, day;

    year = this.jd_to_gregorian(jd - 3)[0];

    if (jd >= this.iso_to_julian(year + 1, 1, 1)) { year++; }

    week = Math.floor((jd - this.iso_to_julian(year, 1, 1)) / 7) + 1;
    day  = astro.jwday(jd);

    if (day == 0) { day = 7; }

    return [year, week, day];
  }

  // Return Julian day of given ISO year, and day of year
  calendar.iso_day_to_julian = function(year, day) {
    return (day - 1) + this.gregorian_to_jd(year, 1, 1);
  }

  // Return array of ISO (year, day_of_year) for Julian day
  calendar.jd_to_iso_day = function(jd) {
    var year, day;

    year = this.jd_to_gregorian(jd)[0];
    day = Math.floor(jd - this.gregorian_to_jd(year, 1, 1)) + 1;
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
  calendar.leap_julian = function(year) {
    return astro.mod(year, 4) == ((year > 0) ? 0 : 3);
  }

  calendar.julian_to_jd = function(year, month, day) {
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
  calendar.jd_to_julian = function(td) {
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
  calendar.hebrew_leap = function(year) {
    return astro.mod(((year * 7) + 1), 19) < 7;
  }

  // How many months are there in a Hebrew year (12 = normal, 13 = leap)
  calendar.hebrew_year_months = function(year) {
    return this.hebrew_leap(year) ? 13 : 12;
  }

  // Test for delay of start of new year and to avoid
  // Sunday, Wednesday, and Friday as start of the new year.
  calendar.hebrew_delay_1 = function(year) {
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
  calendar.hebrew_delay_2 = function(year) {
    var last, present, next;

    last    = this.hebrew_delay_1(year - 1);
    present = this.hebrew_delay_1(year);
    next    = this.hebrew_delay_1(year + 1);

    return ((next - present) == 356) ? 2 :
      (((present - last) == 382) ? 1 : 0);
  }

  // How many days are in a Hebrew year?
  calendar.hebrew_year_days = function(year) {
    return this.hebrew_to_jd(year + 1, 7, 1) - this.hebrew_to_jd(year, 7, 1);
  }

  // How many days are in a given month of a given year
  calendar.hebrew_month_days = function(year, month) {
    // First of all, dispose of fixed-length 29 day months
    if (month == 2 || month == 4 || month == 6 ||
      month == 10 || month == 13) {
      return 29;
    }

    // If it's not a leap year, Adar has 29 days
    if (month == 12 && !this.hebrew_leap(year)) {
      return 29;
    }

    // If it's Heshvan, days depend on length of year
    if (month == 8 && !(astro.mod(this.hebrew_year_days(year), 10) == 5)) {
      return 29;
    }

    // Similarly, Kislev varies with the length of year
    if (month == 9 && (astro.mod(this.hebrew_year_days(year), 10) == 3)) {
      return 29;
    }

    // Nope, it's a 30 day month
    return 30;
  }

  // Finally, wrap it all up into...
  calendar.hebrew_to_jd = function(year, month, day) {
    var jd, mon, months;

    months = this.hebrew_year_months(year);

    jd = this.constants.hebrew.EPOCH + this.hebrew_delay_1(year) +
      this.hebrew_delay_2(year) + day + 1;

    if (month < 7) {
      for (mon = 7; mon <= months; mon++) {
        jd += this.hebrew_month_days(year, mon);
      }
      for (mon = 1; mon < month; mon++) {
        jd += this.hebrew_month_days(year, mon);
      }
    } else {
      for (mon = 7; mon < month; mon++) {
        jd += this.hebrew_month_days(year, mon);
      }
    }

    return jd;
  }

  // Convert Julian date to Hebrew date
  // This works by making multiple calls to
  // the inverse function, and is this very slow.
  calendar.jd_to_hebrew = function(jd) {
    var year, month, day, i, count, first;

    jd    = Math.floor(jd) + 0.5;
    count = Math.floor(((jd - this.constants.hebrew.EPOCH) * 98496.0) / 35975351.0);
    year  = count - 1;

    for (i = count; jd >= this.hebrew_to_jd(i, 7, 1); i++) {
      year++;
    }

    first = (jd < this.hebrew_to_jd(year, 1, 1)) ? 7 : 1;
    month = first;

    for (i = first; jd > this.hebrew_to_jd(year, i, this.hebrew_month_days(year, i)); i++) {
      month++;
    }

    day = (jd - this.hebrew_to_jd(year, month, 1)) + 1;

    return [year, month, day];
  }


  // Determine Julian day and fraction of the
  // September equinox at the Paris meridian in
  // a given Gregorian year.
  calendar.equinoxe_a_paris = function(year) {
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
  calendar.paris_equinoxe_jd = function(year) {
    var ep, epg;

    ep  = this.equinoxe_a_paris(year);
    epg = Math.floor(ep - 0.5) + 0.5;

    return epg;
  }

  // Determine the year in the French
  // revolutionary calendar in which a given Julian day falls.
  // Returns an array of two elements:
  //
  // **[0]** Année de la Révolution
  // **[1]** Julian day number containing equinox for this year.
  calendar.annee_da_la_revolution = function(jd) {
    var guess = this.jd_to_gregorian(jd)[0] - 2,
      lasteq, nexteq, adr;

    lasteq = this.paris_equinoxe_jd(guess);

    while (lasteq > jd) {
      guess--;
      lasteq = this.paris_equinoxe_jd(guess);
    }

    nexteq = lasteq - 1;

    while (!((lasteq <= jd) && (jd < nexteq))) {
      lasteq = nexteq;
      guess++;
      nexteq = this.paris_equinoxe_jd(guess);
    }

    adr = Math.round((lasteq - this.constants.french_revolutionary.EPOCH) /
                        astro.constants.TROPICAL_YEAR) + 1;

    return [adr, lasteq];
  }

  // Calculate date in the French Revolutionary
  // calendar from Julian day. The five or six
  // "sansculottides" are considered a thirteenth
  // month in the results of this function.
  calendar.jd_to_french_revolutionary = function(jd) {
    var an, mois, decade, jour,
      adr, equinoxe;

    jd       = Math.floor(jd) + 0.5;
    adr      = this.annee_da_la_revolution(jd);
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
  calendar.french_revolutionary_to_jd = function(an, mois, decade, jour) {
    var adr, equinoxe, guess, jd;

    guess = this.constants.french_revolutionary.EPOCH + (astro.constants.TROPICAL_YEAR * ((an - 1) - 1));
    adr = [an - 1, 0];

    while (adr[0] < an) {
      adr = this.annee_da_la_revolution(guess);
      guess = adr[1] + (astro.constants.TROPICAL_YEAR + 2);
    }
    equinoxe = adr[1];

    jd = equinoxe + (30 * (mois - 1)) + (10 * (decade - 1)) + (jour - 1);
    return jd;
  }

  // Is a given year a leap year in the Islamic calendar?
  calendar.leap_islamic = function(year) {
    return (((year * 11) + 14) % 30) < 11;
  }

  // Determine Julian day from Islamic date
  calendar.islamic_to_jd = function(year, month, day) {
    return (day +
      Math.ceil(29.5 * (month - 1)) +
      (year - 1) * 354 +
      Math.floor((3 + (11 * year)) / 30) +
      this.constants.islamic.EPOCH) - 1;
  }

  // Calculate Islamic date from Julian day
  calendar.jd_to_islamic = function(jd) {
    var year, month, day;

    jd    = Math.floor(jd) + 0.5;
    year  = Math.floor(((30 * (jd - this.constants.islamic.EPOCH)) + 10646) / 10631);
    month = Math.min(12, Math.ceil((jd - (29 + this.islamic_to_jd(year, 1, 1))) / 29.5) + 1);
    day   = (jd - this.islamic_to_jd(year, month, 1)) + 1;

    return [year, month, day];
  }

  // Determine Julian day and fraction of the
  // March equinox at the Tehran meridian in
  // a given Gregorian year.
  calendar.tehran_equinox = function(year) {
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
  calendar.tehran_equinox_jd = function(year) {
    var ep, epg;

    ep  = this.tehran_equinox(year);
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
  calendar.persiana_year = function(jd) {
    var guess = this.jd_to_gregorian(jd)[0] - 2,
      lasteq, nexteq, adr;

    lasteq = this.tehran_equinox_jd(guess);

    while (lasteq > jd) {
      guess--;
      lasteq = this.tehran_equinox_jd(guess);
    }

    nexteq = lasteq - 1;

    while (!((lasteq <= jd) && (jd < nexteq))) {
      lasteq = nexteq;
      guess++;
      nexteq = this.tehran_equinox_jd(guess);
    }

    adr = Math.round((lasteq - this.constants.persian.EPOCH) /
                        astro.constants.TROPICAL_YEAR) + 1;

    return [adr, lasteq];
  }

  // Calculate date in the Persian astronomical
  // calendar from Julian day.
  calendar.jd_to_persiana = function(jd) {
    var year, month, day, adr, equinox, yday;

    jd      = Math.floor(jd) + 0.5;
    adr     = this.persiana_year(jd);
    year    = adr[0];
    equinox = adr[1];
    day     = Math.floor((jd - equinox) / 30) + 1;

    yday  = (Math.floor(jd) - this.persiana_to_jd(year, 1, 1)) + 1;
    month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
    day   = (Math.floor(jd) - this.persiana_to_jd(year, month, 1)) + 1;

    return [year, month, day];
  }

  // Obtain Julian day from a given Persian
  // astronomical calendar date.
  calendar.persiana_to_jd = function(year, month, day) {
    var adr, equinox, guess, jd;

    guess = (this.constants.persian.EPOCH - 1) +
              (astro.constants.TROPICAL_YEAR * ((year - 1) - 1));
    adr   = [year - 1, 0];

    while (adr[0] < year) {
      adr   = this.persiana_year(guess);
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
  calendar.leap_persiana = function(year) {
    return (this.persiana_to_jd(year + 1, 1, 1) -
      this.persiana_to_jd(year, 1, 1)) > 365;
  }

  // Is a given year a leap year in the Persian calendar?
  calendar.leap_persian = function(year) {
    return ((((((year - ((year > 0) ? 474 : 473)) % 2820) + 474) + 38) * 682) % 2816) < 682;
  }

  // Determine Julian day from Persian date
  calendar.persian_to_jd = function(year, month, day) {
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
  calendar.jd_to_persian = function(jd) {
    var year, month, day, depoch, cycle, cyear, ycycle,
      aux1, aux2, yday;

    jd = Math.floor(jd) + 0.5;

    depoch = jd - this.persian_to_jd(475, 1, 1);
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

    yday  = (jd - this.persian_to_jd(year, 1, 1)) + 1;
    month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
    day   = (jd - this.persian_to_jd(year, month, 1)) + 1;

    return [year, month, day];
  }

  // Determine Julian day from Mayan long count
  calendar.mayan_count_to_jd = function(baktun, katun, tun, uinal, kin) {
    return this.constants.mayan.COUNT_EPOCH +
      (baktun * 144000) +
      (katun * 7200) +
      (tun * 360) +
      (uinal * 20) +
      kin;
  }

  // Calculate Mayan long count from Julian day
  calendar.jd_to_mayan_count = function(jd) {
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
  calendar.jd_to_mayan_haab = function(jd) {
    var lcount, day;

    jd     = Math.floor(jd) + 0.5;
    lcount = jd - this.constants.mayan.COUNT_EPOCH;
    day    = astro.mod(lcount + 8 + ((18 - 1) * 20), 365);

    return [Math.floor(day / 20) + 1, astro.mod(day, 20)];
  }

  // Determine Mayan Tzolkin "month" and day from Julian day
  calendar.jd_to_mayan_tzolkin = function(jd) {
    var lcount;

    jd     = Math.floor(jd) + 0.5;
    lcount = jd - this.constants.mayan.COUNT_EPOCH;

    return [astro.amod(lcount + 20, 20), astro.amod(lcount + 4, 13)];
  }

  // Determine Julian day from Bahai date
  calendar.bahai_to_jd = function(major, cycle, year, month, day) {
    var gy;

    gy = (361 * (major - 1)) + (19 * (cycle - 1)) + (year - 1) +
      this.jd_to_gregorian(this.constants.bahai.EPOCH)[0];
    return this.gregorian_to_jd(gy, 3, 20) + (19 * (month - 1)) +
      ((month != 20) ? 0 : (this.leap_gregorian(gy + 1) ? -14 : -15)) +
      day;
  }

  // Calculate Bahai date from Julian day
  calendar.jd_to_bahai = function(jd) {
    var major, cycle, year, month, day,
      gy, bstarty, bys, days, bld;

    jd      = Math.floor(jd) + 0.5;
    gy      = this.jd_to_gregorian(jd)[0];
    bstarty = this.jd_to_gregorian(this.constants.bahai.EPOCH)[0];
    bys     = gy - (bstarty + (((this.gregorian_to_jd(gy, 1, 1) <= jd) &&
                (jd <= this.gregorian_to_jd(gy, 3, 20))) ? 1 : 0));
    major   = Math.floor(bys / 361) + 1;
    cycle   = Math.floor(astro.mod(bys, 361) / 19) + 1;
    year    = astro.mod(bys, 19) + 1;
    days    = jd - this.bahai_to_jd(major, cycle, year, 1, 1);
    bld     = this.bahai_to_jd(major, cycle, year, 20, 1);
    month   = (jd >= bld) ? 20 : (Math.floor(days / 19) + 1);
    day     = (jd + 1) - this.bahai_to_jd(major, cycle, year, month, 1);

    return [major, cycle, year, month, day];
  }

  // Obtain Julian day for Indian Civil date
  calendar.indian_civil_to_jd = function(year, month, day) {
    var Caitra, gyear, leap, start, jd, m;

    gyear  = year + 78;
    leap   = this.leap_gregorian(gyear); // Is this a leap year ?
    start  = this.gregorian_to_jd(gyear, 3, leap ? 21 : 22);
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
  calendar.jd_to_indian_civil = function(jd) {
    var Caitra, Saka, greg, greg0, leap, start, year, month, day, yday, mday;

    // Offset in years from Saka era to Gregorian epoch
    Saka  = 79 - 1;
    // Day offset between Saka and Gregorian
    start = 80;

    jd     = Math.floor(jd) + 0.5;
    greg   = this.jd_to_gregorian(jd); // Gregorian date for Julian day
    leap   = this.leap_gregorian(greg[0]); // Is this a leap year?
    year   = greg[0] - Saka; // Tentative year in Saka era
    greg0  = this.gregorian_to_jd(greg[0], 1, 1); // JD at start of Gregorian year
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

  // Update all calendars from Gregorian.
  // *"Why not Julian date?"* you ask. Because
  // starting from Gregorian guarantees we're
  // already snapped to an integral second, so
  // we don't get roundoff errors in other calendars.
  calendar.updateFromGregorian = function() {
    var j, year, mon, mday, hour, min, sec,
      weekday, julcal, perscal, hebcal, islcal, utime, isoweek,
      may_countcal, mayhaabcal, maytzolkincal, bahcal, frrcal,
      indcal, isoday, xgregcal;

    year = new Number(data.gregorian.year);
    mon  = data.gregorian.month;
    mday = new Number(data.gregorian.day);
    hour = min = sec = 0;
    hour = new Number(data.gregorian.hour);
    min  = new Number(data.gregorian.min);
    sec  = new Number(data.gregorian.sec);

    // Update Julian day
    j = this.gregorian_to_jd(year, mon + 1, mday) +
      (Math.floor(sec + 60 * (min + 60 * hour) + 0.5) / 86400.0);

    data.julianday.day = j;
    data.modifiedjulianday.day = j - this.constants.JMJD;

    // Update day of week in Gregorian box
    weekday = astro.jwday(j);
    data.gregorian.wday = astro.constants.WEEKDAYS[weekday];

    // Update leap year status in Gregorian box
    data.gregorian.leap = this.constants.NORM_LEAP[this.leap_gregorian(year) ? 1 : 0];

    // Update Julian Calendar
    julcal = this.jd_to_julian(j);

    data.juliancalendar.year  = julcal[0];
    data.juliancalendar.month = this.constants.julian.MONTHS[julcal[1] - 1];
    data.juliancalendar.day   = julcal[2];
    data.juliancalendar.leap  = this.constants.NORM_LEAP[this.leap_julian(julcal[0]) ? 1 : 0];
    weekday                   = astro.jwday(j);
    data.juliancalendar.wday  = astro.constants.WEEKDAYS[weekday];

    // Update Hebrew Calendar
    hebcal = this.jd_to_hebrew(j);

    data.hebrew.year     = hebcal[0];
    data.hebrew.month    = this.constants.hebrew.MONTHS[hebcal[1] - 1];
    data.hebrew.day      = hebcal[2];
    data.hebrew.hebmonth = this.constants.hebrew.H_MONTHS[hebcal[1] - 1];

    switch (this.hebrew_year_days(hebcal[0])) {
    case 353:
      data.hebrew.leap = "Common deficient (353 days)";
      break;

    case 354:
      data.hebrew.leap = "Common regular (354 days)";
      break;

    case 355:
      data.hebrew.leap = "Common complete (355 days)";
      break;

    case 383:
      data.hebrew.leap = "Embolismic deficient (383 days)";
      break;

    case 384:
      data.hebrew.leap = "Embolismic regular (384 days)";
      break;

    case 385:
      data.hebrew.leap = "Embolismic complete (385 days)";
      break;

    default:
      data.hebrew.leap = "Invalid year length: " +
        this.hebrew_year_days(hebcal[0]) + " days.";
      break;
    }

    // Update Islamic Calendar
    islcal = this.jd_to_islamic(j);

    data.islamic.year  = islcal[0];
    data.islamic.month = this.constants.islamic.MONTHS[islcal[1] - 1];
    data.islamic.day   = islcal[2];
    data.islamic.wday  = "yawm " + this.constants.islamic.WEEKDAYS[weekday];
    data.islamic.leap  = this.constants.NORM_LEAP[this.leap_islamic(islcal[0]) ? 1 : 0];

    // Update Persian Calendar
    perscal = this.jd_to_persian(j);

    data.persian.year  = perscal[0];
    data.persian.month = this.constants.persian.MONTHS[perscal[1] - 1];
    data.persian.day   = perscal[2];
    data.persian.wday  = this.constants.persian.WEEKDAYS[weekday];
    data.persian.leap  = this.constants.NORM_LEAP[this.leap_persian(perscal[0]) ? 1 : 0];

    // Update Persian Astronomical Calendar
    perscal = this.jd_to_persiana(j);

    data.persiana.year  = perscal[0];
    data.persiana.month = this.constants.persian.MONTHS[perscal[1] - 1];
    data.persiana.day   = perscal[2];
    data.persiana.wday  = this.constants.persian.WEEKDAYS[weekday];
    data.persiana.leap  = this.constants.NORM_LEAP[this.leap_persiana(perscal[0]) ? 1 : 0];

    // Update Mayan Calendars
    may_countcal = this.jd_to_mayan_count(j);

    data.mayancount.baktun  = may_countcal[0];
    data.mayancount.katun   = may_countcal[1];
    data.mayancount.tun     = may_countcal[2];
    data.mayancount.uinal   = may_countcal[3];
    data.mayancount.kin     = may_countcal[4];
    mayhaabcal              = this.jd_to_mayan_haab(j);
    data.mayancount.haab    = "" + mayhaabcal[1] + " " + this.constants.mayan.HAAB_MONTHS[mayhaabcal[0] - 1];
    maytzolkincal           = this.jd_to_mayan_tzolkin(j);
    data.mayancount.tzolkin =
      "" + maytzolkincal[1] + " " + this.constants.mayan.TZOLKIN_MONTHS[maytzolkincal[0] - 1];

    // Update Bahai Calendar
    bahcal = this.jd_to_bahai(j);

    data.bahai.kull_i_shay = bahcal[0];
    data.bahai.vahid       = bahcal[1];
    data.bahai.year        = this.constants.bahai.YEARS[bahcal[2] - 1];
    data.bahai.month       = this.constants.bahai.MONTHS[bahcal[3] - 1];
    data.bahai.day         = this.constants.bahai.DAYS[bahcal[4] - 1];
    data.bahai.weekday     = this.constants.bahai.WEEKDAYS[weekday];

    // Bahai uses same leap rule as Gregorian
    data.bahai.leap = this.constants.NORM_LEAP[this.leap_gregorian(year) ? 1 : 0];

    // Update Indian Civil Calendar
    indcal = this.jd_to_indian_civil(j);

    data.indiancivilcalendar.year    = indcal[0];
    data.indiancivilcalendar.month   = this.constants.indian_civil.MONTHS[indcal[1] - 1];
    data.indiancivilcalendar.day     = indcal[2];
    data.indiancivilcalendar.weekday = this.constants.indian_civil.WEEKDAYS[weekday];
    data.indiancivilcalendar.leap    = this.constants.NORM_LEAP[this.leap_gregorian(indcal[0] + 78) ? 1 : 0];

    // Update French Republican Calendar
    frrcal = this.jd_to_french_revolutionary(j);

    data.french.an     = frrcal[0];
    data.french.mois   = this.constants.french_revolutionary.MOIS[frrcal[1] - 1];
    data.french.decade = this.constants.french_revolutionary.DECADE[frrcal[2] - 1];
    data.french.jour   =
      this.constants.french_revolutionary.JOUR[((frrcal[1] <= 12) ? frrcal[3] : (frrcal[3] + 11)) - 1];

    // Update Gregorian serial number
    if (data.gregserial != null) {
      data.gregserial.day = j - this.constants.J0000;
    }

    // Update Excel 1900 and 1904 day serial numbers
    data.excelserial1900.day = (j - this.constants.J1900) + 1 +

    // Microsoft marching morons thought 1900 was a leap year.
    // Adjust dates after 1900-02-28 to compensate for their
    // idiocy.
    ((j > 2415078.5) ? 1 : 0);
    data.excelserial1904.day = j - this.constants.J1904;

    // Update Unix time()
    utime = (j - this.constants.J1970) * (60 * 60 * 24 * 1000);

    data.unixtime.time = Math.round(utime / 1000);

    // Update ISO Week
    isoweek = this.jd_to_iso(j);

    data.isoweek.year = isoweek[0];
    data.isoweek.week = isoweek[1];
    data.isoweek.day  = isoweek[2];

    // Update ISO Day
    isoday = this.jd_to_iso_day(j);

    data.isoday.year = isoday[0];
    data.isoday.day  = isoday[1];
  }

  // Preset the fields in
  // the request form to today's date.
  calendar.setDateToToday = function() {
    var today = new Date();

    data.gregorian.year  = today.getFullYear();
    data.gregorian.month = today.getMonth();
    data.gregorian.day   = today.getDate();
    data.gregorian.hour  = 0;
    data.gregorian.min   = 0;
    data.gregorian.sec   = 0;
  }

  // Preset the fields in
  // the request form to the time passed in.
  calendar.setDateTo = function(date) {
    data.gregorian.year  = date.getFullYear();
    data.gregorian.month = date.getMonth();
    data.gregorian.day   = date.getDate();
    data.gregorian.hour  = date.getHours();
    data.gregorian.min   = date.getMinutes();
    data.gregorian.sec   = date.getSeconds();
  }

  // Preset the fields in
  // the request form to the time now.
  calendar.setDateToNow = function() {
    var today = new Date();

    this.setDateTo(today);
  }

  // Update the internal data representation
  // once per second
  calendar.start = function() {
    exports.intervalId = window.setInterval(function() {
      calendar.setDateTo(new Date());
      calendar.calcGregorian();
    }, 1000);

    return exports;
  }

  // Clear the interval to stop the updating
  calendar.stop = function() {
    window.clearInterval(exports.intervalId);

    return exports;
  }

  // Preset the Gregorian date to the
  // date requested by the URL
  // search field.
  calendar.presetDataToRequest = function(s) {
    var eq = s.indexOf("=");
    var set = false;
    if (eq != -1) {
      var calendar = s.substring(0, eq),
        date = decodeURIComponent(s.substring(eq + 1));
      if (calendar.toLowerCase() == "gregorian") {
        var d = date.match(/^(\d+)\D(\d+)\D(\d+)(\D\d+)?(\D\d+)?(\D\d+)?/);
        if (d != null) {
          // Sanity check date and time components
          if ((d[2] >= 1) && (d[2] <= 12) &&
            (d[3] >= 1) && (d[3] <= 31) &&
            ((d[4] == undefined) ||
              ((d[4].substring(1) >= 0) && (d[4].substring(1) <= 23))) &&
            ((d[5] == undefined) ||
              ((d[5].substring(1) >= 0) && (d[5].substring(1) <= 59))) &&
            ((d[6] == undefined) ||
              ((d[6].substring(1) >= 0) && (d[6].substring(1) <= 59)))) {
            data.gregorian.year  = d[1];
            data.gregorian.month = d[2] - 1;
            data.gregorian.day   = Number(d[3]);
            data.gregorian.hour  = d[4] == undefined ? 0 :
              d[4].substring(1);
            data.gregorian.min = d[5] == undefined ? 0 :
              d[5].substring(1);
            data.gregorian.sec = d[6] == undefined ? 0 :
              d[6].substring(1);
            this.calcGregorian();
            set = true;
          } else {
            alert("Invalid Gregorian date \"" + date +
              "\" in search request");
          }
        } else {
          alert("Invalid Gregorian date \"" + date +
            "\" in search request");
        }

      } else if (calendar.toLowerCase() == "julian") {
        var d = date.match(/^(\d+)\D(\d+)\D(\d+)(\D\d+)?(\D\d+)?(\D\d+)?/);
        if (d != null) {
          // Sanity check date and time components
          if ((d[2] >= 1) && (d[2] <= 12) &&
            (d[3] >= 1) && (d[3] <= 31) &&
            ((d[4] == undefined) ||
              ((d[4].substring(1) >= 0) && (d[4].substring(1) <= 23))) &&
            ((d[5] == undefined) ||
              ((d[5].substring(1) >= 0) && (d[5].substring(1) <= 59))) &&
            ((d[6] == undefined) ||
              ((d[6].substring(1) >= 0) && (d[6].substring(1) <= 59)))) {
            data.juliancalendar.year = d[1];
            data.juliancalendar.month.selectedIndex = d[2] - 1;
            data.juliancalendar.day = Number(d[3]);
            this.calcJulianCalendar();
            data.gregorian.hour = d[4] == undefined ? 0 :
              d[4].substring(1);
            data.gregorian.min = d[5] == undefined ? 0 :
              d[5].substring(1);
            data.gregorian.sec = d[6] == undefined ? 0 :
              d[6].substring(1);
            set = true;
          } else {
            alert("Invalid Julian calendar date \"" + date +
              "\" in search request");
          }
        } else {
          alert("Invalid Julian calendar date \"" + date +
            "\" in search request");
        }

      } else if (calendar.toLowerCase() == "jd") {
        var d = date.match(/^(\-?\d+\.?\d*)/);
        if (d != null) {
          this.setJulian(d[1]);
          set = 1;
        } else {
          alert("Invalid Julian day \"" + date +
            "\" in search request");
        }

      } else if (calendar.toLowerCase() == "mjd") {
        var d = date.match(/^(\-?\d+\.?\d*)/);
        if (d != null) {
          data.modifiedjulianday.day = d[1];
          this.calcModifiedJulian();
          set = 1;
        } else {
          alert("Invalid Modified Julian day \"" + date +
            "\" in search request");
        }

      } else if (calendar.toLowerCase() == "unixtime") {
        var d = date.match(/^(\-?\d+\.?\d*)/);
        if (d != null) {
          data.unixtime.time = d[1];
          this.calcUnixTime();
          set = 1;
        } else {
          alert("Invalid Modified Julian day \"" + date +
            "\" in search request");
        }

      } else if (calendar.toLowerCase() == "iso") {
        var d;
        if ((d = date.match(/^(\-?\d+)\-(\d\d\d)/)) != null) {
          data.isoday.year = d[1];
          data.isoday.day = d[2];
          this.calcIsoDay();
          set = 1;
        } else if ((d = date.match(/^(\-?\d+)\-?W(\d\d)\-?(\d)/i)) != null) {
          data.isoweek.year = d[1];
          data.isoweek.week = d[2];
          data.isoweek.day = d[3];
          this.calcIsoWeek();
          set = 1;
        } else {
          alert("Invalid ISO-8601 date \"" + date +
            "\" in search request");
        }

      } else if (calendar.toLowerCase() == "excel") {
        var d = date.match(/^(\-?\d+\.?\d*)/);
        if (d != null) {
          data.excelserial1900.day = d[1];
          this.calcExcelSerial1900();
          set = 1;
        } else {
          alert("Invalid Excel serial day (1900/PC) \"" + date +
            "\" in search request");
        }

      } else if (calendar.toLowerCase() == "excel1904") {
        var d = date.match(/^(\-?\d+\.?\d*)/);
        if (d != null) {
          data.excelserial1904.day = d[1];
          this.calcExcelSerial1904();
          set = 1;
        } else {
          alert("Invalid Excel serial day (1904/Mac) \"" + date +
            "\" in search request");
        }

      } else {
        alert("Invalid calendar \"" + calendar +
          "\" in search request");
      }
    } else {
      alert("Invalid search request: " + s);
    }

    if (!set) {
      this.setDateToToday();
      this.calcGregorian();
    }
  }

  return exports;
}(Ephemerides || {}));
