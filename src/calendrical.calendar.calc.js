/* global Calendrical:true */

"use strict";

(function (exports) {
  var astro, calendar, data;

  exports.calendar = exports.calendar || {};
  astro    = exports.astro;
  calendar = exports.calendar;
  data     = exports.data;

  /**
   * Pad a string to a given length with a given fill character.
   * @param {String} str initial string
   * @param {int} length max. length
   * @param {character} filler the character to fill in the gaps
   * @return {String} padded String
   */
  function pad (str, length, filler) {
    var s0 = str.toString ();

    while (s0.length < length) {
      s0 = filler + s0;
    }

    return s0;
  }

  // Perform calculation starting with a Gregorian date
  calendar.calcGregorian = function () {
    this.updateFromGregorian ();
  };

  // Perform calculation starting with a Julian date
  calendar.calcJulian = function () {
    var jd, date, time;

    jd   = data.julianday.day;
    date = this.jdToGregorian (jd);
    time = astro.jhms (jd);

    data.gregorian.year  = date[0];
    data.gregorian.month = date[1] - 1;
    data.gregorian.day   = date[2];
    data.gregorian.hour  = pad (time[0], 2, ' ');
    data.gregorian.min   = pad (time[1], 2, '0');
    data.gregorian.sec   = pad (time[2], 2, '0');

    this.updateFromGregorian ();
  };

  // Set Julian date and update all calendars
  calendar.setJulian = function (jd) {
    data.julianday.day = jd;
    this.calcJulian ();
  };

  // Update from Modified Julian day
  calendar.calcModifiedJulian = function () {
    this.setJulian (data.modifiedjulianday.day + calendar.constants.JMJD);
  };

  // Update from Julian calendar
  calendar.calcJulianCalendar = function () {
    this.setJulian (this.julianToJd (data.juliancalendar.year),
        data.juliancalendar.month.selectedIndex + 1,
        data.juliancalendar.day);
  };

  // Update from Hebrew calendar
  calendar.calcHebrew = function () {
    this.setJulian (this.hebrewToJd (data.hebrew.year),
      data.hebrew.month.selectedIndex + 1, data.hebrew.day);
  };

  // Update from Islamic calendar
  calendar.calcIslamic = function () {
    this.setJulian (this.islamicToJd (data.islamic.year,
      data.islamic.month.selectedIndex + 1, data.islamic.day));
  };

  // Update from Persian calendar
  calendar.calcPersian = function () {
    this.setJulian (this.persianToJd (data.persian.year,
      data.persian.month.selectedIndex + 1, data.persian.day));
  };

  // Update from Persian algorithmic calendar
  calendar.calcPersiana = function () {
    this.setJulian (this.persianaToJd (data.persiana.year,
      data.persiana.month.selectedIndex + 1, data.persiana.day) + 0.5);
  };

  // Update from the Mayan Long Count
  calendar.calcMayanCount = function () {
    this.setJulian (this.mayanCountToJd (
      data.mayancount.baktun,
      data.mayancount.katun,
      data.mayancount.tun,
      data.mayancount.uinal,
      data.mayancount.kin));
  };

  // Update from Bahai calendar
  calendar.calcBahai = function () {
    this.setJulian (this.bahaiToJd (
      data.bahai.kull_i_shay,
      data.bahai.vahid,
      data.bahai.year.selectedIndex + 1,
      data.bahai.month.selectedIndex + 1,
      data.bahai.day.selectedIndex + 1));
  };

  // Update from Indian Civil Calendar
  calendar.calcIndianCivilCalendar = function () {
    this.setJulian (this.indianCivilToJd (
      data.indiancivilcalendar.year,
      data.indiancivilcalendar.month.selectedIndex + 1,
      data.indiancivilcalendar.day));
  };

  // Update from French Republican calendar
  calendar.calcFrench = function () {
    var decade, jours, mois;

    jours  = data.french.jour.selectedIndex;
    decade = data.french.decade.selectedIndex;
    mois   = data.french.mois.selectedIndex;

    // If the currently selected day is one of the sansculottides,
    // adjust the index to be within that period and force the
    // decade to zero and the month to 12, designating the
    // intercalary interval.
    if (jours > 9) {
      jours -= 11;
      decade = 0;
      mois = 12;
    }

    // If the selected month is the pseudo-month of the five or
    // six sansculottides, ensure that the decade is 0 and the day
    // number doesn't exceed six. To avoid additional overhead, we
    // don't test whether a day number of 6 is valid for this year,
    // but rather simply permit it to wrap into the first day of
    // the following year if this is a 365 day year.
    if (mois === 12) {
      decade = 0;

      if (jours > 5) {
        jours = 0;
      }
    }

    this.setJulian (this.frenchRevolutionaryToJd (data.french.an,
      mois + 1,
      decade + 1,
      jours + 1));
  };

  // Update from Gregorian serial day number
  calendar.calcGregSerial = function () {
    this.setJulian (data.gregserial.day + calendar.constants.J0000);
  };

  // Perform calculation starting with an Excel 1900 serial date
  calendar.calcExcelSerial1900 = function () {
    var day = data.excelserial1900.day;

    // Idiot Kode Kiddies didn't twig to the fact
    // (proclaimed in 1582) that 1900 wasn't a leap year,
    // so every Excel day number in every database on Earth
    // which represents a date subsequent to February 28,
    // 1900 is off by one. Note that there is no
    // acknowledgement of this betrayal or warning of its
    // potential consequences in the Excel help file. Thank
    // you so much Mister Talking Paper Clip. Some day
    // we're going to celebrate your extinction like it was
    // February 29 ... 1900.
    if (day > 60) {
      day -= 1;
    }

    this.setJulian (day - 1 + calendar.constants.J1900);
  };

  // Perform calculation starting with an Excel 1904 serial date
  calendar.calcExcelSerial1904 = function () {
    this.setJulian (data.excelserial1904.day + calendar.constants.J1904);
  };

  // Update from specified Unix time () value
  calendar.calcUnixTime = function () {
    var time = data.unixtime.time;

    this.setJulian (calendar.constants.J1970 + time / (60 * 60 * 24));
  };

  // Update from specified ISO year, week, and day
  calendar.calcIsoWeek = function () {
    var year = data.isoweek.year,
        week = data.isoweek.week,
        day = data.isoweek.day;

    this.setJulian (calendar.isoToJulian (year, week, day));
  };

  // Update from specified ISO year and day of year
  calendar.calcIsoDay = function () {
    var year = data.isoday.year,
        day = data.isoday.day;

    this.setJulian (this.isoDayToJulian (year, day));
  };

  return exports;
} (Calendrical || {}));
