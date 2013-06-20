var Ephemerides = (function(exports) {
  "use strict";

  exports.calendar = exports.calendar || {};
  var calendar = exports.calendar;

  // Perform calculation starting with a Gregorian date
  calendar.calcGregorian = function() {
    this.updateFromGregorian();
  }

  // Perform calculation starting with a Julian date
  calendar.calcJulian = function() {
    var j, date, time;

    j    = new Number(data.julianday.day);
    date = this.jdToGregorian(j);
    time = jhms(j);

    data.gregorian.year  = date[0];
    data.gregorian.month = date[1] - 1;
    data.gregorian.day   = date[2];
    data.gregorian.hour  = pad(time[0], 2, " ");
    data.gregorian.min   = pad(time[1], 2, "0");
    data.gregorian.sec   = pad(time[2], 2, "0");

    this.updateFromGregorian();
  }

  // Set Julian date and update all calendars
  calendar.setJulian = function(j) {
    data.julianday.day = new Number(j);
    this.calcJulian();
  }

  // Update from Modified Julian day
  calendar.calcModifiedJulian = function() {
    this.setJulian((new Number(data.modifiedjulianday.day)) + JMJD);
  }

  // Update from Julian calendar
  calendar.calcJulianCalendar = function() {
    this.setJulian(this.julianToJd((new Number(data.juliancalendar.year)),
      data.juliancalendar.month.selectedIndex + 1, (new Number(data.juliancalendar.day))));
  }

  // Update from Hebrew calendar
  calendar.calcHebrew = function() {
    this.setJulian(this.hebrewToJd((new Number(data.hebrew.year)),
      data.hebrew.month.selectedIndex + 1, (new Number(data.hebrew.day))));
  }

  // Update from Islamic calendar
  calendar.calcIslamic = function() {
    this.setJulian(this.islamicToJd((new Number(data.islamic.year)),
      data.islamic.month.selectedIndex + 1, (new Number(data.islamic.day))));
  }

  // Update from Persian calendar
  calendar.calcPersian = function() {
    this.setJulian(this.persianToJd((new Number(data.persian.year)),
      data.persian.month.selectedIndex + 1, (new Number(data.persian.day))));
  }

  // Update from Persian astronomical calendar
  calendar.calcPersiana = function() {
    this.setJulian(this.persianaToJd((new Number(data.persiana.year)),
      data.persiana.month.selectedIndex + 1, (new Number(data.persiana.day))) + 0.5);
  }

  // Update from the Mayan Long Count
  calendar.calcMayanCount = function() {
    this.setJulian(this.mayanCountToJd(
      (new Number(data.mayancount.baktun)), (new Number(data.mayancount.katun)), (new Number(data.mayancount.tun)), (new Number(data.mayancount.uinal)), (new Number(data.mayancount.kin))));
  }

  // Update from Bahai calendar
  calendar.calcBahai = function() {
    this.setJulian(this.bahaiToJd((new Number(data.bahai.kull_i_shay)), (new Number(data.bahai.vahid)),
      data.bahai.year.selectedIndex + 1,
      data.bahai.month.selectedIndex + 1,
      data.bahai.day.selectedIndex + 1));
  }

  // Update from Indian Civil Calendar
  calendar.calcIndianCivilCalendar = function() {
    this.setJulian(this.indianCivilToJd(
      (new Number(data.indiancivilcalendar.year)),
      data.indiancivilcalendar.month.selectedIndex + 1, (new Number(data.indiancivilcalendar.day))));
  }

  // Update from French Republican calendar
  calendar.calcFrench = function() {
    var decade, j, mois;

    j      = data.french.jour.selectedIndex;
    decade = data.french.decade.selectedIndex;
    mois   = data.french.mois.selectedIndex;

    // If the currently selected day is one of the sansculottides,
    // adjust the index to be within that period and force the
    // decade to zero and the month to 12, designating the
    // intercalary interval.
    if (j > 9) {
      j -= 11;
      decade = 0;
      mois = 12;
    }

    // If the selected month is the pseudo-month of the five or
    // six sansculottides, ensure that the decade is 0 and the day
    // number doesn't exceed six. To avoid additional overhead, we
    // don't test whether a day number of 6 is valid for this year,
    // but rather simply permit it to wrap into the first day of
    // the following year if this is a 365 day year.
    if (mois == 12) {
      decade = 0;

      if (j > 5) { j = 0; }
    }

    this.setJulian(this.frenchRevolutionaryToJd((new Number(data.french.an)),
      mois + 1,
      decade + 1,
      j + 1));
  }

  // Update from Gregorian serial day number
  calendar.calcGregSerial = function() {
    this.setJulian((new Number(data.gregserial.day)) + J0000);
  }

  // Perform calculation starting with an Excel 1900 serial date
  calendar.calcExcelSerial1900 = function() {
    var d = new Number(data.excelserial1900.day);

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
    if (d > 60) { d--; }

    this.setJulian((d - 1) + J1900);
  }

  // Perform calculation starting with an Excel 1904 serial date
  calendar.calcExcelSerial1904 = function() {
    this.setJulian((new Number(data.excelserial1904.day)) + J1904);
  }

  // Update from specified Unix time() value
  calendar.calcUnixTime = function() {
    var t = new Number(data.unixtime.time);

    this.setJulian(J1970 + (t / (60 * 60 * 24)));
  }

  // Update from specified ISO year, week, and day
  calendar.calcIsoWeek = function() {
    var year = new Number(data.isoweek.year),
        week = new Number(data.isoweek.week),
         day = new Number(data.isoweek.day);

    this.setJulian(iso_to_julian(year, week, day));
  }

  // Update from specified ISO year and day of year
  calendar.calcIsoDay = function() {
    var year = new Number(data.isoday.year),
      day = new Number(data.isoday.day);

    this.setJulian(this.isoDayToJulian(year, day));
  }

  return exports;
}(Ephemerides || {}));
