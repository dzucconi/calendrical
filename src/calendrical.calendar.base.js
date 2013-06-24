var Calendrical = (function(exports){
  "use strict";

  exports.calendar = exports.calendar || {};
  exports.data = exports.data || {
    bahai: {},
    excel_serial_1900: {},
    excel_serial_1904: {},
    french: {},
    gregorian: {},
    gregorian_serial: {},
    hebrew: {},
    indian_civil: {},
    islamic: {},
    iso_day: {},
    iso_week: {},
    julian: {},
    julian_day: {},
    mayan_count: {},
    modified_julian_day: {},
    persian: {},
    persian_algorithmic: {},
    unix_time: {}
  };

  // Aliases
  var astro    = exports.astro,
      calendar = exports.calendar,
      data     = exports.data;

  // Return Julian date of given weekday (0 = Sunday)
  // in the seven days ending on jd.
  calendar.weekdayBefore = function(weekday, jd) {
    return jd - astro.jwday(jd - weekday);
  }

  // Determine the Julian date for:
  //
  // **weekday**      Day of week desired, 0 = Sunday
  // **jd**           Julian date to begin search
  // **direction**    1 = next weekday, -1 = last weekday
  // **offset**       Offset from jd to begin search
  calendar.searchWeekday = function(weekday, jd, direction, offset) {
    return this.weekdayBefore(weekday, jd + (direction * offset));
  }

  // Utility weekday functions, just wrappers for search_weekday
  calendar.nearestWeekday = function(weekday, jd) {
    return this.searchWeekday(weekday, jd, 1, 3);
  }

  calendar.nextWeekday = function(weekday, jd) {
    return this.searchWeekday(weekday, jd, 1, 7);
  }

  calendar.nextOrCurrentWeekday = function(weekday, jd) {
    return this.searchWeekday(weekday, jd, 1, 6);
  }

  calendar.previousWeekday = function(weekday, jd) {
    return this.searchWeekday(weekday, jd, -1, 1);
  }

  calendar.previousOrCurrentWeekday = function(weekday, jd) {
    return this.searchWeekday(weekday, jd, 1, 0);
  }

  // Update all calendars from Gregorian.
  // *"Why not Julian date?"* you ask. Because
  // starting from Gregorian guarantees we're
  // already snapped to an integral second, so
  // we don't get roundoff errors in other calendars.
  calendar.updateFromGregorian = function() {
    var jd, year, mon, day, hour, min, sec, weekday;

    year = data.gregorian.year;
    mon  = data.gregorian.month;
    day  = data.gregorian.day;
    hour = min = sec = 0;
    hour = data.gregorian.hour;
    min  = data.gregorian.min;
    sec  = data.gregorian.sec;

    // Update Julian day (fractional day)
    jd = this.gregorianToJd(year, mon + 1, day) +
      (Math.floor(sec + 60 * (min + 60 * hour) + 0.5) / 86400.0);

    data.julian_day.day = jd;

    this.augmentGregorian(jd);

    this.updateModifiedJulianDay(jd);
    this.updateJulian(jd);
    this.updateHebrew(jd);
    this.updateIslamic(jd);
    this.updatePersian(jd);
    this.updatePersiana(jd);
    this.updateMayan(jd);
    this.updateBahai(jd);
    this.updateIndianCivil(jd);
    this.updateFrenchRevolutionary(jd);
    this.updateGregorianSerial(jd);
    this.updateExcel1900(jd);
    this.updateExcel1904(jd);
    this.updateUnixTime(jd);
    this.updateIsoWeek(jd);
    this.updateIsoDay(jd);
  }

  calendar.updateModifiedJulianDay = function(jd) {
    data.modified_julian_day = {
      day: (jd - this.constants.JMJD)
    }

    return data.modified_julian_day;
  }

  // Update the Julian data representation
  calendar.updateJulian = function(jd) {
    var julcal = this.jdToJulian(jd);

    data.julian = {
      year  : julcal[0],
      month : this.constants.julian.MONTHS[julcal[1] - 1],
      day   : julcal[2],
      leap  : this.leapJulian(julcal[0]),
      wday  : astro.constants.WEEKDAYS[astro.jwday(jd)]
    }

    return data.julian;
  }

  // Update the Hebrew data representation
  calendar.updateHebrew = function(jd) {
    var hebcal = this.jdToHebrew(jd);

    data.hebrew = {
      year     : hebcal[0],
      month    : this.constants.hebrew.MONTHS[hebcal[1] - 1],
      day      : hebcal[2],
      hebmonth : this.constants.hebrew.H_MONTHS[hebcal[1] - 1]
    }

    switch (this.hebrewYearDays(hebcal[0])) {
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
        this.hebrewYearDays(hebcal[0]) + " days.";
      break;
    }

    return data.hebrew;
  }

  // Update the Islamic data representation
  calendar.updateIslamic = function(jd) {
    var islcal = this.jdToIslamic(jd);

    data.islamic = {
      year  : islcal[0],
      month : this.constants.islamic.MONTHS[islcal[1] - 1],
      day   : islcal[2],
      wday  : "yawm " + this.constants.islamic.WEEKDAYS[astro.jwday(jd)],
      leap  : this.leapIslamic(islcal[0])
    }

    return data.islamic;
  }

  // Update the Persian data representation
  calendar.updatePersian = function(jd) {
    var perscal = this.jdToPersian(jd);

    data.persian = {
      year  : perscal[0],
      month : this.constants.persian.MONTHS[perscal[1] - 1],
      day   : perscal[2],
      wday  : this.constants.persian.WEEKDAYS[astro.jwday(jd)],
      leap  : this.leapPersian(perscal[0])
    }

    return data.persian;
  }

  // Update the Persian algorithmic data representation
  calendar.updatePersiana = function(jd) {
    var perscal = this.jdToPersiana(jd);

    data.persian_algorithmic = {
      year  : perscal[0],
      month : this.constants.persian.MONTHS[perscal[1] - 1],
      day   : perscal[2],
      wday  : this.constants.persian.WEEKDAYS[astro.jwday(jd)],
      leap  : this.leapPersiana(perscal[0])
    }

    return data.persian_algorithmic;
  }

  // Update the Mayan data representation
  calendar.updateMayan = function(jd) {
    var mayancal = this.jdToMayanCount(jd),
        mayhaabcal = this.jdToMayanHaab(jd),
        maytzolkincal = this.jdToMayanTzolkin(jd);

    data.mayan_count = {
      baktun  : mayancal[0],
      katun   : mayancal[1],
      tun     : mayancal[2],
      uinal   : mayancal[3],
      kin     : mayancal[4],
      haab    : mayhaabcal[1] + " " + this.constants.mayan.HAAB_MONTHS[mayhaabcal[0] - 1],
      tzolkin : maytzolkincal[1] + " " + this.constants.mayan.TZOLKIN_MONTHS[maytzolkincal[0] - 1]
    }

    return data.mayan_count;
  }

  // Update the Bahai data representation
  calendar.updateBahai = function(jd) {
    var bahcal = this.jdToBahai(jd);

    data.bahai = {
      kull_i_shay : bahcal[0],
      vahid       : bahcal[1],
      year        : this.constants.bahai.YEARS[bahcal[2] - 1],
      month       : this.constants.bahai.MONTHS[bahcal[3] - 1],
      day         : this.constants.bahai.DAYS[bahcal[4] - 1],
      weekday     : this.constants.bahai.WEEKDAYS[astro.jwday(jd)]
    }

    // Bahai uses same leap rule as Gregorian
    data.bahai.leap = this.leapGregorian(this.jdToGregorianYear(jd));

    return data.bahai;
  }

  // Update the Indian Civil data representation
  calendar.updateIndianCivil = function(jd) {
    var indcal = this.jdToIndianCivil(jd);

    data.indian_civil = {
      year    : indcal[0],
      month   : this.constants.indian_civil.MONTHS[indcal[1] - 1],
      day     : indcal[2],
      weekday : this.constants.indian_civil.WEEKDAYS[astro.jwday(jd)],
      leap    : this.leapGregorian(indcal[0] + 78)
    }

    return data.indian_civil;
  }

  // Update the French data representation
  calendar.updateFrenchRevolutionary = function(jd) {
    var frrcal = this.jdToFrenchRevolutionary(jd);

    data.french = {
      an: frrcal[0],
      mois: this.constants.french_revolutionary.MOIS[frrcal[1] - 1],
      decade: this.constants.french_revolutionary.DECADE[frrcal[2] - 1],
      jour: this.constants.french_revolutionary.JOUR[((frrcal[1] <= 12) ? frrcal[3] : (frrcal[3] + 11)) - 1]
    }

    return data.french;
  }

  // Update the Gregorian Serial data representation
  calendar.updateGregorianSerial = function(jd) {
    data.gregorian_serial = {
      day: (jd - this.constants.J0000)
    }

    return data.gregorian_serial;
  }

  // Update the Excel 1900 data representation
  calendar.updateExcel1900 = function(jd) {
    data.excel_serial_1900.day = (jd - this.constants.J1900) + 1 +

    // Microsoft marching morons thought 1900 was a leap year.
    // Adjust dates after 1900-02-28 to compensate for their idiocy.
    ((jd > 2415078.5) ? 1 : 0);

    return data.excel_serial_1900;
  }

  // Update the Excel 1904 data representation
  calendar.updateExcel1904 = function(jd) {
    data.excel_serial_1904 = {
      day: (jd - this.constants.J1904)
    }

    return data.excel_serial_1904;
  }

  // Update the Unix Time data representation
  calendar.updateUnixTime = function(jd) {
    var utime = (jd - this.constants.J1970) * (60 * 60 * 24 * 1000);

    data.unix_time = {
      time: Math.round(utime / 1000)
    }

    return data.unix_time;
  }

  // Update the ISO Week data representation
  calendar.updateIsoWeek = function(jd) {
    var iso_week = this.jdToIso(jd);

    data.iso_week = {
      year : iso_week[0],
      week : iso_week[1],
      day  : iso_week[2]
    }

    return data.iso_week;
  }

  // Update the ISO Day data representation
  calendar.updateIsoDay = function(jd) {
    var iso_day = this.jdToIsoDay(jd);

    data.iso_day = {
      year : iso_day[0],
      day  : iso_day[1]
    }

    return data.iso_day;
  }

  // Augment the Gregorian data representation
  // with weekday and leap
  calendar.augmentGregorian = function(jd) {
    data.gregorian.wday = astro.constants.WEEKDAYS[astro.jwday(jd)];
    data.gregorian.leap = this.leapGregorian(data.gregorian.year);

    return data.gregorian;
  }

  // Sets the Gregorian fields in the data representation
  calendar.setDateTo = function(date) {
    data.gregorian = {
      year  : date.getFullYear(),
      month : date.getMonth(),
      day   : date.getDate(),
      hour  : date.getHours(),
      min   : date.getMinutes(),
      sec   : date.getSeconds()
    }

    return data.gregorian;
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
      calendar.updateTo();
    }, 1000);

    return this;
  }

  // Clear the interval to stop the updating
  calendar.stop = function() {
    window.clearInterval(exports.intervalId);

    return this;
  }

  // Update the data representation to the specified date
  // If no date is passed in then the data representation
  // is updated to the time of invocation
  calendar.updateTo = function(date) {
    if (typeof(a) === "undefined") { date = new Date(); }

    this.setDateTo(date);
    this.calcGregorian();

    return this;
  }

  return exports;
}(Calendrical || {}));
