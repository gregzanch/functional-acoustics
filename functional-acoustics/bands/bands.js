import octave_bands from './OctaveBands';
import third_octave_bands from './ThirdOctaveBands';

/** Returns the nominal octave band frequencies between a given range (inclusive)
 * @function OctaveBands
 * @param {number} [start] start frequency
 * @param {number} [end] end frequency
 */
function OctaveBands(start, end) {
    return octave_bands.map(x => x.Center).filter(x => x >= Number(start||0) && x <= Number(end||20000));
}

/** Returns the nominal third octave band frequencies between a given range (inclusive)
 * @function ThirdOctaveBands
 * @param {number} [start] start frequency
 * @param {number} [end] end frequency
 */
function ThirdOctaveBands(start, end) {
    return third_octave_bands.map(x => x.Center).filter(x => x >= Number(start||0) && x <= Number(end||20000));
}

/** Returns the lower band limit of a frequency band
 * @function Flower
 * @param {*} k inverse fraction (i.e. third = 3, sixth = 6, etc.)
 * @param {*} fc center frequency
 */
function Flower(k, fc) {
    if (typeof fc === "number")
        fc = [fc];
    return fc.map(f => f / Math.pow(2, 1 / (2 * k)));
};

/** Returns the upper band limit of a frequency band
 * @function Fupper
 * @param {*} k inverse fraction (i.e. third = 3, sixth = 6, etc.)
 * @param {*} fc center frequency
 */
function Fupper(k, fc) {
    if (typeof fc === "number")
        fc = [fc];
    return fc.map(f => f * Math.pow(2, 1 / (2 * k)));
};

const Bands = {
    Octave: {
        Nominal: octave_bands.map(x=>x.Center),
        fromRange: (start, end) => octave_bands.map(x => x.Center).filter(x => x >= Number(start) && x <= Number(end)),
        withLimits: octave_bands,
    },
    ThirdOctave: {
        Nominal: third_octave_bands.map(x => x.Center),
        fromRange: (start, end) => {
            return third_octave_bands.map(x => x.Center).filter(x => x >= Number(start) && x <= Number(end));
        },
        withLimits: third_octave_bands
    },
    Flower: (k, fc) => {
        if (typeof fc === "number")
            fc = [fc];
        return fc.map(f => f / Math.pow(2, 1 / (2 * k)));
    },
    Fupper: (k, fc) => {
        if (typeof fc === "number")
            fc = [fc];
        return fc.map(f=>f * Math.pow(2, 1 / (2 * k)));
    }
};

export { OctaveBands, ThirdOctaveBands, Bands, Flower, Fupper };