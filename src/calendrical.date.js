// Extensions to the Date prototype
;(function() {
  "use strict";

  Date.prototype.getJulian = function() {
    return Calendrical.calendar.gregorianToJd(
      this.getFullYear(), (this.getMonth() + 1), this.getDate()) +
      (Math.floor(
        this.getSeconds() + 60 * (this.getMinutes() + 60 * this.getHours()) + 0.5
      ) / 86400.0);
  }

  var methods = [
    "ModifiedJulianDay",
    "Hebrew",
    "Islamic",
    "Persian",
    "Persiana",
    "Mayan",
    "Bahai",
    "IndianCivil",
    "FrenchRevolutionary",
    "GregorianSerial",
    "Excel1900",
    "Excel1904",
    "UnixTime",
    "IsoWeek",
    "IsoDay"
  ];

  methods.map(function(method) {
    Date.prototype["get" + method] = function() {
      return Calendrical.calendar["update" + method](this.getJulian());
    }
  });
}());
