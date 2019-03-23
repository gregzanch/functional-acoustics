const AC = require('functional-acoustics');
const math = require('mathjs');

Array.prototype.add = function (b) {
    var a = this,
        c = [];
    if (Object.prototype.toString.call(b) === '[object Array]') {
        if (a.length !== b.length) {
            throw "Array lengths do not match.";
        } else {
            for (var i = 0; i < a.length; i++) {
                c[i] = a[i] + b[i];
            }
        }
    } else if (typeof b === 'number') {
        for (var i = 0; i < a.length; i++) {
            c[i] = a[i] + b;
        }
    }
    return c;
};
Array.prototype.sub = function (b) {
    var a = this,
        c = [];
    if (Object.prototype.toString.call(b) === '[object Array]') {
        if (a.length !== b.length) {
            throw "Array lengths do not match.";
        } else {
            for (var i = 0; i < a.length; i++) {
                c[i] = a[i] - b[i];
            }
        }
    } else if (typeof b === 'number') {
        for (var i = 0; i < a.length; i++) {
            c[i] = a[i] - b;
        }
    }
    return c;
};
Array.prototype.mul = function (b) {
    var a = this,
        c = [];
    if (Object.prototype.toString.call(b) === '[object Array]') {
        if (a.length !== b.length) {
            throw "Array lengths do not match.";
        } else {
            for (var i = 0; i < a.length; i++) {
                c[i] = a[i] * b[i];
            }
        }
    } else if (typeof b === 'number') {
        for (var i = 0; i < a.length; i++) {
            c[i] = a[i] * b;
        }
    }
    return c;
};
Array.prototype.div = function (b) {
    var a = this,
        c = [];
    if (Object.prototype.toString.call(b) === '[object Array]') {
        if (a.length !== b.length) {
            throw "Array lengths do not match.";
        } else {
            for (var i = 0; i < a.length; i++) {
                c[i] = a[i] / b[i];
            }
        }
    } else if (typeof b === 'number') {
        for (var i = 0; i < a.length; i++) {
            c[i] = a[i] / b;
        }
    }
    return c;
};

let Lw_dBZ = [126.40, 117.30, 108.80, 102.40, 98.00, 95.00, 86.20, 82.30];
let Freq = AC.Bands.Octave.fromRange(63, 8000);
let r = 137.67;
let q = 2;

let Lp_dBZ = AC.Conversion.LpFromLw(Lw_dBZ, r, q);
let Lp_dBA = Lp_dBZ.add(AC.Weight.A(Freq));
let overall = AC.dBAdd(Lp_dBA);

console.log(overall);

let Lp = [52, 51, 56, 55, 57, 55, 54, 49, 46, 43, 42, 39, 35, 31, 26, 24];

let Ln = AC.Conversion.LnFromLp(Lp, 100);

let c = AC.Properties.Impedance()
