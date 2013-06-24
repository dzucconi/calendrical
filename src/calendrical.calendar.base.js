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
    var j, year, mon, mday, hour, min, sec,
      weekday, julcal, perscal, hebcal, islcal, utime, iso_week,
      may_countcal, mayhaabcal, maytzolkincal, bahcal, frrcal,
      indcal, iso_day, xgregcal;

    year = new Number(data.gregorian.year);
    mon  = data.gregorian.month;
    mday = new Number(data.gregorian.day);
    hour = min = sec = 0;
    hour = new Number(data.gregorian.hour);
    min  = new Number(data.gregorian.min);
    sec  = new Number(data.gregorian.sec);

    // Update Julian day
    j = this.gregorianToJd(year, mon + 1, mday) +
      (Math.floor(sec + 60 * (min + 60 * hour) + 0.5) / 86400.0);

    data.julian_day.day = j;
    data.modified_julian_day.day = j - this.constants.JMJD;

    // Update day of week in Gregorian box
    weekday = astro.jwday(j);
    data.gregorian.wday = astro.constants.WEEKDAYS[weekday];

    // Update leap year status in Gregorian box
    data.gregorian.leap = this.constants.NORM_LEAP[this.leapGregorian(year) ? 1 : 0];

    // Update Julian Calendar
    julcal = this.jdToJulian(j);

    data.julian.year  = julcal[0];
    data.julian.month = this.constants.julian.MONTHS[julcal[1] - 1];
    data.julian.day   = julcal[2];
    data.julian.leap  = this.constants.NORM_LEAP[this.leapJulian(julcal[0]) ? 1 : 0];
    weekday                   = astro.jwday(j);
    data.julian.wday  = astro.constants.WEEKDAYS[weekday];

    // Update Hebrew Calendar
    hebcal = this.jdToHebrew(j);

    data.hebrew.year     = hebcal[0];
    data.hebrew.month    = this.constants.hebrew.MONTHS[hebcal[1] - 1];
    data.hebrew.day      = hebcal[2];
    data.hebrew.hebmonth = this.constants.hebrew.H_MONTHS[hebcal[1] - 1];

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

    // Update Islamic Calendar
    islcal = this.jdToIslamic(j);

    data.islamic.year  = islcal[0];
    data.islamic.month = this.constants.islamic.MONTHS[islcal[1] - 1];
    data.islamic.day   = islcal[2];
    data.islamic.wday  = "yawm " + this.constants.islamic.WEEKDAYS[weekday];
    data.islamic.leap  = this.constants.NORM_LEAP[this.leapIslamic(islcal[0]) ? 1 : 0];

    // Update Persian Calendar
    perscal = this.jdToPersian(j);

    data.persian.year  = perscal[0];
    data.persian.month = this.constants.persian.MONTHS[perscal[1] - 1];
    data.persian.day   = perscal[2];
    data.persian.wday  = this.constants.persian.WEEKDAYS[weekday];
    data.persian.leap  = this.constants.NORM_LEAP[this.leapPersian(perscal[0]) ? 1 : 0];

    // Update Persian Astronomical Calendar
    perscal = this.jdToPersiana(j);

    data.persian_algorithmic.year  = perscal[0];
    data.persian_algorithmic.month = this.constants.persian.MONTHS[perscal[1] - 1];
    data.persian_algorithmic.day   = perscal[2];
    data.persian_algorithmic.wday  = this.constants.persian.WEEKDAYS[weekday];
    data.persian_algorithmic.leap  = this.constants.NORM_LEAP[this.leapPersiana(perscal[0]) ? 1 : 0];

    // Update Mayan Calendars
    may_countcal = this.jdToMayanCount(j);

    data.mayan_count.baktun  = may_countcal[0];
    data.mayan_count.katun   = may_countcal[1];
    data.mayan_count.tun     = may_countcal[2];
    data.mayan_count.uinal   = may_countcal[3];
    data.mayan_count.kin     = may_countcal[4];
    mayhaabcal               = this.jdToMayanHaab(j);
    data.mayan_count.haab    = "" + mayhaabcal[1] + " " + this.constants.mayan.HAAB_MONTHS[mayhaabcal[0] - 1];
    maytzolkincal            = this.jdToMayanTzolkin(j);
    data.mayan_count.tzolkin =
      "" + maytzolkincal[1] + " " + this.constants.mayan.TZOLKIN_MONTHS[maytzolkincal[0] - 1];

    // Update Bahai Calendar
    bahcal = this.jdToBahai(j);

    data.bahai.kull_i_shay = bahcal[0];
    data.bahai.vahid       = bahcal[1];
    data.bahai.year        = this.constants.bahai.YEARS[bahcal[2] - 1];
    data.bahai.month       = this.constants.bahai.MONTHS[bahcal[3] - 1];
    data.bahai.day         = this.constants.bahai.DAYS[bahcal[4] - 1];
    data.bahai.weekday     = this.constants.bahai.WEEKDAYS[weekday];

    // Bahai uses same leap rule as Gregorian
    data.bahai.leap = this.constants.NORM_LEAP[this.leapGregorian(year) ? 1 : 0];

    // Update Indian Civil Calendar
    indcal = this.jdToIndianCivil(j);

    data.indian_civil.year    = indcal[0];
    data.indian_civil.month   = this.constants.indian_civil.MONTHS[indcal[1] - 1];
    data.indian_civil.day     = indcal[2];
    data.indian_civil.weekday = this.constants.indian_civil.WEEKDAYS[weekday];
    data.indian_civil.leap    = this.constants.NORM_LEAP[this.leapGregorian(indcal[0] + 78) ? 1 : 0];

    // Update French Republican Calendar
    frrcal = this.jdToFrenchRevolutionary(j);

    data.french.an     = frrcal[0];
    data.french.mois   = this.constants.french_revolutionary.MOIS[frrcal[1] - 1];
    data.french.decade = this.constants.french_revolutionary.DECADE[frrcal[2] - 1];
    data.french.jour   =
      this.constants.french_revolutionary.JOUR[((frrcal[1] <= 12) ? frrcal[3] : (frrcal[3] + 11)) - 1];

    // Update Gregorian serial number
    if (data.gregorian_serial != null) {
      data.gregorian_serial.day = j - this.constants.J0000;
    }

    // Update Excel 1900 and 1904 day serial numbers
    data.excel_serial_1900.day = (j - this.constants.J1900) + 1 +

    // Microsoft marching morons thought 1900 was a leap year.
    // Adjust dates after 1900-02-28 to compensate for their
    // idiocy.
    ((j > 2415078.5) ? 1 : 0);
    data.excel_serial_1904.day = j - this.constants.J1904;

    // Update Unix time()
    utime = (j - this.constants.J1970) * (60 * 60 * 24 * 1000);

    data.unix_time.time = Math.round(utime / 1000);

    // Update ISO Week
    iso_week = this.jdToIso(j);

    data.iso_week.year = iso_week[0];
    data.iso_week.week = iso_week[1];
    data.iso_week.day  = iso_week[2];

    // Update ISO Day
    iso_day = this.jdToIsoDay(j);

    data.iso_day.year = iso_day[0];
    data.iso_day.day  = iso_day[1];
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
