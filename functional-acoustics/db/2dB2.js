import convert from '../units/convert';
import { pref, Wref, Iref } from '../constants/constants';


/** Converts Sound Pressure in (Pa) to Sound Pressure Level in (dB)
 * @function p2dB
 * @param  {Number|Number[]} p Sound Pressure
 * @param  {String} [units] Units for the result
 */
export function p2dB({ p, units } = {}) {
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
                return p.map(x => 20 * Math.log10(x/ pref.value));
            } else {
                throw "p needs to be a number or an array"
            }
        }
    }
}


/** Converts Sound Pressure Level(Lp) in dB to Sound Pressure in (Pa)
 * @function dB2p
 * @param  {Number|Number[]} dB Sound Pressure Level
 * @param  {String} [units] Units for the result
 */
export function dB2p({ dB, units } = {}) {
    if (dB) {
        if (units) {
            if (Number.isFinite(dB)) {
                return Math.pow(10,dB/20) * convert(pref.value).from('Pa').to(units);
            } else if (dB instanceof Array) {
                return dB.map(x => Math.pow(10, x / 20) * convert(pref.value).from('Pa').to(units));
            } else {
                throw "dB needs to be a number or an array"
            }
        } else {
            if (Number.isFinite(dB)) {
                return Math.pow(10, dB / 20) * pref.value;
            } else if (dB instanceof Array) {
                return dB.map(x => Math.pow(10, x / 20) *  pref.value);
            } else {
                throw "dB needs to be a number or an array"
            }
        }
    }
}

/** Converts Sound Intensity in (W) to Sound Intensity Level in (dB)
 * @function I2dB
 * @param  {Number|Number[]} I Sound Intensity 
 * @param  {String} [units] Units for the result 
 */
export function I2dB({ I, units } = {}) {
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


/** Converts Sound Intensity Level (LI) in dB to Sound Power in (W)
 * @function dB2I
 * @param  {Number|Number[]} dB Sound Intensity Level
 * @param  {String} [units] Units for the result
 */
export function dB2I({ dB, units } = {}) {
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

/** Converts Sound Power in (W) to Sound Power Level(Lw) in dB
 * @function W2dB
 * @param  {Number|Number[]} W Sound Power
 * @param  {String} [units] Units for the result
 */
export function W2dB({ W, units } = {}) {
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

/** Converts Sound Power Level (Lw) in dB to Sound Power in (W)
 * @function dB2W
 * @param  {Number|Number[]} dB Sound Power Level
 * @param  {String} [units] Units for the result
 */
export function dB2W({ dB, units } = {}) {
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