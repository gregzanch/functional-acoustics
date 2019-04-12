import convert from '../units/convert';
import {pref,Wref,Iref} from '../constants/constants';

/** Calculates Normalized data Ln
 * @param  {number|number[]} Lp Sound pressure level in dB
 * @param  {number} Ar Total reciever room absorption (sabins)
 * @param  {number} [Ao] Reference absorption (defaults to 108 sabins)
 */
export function Lp2Ln({Lp, Ar, Ao} = {}) {
    Ao = Ao || 108;
    if (Number.isFinite(Lp))
        return Lp - 10 * Math.log10(Ao / Ar);
    else if (Lp instanceof Array)
        return Lp.map(lp => lp - 10 * Math.log10(Ao / Ar));
    else 
        throw "Lp must be a finite number or an array of finite numbers"
}

/** Converts Sound Pressure in (Pa) to Sound Pressure Level in (dB)
 * @param  {number|number[]} p Sound Pressure
 * @param  {String} [units] Units for the result
 */
export function p2Lp({p,units} = {}) {
    if (p) {
        if (units) {
            if (Number.isFinite(p)) {
                return 20 * Math.log10(convert(p).from(units).to('Pa') / pref.value);
            } else if (p instanceof Array) {
                return p.map(x => 20 * Math.log10(convert(x).from(units).to('Pa') / pref.value));
            } else {
                throw "p needs to be a number or an array"
            }
        } else {
            if (Number.isFinite(p)) {
                return 20 * Math.log10(p / pref.value);
            } else if (p instanceof Array) {
                return p.map(x => 20 * Math.log10(x / pref.value));
            } else {
                throw "p needs to be a number or an array"
            }
        }
    }
}


/** Converts Sound Pressure Level (Lp) in dB to Sound Pressure in (Pa)
 * @param  {number|number[]} Lp Sound Pressure Level
 * @param  {String} [units] Units for the result
 */
export function Lp2p({
    dB,
    units
} = {}) {
    if (dB) {
        if (units) {
            if (Number.isFinite(dB)) {
                return Math.pow(10, dB / 20) * convert(pref.value).from('Pa').to(units);
            } else if (dB instanceof Array) {
                return dB.map(x => Math.pow(10, x / 20) * convert(pref.value).from('Pa').to(units));
            } else {
                throw "dB needs to be a number or an array"
            }
        } else {
            if (Number.isFinite(dB)) {
                return Math.pow(10, dB / 20) * pref.value;
            } else if (dB instanceof Array) {
                return dB.map(x => Math.pow(10, x / 20) * pref.value);
            } else {
                throw "dB needs to be a number or an array"
            }
        }
    }
}

/**
 * @function I2Li Converts Sound Intensity in (W) to Sound Intensity Level in (Li)
 * @param  {number|number[]} I Sound Intensity 
 * @param  {String} [units] Units for the result 
 */
export function I2dB({
    I,
    units
} = {}) {
    if (I) {
        if (units) {
            if (Number.isFinite(I)) {
                return 10 * Math.log10(convert(I).from(units).to('W/m2') / Iref.value);
            } else if (I instanceof Array) {
                return I.map(x => 10 * Math.log10(convert(x).from(units).to('W/m2') / Iref.value));
            } else {
                throw "I needs to be a number or an array"
            }
        } else {
            if (Number.isFinite(I)) {
                return 10 * Math.log10(I / Iref.value);
            } else if (I instanceof Array) {
                return I.map(x => 10 * Math.log10(x / Iref.value));
            } else {
                throw "I needs to be a number or an array"
            }
        }
    }
}


/**
 * @function dB2I Converts Sound Intensity Level (LI) in dB to Sound Power in (W)
 * @param  {number|number[]} dB Sound Intensity Level
 * @param  {String} [units] Units for the result
 */
export function dB2I({
    dB,
    units
} = {}) {
    if (dB) {
        if (units) {
            if (Number.isFinite(dB)) {
                return Math.pow(10, dB / 10) * convert(Iref.value).from('W/m2').to(units);
            } else if (dB instanceof Array) {
                return dB.map(x => Math.pow(10, x / 10) * convert(Iref.value).from('W/m2').to(units));
            } else {
                throw "dB needs to be a number or an array"
            }
        } else {
            if (Number.isFinite(dB)) {
                return Math.pow(10, dB / 10) * Iref.value;
            } else if (dB instanceof Array) {
                return dB.map(x => Math.pow(10, x / 10) * Iref.value);
            } else {
                throw "dB needs to be a number or an array"
            }
        }
    }
}

/**
 * @function W2dB Converts Sound Power in (W) to Sound Power Level(Lw) in dB
 * @param  {number|number[]} W Sound Power
 * @param  {String} [units] Units for the result
 */
export function W2dB({
    W,
    units
} = {}) {
    if (W) {
        if (units) {
            if (Number.isFinite(W)) {
                return 10 * Math.log10(convert(W).from(units).to('W') / Wref.value);
            } else if (W instanceof Array) {
                return W.map(x => 10 * Math.log10(convert(x).from(units).to('W') / Wref.value));
            } else {
                throw "W needs to be a number or an array"
            }
        } else {
            if (Number.isFinite(W)) {
                return 10 * Math.log10(W / Iref.value);
            } else if (W instanceof Array) {
                return W.map(x => 10 * Math.log10(x / Wref.value));
            } else {
                throw "W needs to be a number or an array"
            }
        }
    }
}

/**
 * @function dB2W Converts Sound Power Level (Lw) in dB to Sound Power in (W)
 * @param  {number|number[]} dB Sound Power Level
 * @param  {String} [units] Units for the result
 */
export function dB2W({
    dB,
    units
} = {}) {
    if (dB) {
        if (units) {
            if (Number.isFinite(dB)) {
                return Math.pow(10, dB / 10) * convert(Wref.value).from('W').to(units);
            } else if (dB instanceof Array) {
                return dB.map(x => Math.pow(10, x / 10) * convert(Wref.value).from('W').to(units));
            } else {
                throw "dB needs to be a number or an array"
            }
        } else {
            if (Number.isFinite(dB)) {
                return Math.pow(10, dB / 10) * Wref.value;
            } else if (dB instanceof Array) {
                return dB.map(x => Math.pow(10, x / 10) * Wref.value);
            } else {
                throw "dB needs to be a number or an array"
            }
        }
    }
}