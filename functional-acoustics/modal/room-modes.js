import Bands from '../bands/bands';
import Properties from '../properties';
import std from '../util/std';
import sort from '../util/sort';

/**
 * @function RoomModes
 * @description Calculates the modal frequencies of a room of specified dimmensions
 * @param {Object} params - Solver parameters
 * @param {Number} params.length - Room length (default units of feet)
 * @param {Number} params.width - Room width (default units of feet)
 * @param {Number} params.height - Room height (default units of feet)
 * @param {String} [params.units] - Can be either "english" for feet, or "si" for meters. Defaults to "english"
 * @param {Number} [params.c] - Speed of sound in "ft/s" for "english", or "m/s" for "si"
 * @param {Number[]} [params.frequencyRange] - Frequency limits as an array (i.e. [minFrequency, maxFrequency]). Defaults to [16, 500];
 * @param {String} [params.stdNormalization] - Normalization for standard deviation calculation. Can be 'unbiased' (default), 'uncorrected', or 'biased';
 * @param {String} [params.overlapPenalty] - Penalty for overlapping modes (used to calculate score). Can be '*' (default), '+', or 'none'.
 * @param {Number} [params.overlapWidth] - Used to calculate score (i.e. overlapping = nextFrequency < overlapWidth * currentFrequency). Defaults to 0.1;
 * @param {Number} [params.modeLimit] - Used to calculate the maximum mode number. Defaults to 15 (which should be plenty)
 * @param {Boolean} [params.sortFrequencies] - Whether or not the frequencies should be sorted. Defaults to true
 * @param {Boolean} [params.sortBonello] - Whether or not the bonello data should be sorted. Defaults to true
 */
const RoomModes = (params) => {
    let units = params.units || "english";
    let c = params.c || Properties.Air.SpeedOfSound({
        temp: {
            value: 70,
            units: "F"
        },
        units: "ft/s"
    });
    
    let length = params.length;
    let width = params.width;
    let height = params.height;
    let freqlimits = params.frequencyRange || [16, 500];
    let stdNormalization = params.stdNormalization || 'unbiased';
    let overlapPenalty = params.overlapPenalty || '*';
    let overlapWidth = params.overlapWidth || 0.1;
    let modeLimit = params.modeLimit || 15;
    let sortFrequencies = params.sortFrequencies || true;
    let sortBonello = params.sortBonello || true;

    let bands = Bands.ThirdOctave.withLimits; 

    const ModeTypes = ["Oblique", "Tangential", "Axial", "Unknown"];
    let N = {
        Oblique: [],
        Tangential: [],
        Axial: []
    };
    for (let i = 0; i <= modeLimit; i++) {
        for (let j = 0; j <= modeLimit; j++) {
            for (let k = 0; k <= modeLimit; k++) {
                if ((i + j + k) != 0) {
                    let mode = [i, j, k];
                    let modeIndex = mode.filter(x => x == 0).length;
                    N[ModeTypes[modeIndex]].push(mode);
                }
            }
        }
    }

    let freq = [];
    const getBand = (f, limit = "Center") => {
        let _band;
        for (let b = 0; b < bands.length; b++) {
            if (f >= bands[b].Lower && f < bands[b].Upper) {
                _band = bands[b][limit];
            }
        }
        return _band;
    };
    
    const derivative = (arr) => {
        let d = [];
        for (let i = 0; i < arr.length - 1; i++) {
            d.push(arr[i + 1] - arr[i]);
        }
        return d;
    }
    for (let i = 0; i < N.Axial.length; i++){
        let n = N.Axial[i];
        let f = c / 2 * Math.sqrt(Math.pow(n[0] / length, 2) + Math.pow(n[1] / width, 2) + Math.pow(n[2] / height, 2));
        if (f <= freqlimits[1]) {
            if (f >= freqlimits[0]) {
                freq.push({
                    frequency: f,
                    mode: n,
                    modeType: "Axial",
                    modeTypeNumber: 3,
                    band: getBand(f)
                });
            }
        }
        else {
            break;
        }
    }
    for (let i = 0; i < N.Tangential.length; i++) {
        let n = N.Tangential[i];
        let f = c / 2 * Math.sqrt(Math.pow(n[0] / length, 2) + Math.pow(n[1] / width, 2) + Math.pow(n[2] / height, 2));
        if (f <= freqlimits[1]) {
            if (f >= freqlimits[0]) {
                freq.push({
                  frequency: f,
                  mode: n,
                  modeType: "Tangential",
                  modeTypeNumber: 2,
                  band: getBand(f)
                });
            }
        }
        else {
            break;
        }
    }
    for (let i = 0; i < N.Oblique.length; i++) {
        let n = N.Oblique[i];
        let f = c / 2 * Math.sqrt(Math.pow(n[0] / length, 2) + Math.pow(n[1] / width, 2) + Math.pow(n[2] / height, 2));
        if (f <= freqlimits[1]) {
            if (f >= freqlimits[0]) {
                freq.push({
                  frequency: f,
                  mode: n,
                  modeType: "Oblique",
                  modeTypeNumber: 1,
                  band: getBand(f)
                });
            }
        }
        else {
            break;
        }
    }


    let bonelloBands = [...new Set(freq.map(x => x.band))];

    let bonello = bonelloBands.map(freq_band => {
        return {
            band: freq_band,
            count: freq.filter(f => f.band == freq_band).length
        }
    });

    if (sortFrequencies) freq = sort(freq).asc(u => u.frequency);
    if (sortBonello) bonello = sort(bonello).asc(u => u.band);


    let stdDifference = std(derivative(freq.map(x => x.frequency)), stdNormalization);

    let overlapCount = 0;

    for (let i = 1; i < freq.length - 1; i++) {
        if (freq[i + 1].frequency - freq[i].frequency < overlapWidth * freq[i].frequency) {
            overlapCount++;
        }
    }
    let score;
    switch (overlapPenalty) {
        case "+":
            score = stdDifference + Math.log10(overlapCount + 1);
            break;
        case "*":
            score = stdDifference * Math.log10(overlapCount + 1);
            break;
        case "none":
            score = stdDifference;
            break;
        default:
            score = stdDifference;
            break;
    }

    return {
        length: Number(length.toFixed(2)),
        width: Number(width.toFixed(2)),
        height: Number(height.toFixed(2)),
        modes: freq,
        bonello: bonello,
        score: score,
        overlapCount: overlapCount
    };
}

export default RoomModes