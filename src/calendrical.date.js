/* global Calendrical:true*/
/* eslint no-extend-native: [ "error", { "exceptions": [ "Date" ] } ]*/

'use strict';

(function () {
  var methods = [
    'ModifiedJulianDay',
    'Hebrew',
    'Islamic',
    'Persian',
    'Persiana',
    'Mayan',
    'Bahai',
    'IndianCivil',
    'FrenchRevolutionary',
    'GregorianSerial',
    'Excel1900',
    'Excel1904',
    'UnixTime',
    'IsoWeek',
    'IsoDay'
  ];

  Date.prototype.getJulian = function () {
    return Calendrical.calendar.gregorianToJd (
        this.getFullYear (),
        this.getMonth () + 1,
        this.getDate ()) +
      (this.getSeconds() + 60 * (this.getMinutes() + 60 * this.getHours())) / 86400.0;
  };

  methods.map (function (method) {
    Date.prototype['get' + method] = function () {
      return Calendrical.calendar['update' + method](this.getJulian ());
    };

    return 0;
  });
}());
