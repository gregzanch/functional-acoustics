import octave_bands from './OctaveBands';
import third_octave_bands from './ThirdOctaveBands';

export function OctaveBands(start, end) {
    return octave_bands.map(x => x.Center).filter(x => x >= Number(start||0) && x <= Number(end||20000));
}

export function ThirdOctaveBands(start, end) {
    return third_octave_bands.map(x => x.Center).filter(x => x >= Number(start||0) && x <= Number(end||20000));
}

export function Flower(k, fc) {
    if (typeof fc === "number")
        fc = [fc];
    return fc.map(f => f / Math.pow(2, 1 / (2 * k)));
};

export function Fupper(k, fc) {
    if (typeof fc === "number")
        fc = [fc];
    return fc.map(f => f * Math.pow(2, 1 / (2 * k)));
};


export const Bands = {
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

