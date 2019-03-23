# Functional Acoustics

`functional-acoustics` is a javascript library that provides useful functionality for acousticians.

## Features

+ dB addition
+ Unit conversions
+ Room Mode Calculator
+ Acoustic properties (i.e. speed of sound in air)
+ Frequency bands (Octave, 3rd Octave)
+ dB Weighting (A,B,C)

## Usage

Install via npm:

```shell
npm install functional-acoustics
```

then import using es6 import syntax

```javascript
import AC from 'functional-acoustics'
/* or */
var AC = require('functional-acoustics')

let spl = AC.dBsum([90,90], 2);
console.log(spl);
```

Install via cdn:

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/functional-acoustics@1.0.11/functional-acoustics.js"></script>
```

Gets exposed to the global scope as 'AC'

```javascript
let spl = AC.dBsum([90,90]);
console.log(spl);
```

## Notes

Only dBsum has been tested using mocha/chai.
