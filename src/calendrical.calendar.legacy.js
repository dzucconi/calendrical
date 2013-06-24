// todo:
var Calendrical = (function(exports){
  "use strict";

  exports.calendar = exports.calendar || {};

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
            data.julian.year = d[1];
            data.julian.month.selectedIndex = d[2] - 1;
            data.julian.day = Number(d[3]);
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
          data.modified_julian_day.day = d[1];
          this.calcModifiedJulian();
          set = 1;
        } else {
          alert("Invalid Modified Julian day \"" + date +
            "\" in search request");
        }

      } else if (calendar.toLowerCase() == "unix_time") {
        var d = date.match(/^(\-?\d+\.?\d*)/);
        if (d != null) {
          data.unix_time.time = d[1];
          this.calcUnixTime();
          set = 1;
        } else {
          alert("Invalid Modified Julian day \"" + date +
            "\" in search request");
        }

      } else if (calendar.toLowerCase() == "iso") {
        var d;
        if ((d = date.match(/^(\-?\d+)\-(\d\d\d)/)) != null) {
          data.iso_day.year = d[1];
          data.iso_day.day = d[2];
          this.calcIsoDay();
          set = 1;
        } else if ((d = date.match(/^(\-?\d+)\-?W(\d\d)\-?(\d)/i)) != null) {
          data.iso_week.year = d[1];
          data.iso_week.week = d[2];
          data.iso_week.day = d[3];
          this.calcIsoWeek();
          set = 1;
        } else {
          alert("Invalid ISO-8601 date \"" + date +
            "\" in search request");
        }

      } else if (calendar.toLowerCase() == "excel") {
        var d = date.match(/^(\-?\d+\.?\d*)/);
        if (d != null) {
          data.excel_serial_1900.day = d[1];
          this.calcExcelSerial1900();
          set = 1;
        } else {
          alert("Invalid Excel serial day (1900/PC) \"" + date +
            "\" in search request");
        }

      } else if (calendar.toLowerCase() == "excel1904") {
        var d = date.match(/^(\-?\d+\.?\d*)/);
        if (d != null) {
          data.excel_serial_1904.day = d[1];
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
}(Calendrical || {}));
