/* global Calendrical describe beforeEach it expect:true*/
/* eslint no-undef: "error"*/

'use strict';

describe ("Astro spec", function () {
  var cal, astro, date, julian;

  beforeEach (function () {
      cal = Calendrical.calendar;
    astro = Calendrical.astro;
      date = new Date (2013, 5, 24, 21, 24, 3); // Mon Jun 24 2013 21:24:03 GMT
      julian = date.getJulian ();

    cal.updateTo (date);
  });

  it ("should determine the week-day", function () {
    expect (astro.jwday (julian)).toBe (6); // Monday
  });

  it ("should calculate the obliquity of the ecliptic for a given Julian date", function () {
    expect (astro.obliqeq (julian)).toEqual (23.43753842692833);
  });

  it ("should calculate the equation of time", function () {
    expect (astro.equationOfTime (julian)).toEqual (0.013444224366803564);
  });

  it ("should calculate the position of the Sun", function () {
  expect (astro.sunpos (julian)).toEqual ([
      93.19449903790883,
     170.02535513818384,
       0.01670296531550169,
       0.324847639852584,
      93.5193466777614,
     170.35020277803642,
       1.0164596947875755,
      93.51699676880467,
      93.83491876097433,
      23.39070414353449,
      93.83230640660692,
      23.388939428260382
  ]);
  });
});
