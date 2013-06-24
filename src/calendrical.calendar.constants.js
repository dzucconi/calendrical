var Calendrical = (function(exports){
  "use strict";

  exports.calendar = exports.calendar || {};
  var calendar = exports.calendar;

  calendar.constants = {
    // *Julian date of Gregorian epoch: 0000-01-01*
    J0000: 1721424.5,
    // *Julian date at Unix epoch: 1970-01-01*
    J1970: 2440587.5,
    // *Epoch of Modified Julian Date system*
    JMJD: 2400000.5,
    // *Epoch (day 1) of Excel 1900 date system (PC)*
    J1900: 2415020.5,
    // *Epoch (day 0) of Excel 1904 date system (Mac)*
    J1904: 2416480.5,

    NORM_LEAP: ["Normal year", "Leap year"],

    gregorian: {
      EPOCH: 1721425.5,
      MONTHS: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    },

    julian: {
      EPOCH: 1721423.5,
      MONTHS: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    },

    hebrew: {
      EPOCH: 347995.5,
      MONTHS: ["Nisan", "Iyyar", "Sivan", "Tammuz", "Av", "Elul", "Tishri", "Marẖeshvan", "Kislev", "Teveth", "Shevat", "Adar", "Veadar"],
      H_MONTHS: ["נִיסָן", "אייר", "סיוון", "תַּמּוּז", "אָב", "אֱלוּל", "תִּשׁרִי", "מרחשוון", "כסליו", "טֵבֵת", "שְׁבָט", "אֲדָר א׳", "אֲדָר א׳"]
    },

    french_revolutionary: {
      EPOCH: 2375839.5,
      MOIS: ["Vendémiaire", "Brumaire", "Frimaire", "Nivôse", "Pluviôse", "Ventôse", "Germinal", "Floréal", "Prairial", "Messidor", "Thermidor", "Fructidor", "(Sans-culottides)"],
      DECADE: ["I", "II", "III"],
      JOUR: ["du Primidi (1)", "du Duodi (2)", "du Tridi (3)", "du Quartidi (4)", "du Quintidi (5)", "du Sextidi (6)", "du Septidi (7)", "du Octid (8)i", "du Nonidi (9)", "du Décadi (10)", "------------", "de la Vertu (1)", "du Génie (2)", "du Travail (3)", "de l'Opinion (4)", "des Récompenses (5)", "de la Révolution (6)"]
    },

    islamic: {
      EPOCH: 1948439.5,
      WEEKDAYS: ["al-'ahad", "al-'ithnayn", "ath-thalatha'", "al-'arb`a'", "al-khamis", "al-jum`a", "as-sabt"],
      MONTHS: ["Muharram", "Safar", "Rabi`al-Awwal", "Rabi`ath-Thani", "Jumada l-Ula", "Jumada t-Tania", "Rajab", "Sha`ban", "Ramadan", "Shawwal", "Dhu l-Qa`da", "Dhu l-Hijja"]
    },

    persian: {
      EPOCH: 1948320.5,
      WEEKDAYS: ["Yekshanbeh", "Doshanbeh", "Seshhanbeh", "Chaharshanbeh", "Panjshanbeh", "Jomeh", "Shanbeh"],
      MONTHS: ["Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar", "Mehr", "Aban", "Azar", "Dey", "Bahman", "Esfand"]
    },

    mayan: {
      COUNT_EPOCH: 584282.5,
      HAAB_MONTHS: ["Pop", "Uo", "Zip", "Zotz", "Tzec", "Xul", "Yaxkin", "Mol", "Chen", "Yax", "Zac", "Ceh", "Mac", "Kankin", "Muan", "Pax", "Kayab", "Cumku", "Uayeb"],
      TZOLKIN_MONTHS: ["Imix", "Ik", "Akbal", "Kan", "Chicchan", "Cimi", "Manik", "Lamat", "Muluc", "Oc", "Chuen", "Eb", "Ben", "Ix", "Men", "Cib", "Caban", "Etznab", "Cauac", "Ahau"]
    },

    bahai: {
      EPOCH: 2394646.5,
      WEEKDAYS: ["Jamál", "Kamál", "Fidál", "Idál", "Istijlál", "Istiqlál", "Jalál"],
      YEARS: ["Alif", "Bá", "Ab", "Dál", "Báb", "Váv", "Abad", "Jád", "Bahá", "Hubb", "Bahháj", "Javáb", "Ahad", "Vahháb", "Vidád", "Badí", "Bahí", "Abhá", "Vahíd"],
      MONTHS: ["Bahá", "Jalál", "Jamál", "`Azamat", "Núr", "Rahmat", "Kalimát", "Kamál", "Asmá", "`Izzat", "Mashíyyat", "`Ilm", "Qudrat", "Qawl", "Masáil", "Sharaf", "Sultán", "Mulk", "Ayyám-i-Há", "`Alá'"],
      DAYS: ["Bahá", "Jalál", "Jamál", "`Azamat", "Núr", "Rahmat", "Kalimát", "Kamál", "Asmá", "`Izzat", "Mashíyyat", "`Ilm", "Qudrat", "Qawl", "Masáil", "Sharaf", "Sultán", "Mulk", "`Alá'"]
    },

    indian_civil: {
      WEEKDAYS: ["ravivara", "somavara", "mangalavara", "budhavara", "brahaspativara", "sukravara", "sanivara"],
      MONTHS: ["Caitra", "Vaisakha", "Jyaistha", "Asadha", "Sravana", "Bhadra", "Asvina", "Kartika", "Agrahayana", "Pausa", "Magha", "Phalguna"]
    }
  }

  return exports;
}(Calendrical || {}));
