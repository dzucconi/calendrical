Ephemerides
===========

Refactor of the Fourmilab Calendar Converter:
http://www.fourmilab.ch/documents/calendar/

Usage
-----

```javascript
var E = Ephemerides,
    now = new Date();

E.updateTo(now);

console.log(E.data);
```