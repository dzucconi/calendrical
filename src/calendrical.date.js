// Extensions to the Date prototype
;(function() {
  Date.prototype.getJulian = function() {
    return (
      (this / 86400000) - (this.getTimezoneOffset() / 1440) +
        Calendrical.calendar.constants.J1970
    );
  }
}());
