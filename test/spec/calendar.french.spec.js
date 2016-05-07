/* global Calendrical data3 describe it expect:true*/

'use strict';

describe ("French revolutionary calendar spec", function () {
  var astro, cal, date, expected, actual, decade, jour;

  astro = Calendrical.astro;
  cal = Calendrical.calendar;

  it ("should convert a French revolutionary date to Julian day", function () {
    data3.forEach (function (data) {
      date     = data.french;
      expected = data.rataDie + cal.constants.J0000;
      jour     = date.day;
      decade   = Math.floor ((jour - 1) / 10) + 1;
      jour     = astro.amod (jour, 10);
      actual   = cal.frenchRevolutionaryToJd (date.year, date.month, decade, jour);
      expect (expected).toEqual (actual);
    });
  });

  it ("should convert a Julian day to a French revolutionary date", function () {
    data3.forEach (function (data) {
      date     = data.french;
      jour     = date.day;
      decade   = Math.floor ((jour - 1) / 10) + 1;
      jour     = astro.amod (jour, 10);
      expected = [ date.year, date.month, decade, jour ];
      actual   = cal.jdToFrenchRevolutionary (data.rataDie + cal.constants.J0000);

      expect (expected).toEqual (actual);
    });
  });
});
