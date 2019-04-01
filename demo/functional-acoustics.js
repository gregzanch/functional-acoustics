const WeightTranslation = (str) => {
    const z = ["unweighted", 'notweighted', "flat", "none", "not", "notweighted", 'noweighting', 'uncorrected'];

    const regex = /^(a|b|c|d|z)$|(?:^(?:db[-\s_\.\(]*)(a|b|c|d|z)[\)]*$)|(?:^(a|b|c|d|z)[-\s_\.]*weight(?:ed)?(?:ing)?$)/gmi;

    const subst = `\$1\$2\$3`;

    if (str.match(regex)) {
        return str.replace(regex, subst).toLowerCase();
    } else if (z.filter(
            verbose => verbose === str.replace(/[\s\t\-\_]+/gmi, '').toLowerCase()).length != 0) {
        return 'z';
    } else {
        const err = 'could not figure out what you meant by \'' + str + '\'';
        console.error(err);
        return null;
    }
};

/* https://en.wikipedia.org/wiki/A-weighting#Function_realisation_of_some_common_weightings */

const Weight = {
    R_a: (f) => {
        let f2 = f * f;
        let f4 = f2 * f2;
        return (148693636 * f4) / ((f2 + 424.36) * Math.sqrt((f2 + 11599.29) * (f2 + 544496.41)) * (f2 + 148693636))
    },
    A: (f) => {
        if(typeof f == "number")
            return 20 * Math.log10(Weight.R_a(f)) + 2.00;
        else if (typeof f == "object")
            return f.map(freq=>20 * Math.log10(Weight.R_a(freq)) + 2.00);
    },
    R_b: (f) => {
        let f3 = f * f * f;
        let f2 = f * f;
        return (148693636 * f3) / ((f2 + 424.36) * Math.sqrt(f2 + 158 * 158) * (f2 * 148693636));
    },
    B: (f) => {
        if (typeof f == "number")
            return 20 * Math.log10(Weight.R_b(f)) + 0.17;
        else if (typeof f == "object")
            return f.map(freq => 20 * Math.log10(Weight.R_b(freq)) + 0.17);
    },
    R_c: (f) => {
        let f2 = f * f;
        return (148693636 * f2) / ((f2 + 424.36) * (f2 * 148693636));
    },
    C: (f) => {
        if (typeof f == "number")
            return 20 * Math.log10(Weight.R_c(f)) + 0.06;
        else if (typeof f == "object")
            return f.map(freq => 20 * Math.log10(Weight.R_c(freq)) + 0.06);
    },
    
    h: (f) => (Math.pow((1037918.48 - f * f), 2) + 1080768.16 * f * f) / (Math.pow((9837328 - f * f), 2) + 11723776 * f * f),
    R_d: (f) => ((f) / (6.8966888496476e-5)) * Math.sqrt(Weight.h(f) / ((f * f + 79919.29) * (f * f + 1345600))),
    D: (f) => 20*Math.log10(Weight.R_d(f)),
    convert: (freq_db_pairs) => {
        return new _WeightConverter(freq_db_pairs);
    }
};

class _WeightConverter {
    constructor(freq_db_pairs) {
        this.frequencies = freq_db_pairs.map(fdb => fdb[0]);
        this.dbs = freq_db_pairs.map(fdb => fdb[1]);
    }
    from(originalWeight) {
        const ow = WeightTranslation(originalWeight);
        if (ow !== null) {
            switch (ow) {
                case 'a':
                    const a = this.frequencies.map(f => Weight.A(f));
                    this.dbz = this.dbs.map((x, i) => x - a[i]);
                    break;
                case 'b':
                    const b = this.frequencies.map(f => Weight.B(f));
                    this.dbz = this.dbs.map((x, i) => x - b[i]);
                    break;
                case 'c':
                    const c = this.frequencies.map(f => Weight.C(f));
                    this.dbz = this.dbs.map((x, i) => x - c[i]);
                    break;
                case 'd':
                    const d = this.frequencies.map(f => Weight.D(f));
                    this.dbz = this.dbs.map((x, i) => x - d[i]);
                    break;
                case 'z':
                    this.dbz = this.dbs;
                    break;
                default:
                    break;
            }
            return this;
        } else {
            return null;
        }
    }
    to(desiredWeight) {
        if (!this.dbz) {
            const err = 'You much call .from() before calling .to()';
            console.error(err);
            return null;
        } else {
            const dw = WeightTranslation(desiredWeight);
            if (dw !== null) {
                switch (dw) {
                    case 'a':
                        const a = this.frequencies.map(f => Weight.A(f));
                        return this.dbz.map((x, i) => x + a[i]);
                    case 'b':
                        const b = this.frequencies.map(f => Weight.B(f));
                        return this.dbz.map((x, i) => x - b[i]);
                    case 'c':
                        const c = this.frequencies.map(f => Weight.C(f));
                        return this.dbz.map((x, i) => x - c[i]);
                    case 'd':
                        const d = this.frequencies.map(f => Weight.D(f));
                        return this.dbz.map((x, i) => x - d[i]);
                    case 'z':
                        return this.dbz;
                    default:
                        return null;
                }
            } else {
                return null;
            }
        }
    }
}

const Conversion = {
    LpFromLw: (Lw, r = 1, Q = 1) => {
        if (typeof Lw === "number")
            Lw = [Lw];
        return Lw.map(lw => lw - Math.abs(10 * Math.log10(Q / (4 * Math.PI * r * r))));
    },
    LnFromLp: (Lp, Ar, Ao = 108) => {
        if (typeof Lp === "number")
            Lp = [Lp];
        return Lp.map(lp => lp - 10 * Math.log10(Ao / Ar));
    }
};

var octave_bands = [{
        "Lower": 11,
        "Center": 16,
        "Upper": 22
    },
    {
        "Lower": 22,
        "Center": 31.5,
        "Upper": 44
    },
    {
        "Lower": 44,
        "Center": 63,
        "Upper": 88
    },
    {
        "Lower": 88,
        "Center": 125,
        "Upper": 177
    },
    {
        "Lower": 177,
        "Center": 250,
        "Upper": 355
    },
    {
        "Lower": 355,
        "Center": 500,
        "Upper": 710
    },
    {
        "Lower": 710,
        "Center": 1000,
        "Upper": 1420
    },
    {
        "Lower": 1420,
        "Center": 2000,
        "Upper": 2840
    },
    {
        "Lower": 2840,
        "Center": 4000,
        "Upper": 5680
    },
    {
        "Lower": 5680,
        "Center": 8000,
        "Upper": 11360
    },
    {
        "Lower": 11360,
        "Center": 16000,
        "Upper": 22720
    }
];

var third_octave_bands = [{
        "Lower": 11.2,
        "Center": 12.5,
        "Upper": 14.1
    },
    {
        "Lower": 14.1,
        "Center": 16,
        "Upper": 17.8
    },
    {
        "Lower": 17.8,
        "Center": 20,
        "Upper": 22.4
    },
    {
        "Lower": 22.4,
        "Center": 25,
        "Upper": 28.2
    },
    {
        "Lower": 28.2,
        "Center": 31.5,
        "Upper": 35.5
    },
    {
        "Lower": 35.5,
        "Center": 40,
        "Upper": 44.7
    },
    {
        "Lower": 44.7,
        "Center": 50,
        "Upper": 56.2
    },
    {
        "Lower": 56.2,
        "Center": 63,
        "Upper": 70.8
    },
    {
        "Lower": 70.8,
        "Center": 80,
        "Upper": 89.1
    },
    {
        "Lower": 89.1,
        "Center": 100,
        "Upper": 112
    },
    {
        "Lower": 112,
        "Center": 125,
        "Upper": 141
    },
    {
        "Lower": 141,
        "Center": 160,
        "Upper": 178
    },
    {
        "Lower": 178,
        "Center": 200,
        "Upper": 224
    },
    {
        "Lower": 224,
        "Center": 250,
        "Upper": 282
    },
    {
        "Lower": 282,
        "Center": 315,
        "Upper": 355
    },
    {
        "Lower": 355,
        "Center": 400,
        "Upper": 447
    },
    {
        "Lower": 447,
        "Center": 500,
        "Upper": 562
    },
    {
        "Lower": 562,
        "Center": 630,
        "Upper": 708
    },
    {
        "Lower": 708,
        "Center": 800,
        "Upper": 891
    },
    {
        "Lower": 891,
        "Center": 1000,
        "Upper": 1122
    },
    {
        "Lower": 1122,
        "Center": 1250,
        "Upper": 1413
    },
    {
        "Lower": 1413,
        "Center": 1600,
        "Upper": 1778
    },
    {
        "Lower": 1778,
        "Center": 2000,
        "Upper": 2239
    },
    {
        "Lower": 2239,
        "Center": 2500,
        "Upper": 2818
    },
    {
        "Lower": 2818,
        "Center": 3150,
        "Upper": 3548
    },
    {
        "Lower": 3548,
        "Center": 4000,
        "Upper": 4467
    },
    {
        "Lower": 4467,
        "Center": 5000,
        "Upper": 5623
    },
    {
        "Lower": 5623,
        "Center": 6300,
        "Upper": 7079
    },
    {
        "Lower": 7079,
        "Center": 8000,
        "Upper": 8913
    },
    {
        "Lower": 8913,
        "Center": 10000,
        "Upper": 11220
    },
    {
        "Lower": 11220,
        "Center": 12500,
        "Upper": 14130
    },
    {
        "Lower": 14130,
        "Center": 16000,
        "Upper": 17780
    },
    {
        "Lower": 17780,
        "Center": 20000,
        "Upper": 22390
    }
];

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

/** 
 * Returns the dB sum of every array passed in, rounded to an optional precision. 
 * @param  {Number[]} dBs - An n-dimmensional array of numbers
 * @param {Number} decimalPrecision - Number of decimals places to round the output to
 * @returns {Number|Number[]} A number or an (n-1)-dimmensional array of numbers
 */
const dBsum = (dBs, decimalPrecision = 1) => {
    let _sum_;
    let precision = '1';
    for (let i = 0; i < decimalPrecision; i++){
        precision+="0";
    }    precision = Number(precision);
    if (typeof dBs === "number") {
        throw "dBsum requires an array, not a single number";
    } else if (typeof dBs === "string") {
        throw "dBsum requires an array, not a single string";
    } else if (typeof dBs === "object") {
        if (typeof dBs[0] === "number") {
            _sum_ = Math.round(10 * Math.log10(dBs.map(x => Math.pow(10, x / 10)).reduce((acc, a) => acc + a))*precision)/precision;
        } else if (typeof dBs[0] === "string") {
            try {
                _sum_ = Math.round(10 * Math.log10(dBs.map(x => Math.pow(10, Number(x) / 10)).reduce((acc, a) => acc + a)) * precision) / precision;
            } catch (error) {
                throw error
            }
        } else if (typeof dBs[0] === "object") {
            try {
                _sum_ = dBs.map(x => dBsum(x,decimalPrecision));
            } catch (error) {
                throw error
            }
        }
        return _sum_;
    } else {
        return null;
    }
};

const Transmission = {
    NR: ({ TL,  absorption,area, Lsource, Lreciever }) => {
       if(Lsource && Lreciever){
          return Lsource-Lreciever;
       }
       else if (TL && area && absorption) {
          return TL + 10 * Math.log10(absorption / area);
       }
       else{
          throw "Not enough input parameters"
       }
    },
    TL: ({ tau, NR, area, absorption, Z, m, f }) => {
        if (tau) {
            return 10 * Math.log10(1 / tau);
        } else if (NR && area && absorption) {
            return NR + 10 * Math.log10(area/absorption);
        } else if (m && f) {
            return 20 * Math.log10(m) + 20 * Math.log10(f) - 47;
        }
        else {
            throw "Not enough input parameters"
        }
    },
    coefficient: ({ TL, Z, m, f, rho, L, c }) => {
        if (TL) {
            return 1 / (Math.pow(10, TL / 10));
        }
    },
    compositeTL: (wallElements) => {
        wallElements.forEach((elt, i, arr) => {
            if (elt.TL) {
                arr[i].tau = transmission.coefficient({ TL: elt.TL });
            }
            if (!elt.area) {
                throw "need area";
            }
        });
        let num = wallElements.map(elt => elt.area).reduce((a, b) => a + b);
        let den = wallElements.map(elt => elt.tau * elt.area).reduce((a, b) => a + b);
        return 10 * Math.log10(num / den);
    }

};

const Properties = {

    /**
     * Calculate the speed of sound in a given material
     * using Young's Modulus 'E' and density 'rho'
     * @param E Young's Modulus
     * @param rho Density
     * @returns Speed of Sound
     */
    SpeedOfSound: (E, rho) => {
        return Math.sqrt(E / rho);
    },

    /**
     * Calculate wave number 'k'
     * @param omega Angular Frequency
     * @param c Speed of Sound
     * @returns Wave Number 'k'
     */
    WaveNumber: (omega, c) => {
        return omega / c;
    },

    /**
     * Calculate acoustic impedance 'Z'
     * @param rho Density
     * @param c Speed of Sound
     * @returns Acoustic Impedance 'Z'
     */
    Impedance: (rho, c) => {
        return rho * c;
    },

    Air: {
        SpeedOfSound: (props) => {
            let temp = props.temp.value || 273.15;
            let tempunits = props.temp.units || "K";
            let returnunits = props.units || "m/s";
            let c = 20.04 * Math.sqrt(temp);
            switch (tempunits) {
                case "K":
                    c = 20.04 * Math.sqrt(temp);
                    break;
                case "C":
                    c = 20.04 * Math.sqrt(273.15+temp);
                    break;
                case "F":
                    c = 20.04 * Math.sqrt((temp - 32) * (5 / 9) + 273.15);
                    break;
                default:
                    break;
            }
            switch (returnunits) {
                case "ft/s":
                    c *= 3.281;
                    break;
                default:
                    break;
            }
            return c;
        }
    }
};

const mean = x => x.reduce((p, c) => p + c, 0) / x.length;

const std = (x, normalization) => {
    let norm = normalization || 'unbiased';
    let m = mean(x);
    let n = [];
    n['unbiased'] = -1;
    n['uncorrected'] = 0;
    n['biased'] = 1;

    let s = Math.sqrt(x.map(u => Math.pow(u - m, 2)).reduce((p, c) => p + c) / (x.length + n[norm]));
    return s;
};

/*
sort.js was not written by me,
check out fast-sort at https://www.npmjs.com/package/fast-sort
*/

const sorter = function (direction, a, b) {
    if (a === b) return 0;
    if (a < b) return -direction;
    if (a == null) return 1;
    if (b == null) return -1;

    return direction;
};

/**
 * stringSorter does not support nested property.
 * For nested properties or value transformation (e.g toLowerCase) we should use functionSorter
 * Based on benchmark testing using stringSorter is bit faster then using equivalent function sorter
 * @example sort(users).asc('firstName')
 */
const stringSorter = function (direction, sortBy, a, b) {
    return sorter(direction, a[sortBy], b[sortBy]);
};

/**
 * @example sort(users).asc(p => p.address.city)
 */
const functionSorter = function (direction, sortBy, a, b) {
    return sorter(direction, sortBy(a), sortBy(b));
};

/**
 * Used when we have sorting by multyple properties and when current sorter is function
 * @example sort(users).asc([p => p.address.city, p => p.firstName])
 */
const multiPropFunctionSorter = function (sortBy, thenBy, depth, direction, a, b) {
    return multiPropEqualityHandler(sortBy(a), sortBy(b), thenBy, depth, direction, a, b);
};

/**
 * Used when we have sorting by multiple properties and when current sorter is string
 * @example sort(users).asc(['firstName', 'lastName'])
 */
const multiPropStringSorter = function (sortBy, thenBy, depth, direction, a, b) {
    return multiPropEqualityHandler(a[sortBy], b[sortBy], thenBy, depth, direction, a, b);
};

/**
 * Used with 'by' sorter when we have sorting in multiple direction
 * @example sort(users).asc(['firstName', 'lastName'])
 */
const multiPropObjectSorter = function (sortByObj, thenBy, depth, _direction, a, b) {
    const sortBy = sortByObj.asc || sortByObj.desc;
    const direction = sortByObj.asc ? 1 : -1;

    if (!sortBy) {
        throw Error(`sort: Invalid 'by' sorting configuration.
      Expecting object with 'asc' or 'desc' key`);
    }

    const multiSorter = getMultiPropertySorter(sortBy);
    return multiSorter(sortBy, thenBy, depth, direction, a, b);
};

// >>> HELPERS <<<

/**
 * Return multiProperty sort handler based on sortBy value
 */
const getMultiPropertySorter = function (sortBy) {
    const type = typeof sortBy;
    if (type === 'string') {
        return multiPropStringSorter;
    } else if (type === 'function') {
        return multiPropFunctionSorter;
    }

    return multiPropObjectSorter;
};

const multiPropEqualityHandler = function (valA, valB, thenBy, depth, direction, a, b) {
    if (valA === valB || (valA == null && valB == null)) {
        if (thenBy.length > depth) {
            const multiSorter = getMultiPropertySorter(thenBy[depth]);
            return multiSorter(thenBy[depth], thenBy, depth + 1, direction, a, b);
        }
        return 0;
    }

    return sorter(direction, valA, valB);
};

/**
 * Pick sorter based on provided sortBy value
 */
const sort = function (direction, ctx, sortBy) {
    if (!Array.isArray(ctx)) return ctx;

    // Unwrap sortBy if array with only 1 value
    if (Array.isArray(sortBy) && sortBy.length < 2) {
        [sortBy] = sortBy;
    }

    let _sorter;

    if (!sortBy) {
        _sorter = sorter.bind(undefined, direction);
    } else if (typeof sortBy === 'string') {
        _sorter = stringSorter.bind(undefined, direction, sortBy);
    } else if (typeof sortBy === 'function') {
        _sorter = functionSorter.bind(undefined, direction, sortBy);
    } else {
        _sorter = getMultiPropertySorter(sortBy[0])
            .bind(undefined, sortBy.shift(), sortBy, 0, direction);
    }

    return ctx.sort(_sorter);
};

function sort$1 (ctx) {
    return {
        asc: (sortBy) => sort(1, ctx, sortBy),
        desc: (sortBy) => sort(-1, ctx, sortBy),
        by: (sortBy) => {
            if (!Array.isArray(ctx)) return ctx;

            if (!Array.isArray(sortBy)) {
                throw Error(`sort: Invalid usage of 'by' sorter. Array syntax is required.
          Did you mean to use 'asc' or 'desc' sorter instead?`);
            }

            // Unwrap sort by to faster path
            if (sortBy.length === 1) {
                const direction = sortBy[0].asc ? 1 : -1;
                const sortOnProp = sortBy[0].asc || sortBy[0].desc;
                if (!sortOnProp) {
                    throw Error(`sort: Invalid 'by' sorting configuration.
            Expecting object with 'asc' or 'desc' key`);
                }
                return sort(direction, ctx, sortOnProp);
            }

            const _sorter = multiPropObjectSorter.bind(undefined, sortBy.shift(), sortBy, 0, undefined);
            return ctx.sort(_sorter);
        }
    };
}

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
    let N = [];
    for (let i = 0; i <= modeLimit; i++) {
        for (let j = 0; j <= modeLimit; j++) {
            for (let k = 0; k <= modeLimit; k++) {
                N.push([i, j, k]);
            }
        }
    }
    N = N.splice(1);
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
    const ModeTypes = ["Oblique", "Tangential", "Axial", "Unknown"];
    const derivative = (arr) => {
        let d = [];
        for (let i = 0; i < arr.length - 1; i++) {
            d.push(arr[i + 1] - arr[i]);
        }
        return d;
    };
    for (let i = 0; i < N.length; i++){
        let n = N[i];
        let f = c / 2 * Math.sqrt(Math.pow(n[0] / length, 2) + Math.pow(n[1] / width, 2) + Math.pow(n[2] / height, 2));
        if (f <= freqlimits[1]) {
            if (f >= freqlimits[0]) {
                let modeIndex = n.filter(x => x == 0).length;
                freq.push({
                    frequency: f,
                    mode: n,
                    modeType: ModeTypes[modeIndex],
                    modeTypeNumber: modeIndex + 1,
                    band: getBand(f)
                });
            }
        }
    }

    let bonelloBands = [...new Set(freq.map(x => x.band))];

    let bonello = bonelloBands.map(freq_band => {
        return {
            band: freq_band,
            count: freq.filter(f => f.band == freq_band).length
        }
    });

    if (sortFrequencies) freq = sort$1(freq).asc(u => u.frequency);
    if (sortBonello) bonello = sort$1(bonello).asc(u => u.band);


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
};

const buffer = (arr, n, fill) => {
    fill = fill || false;
    const N = Math.ceil(arr.length / n);
    if (fill) {
        return (
            Array
                .from(Array(N), (_, i) => arr.slice(i * n, i * n + n))
                .map(x => x.length == n ? x : x.concat(new Array(n - x.length).fill(0)))
        )
    }
    else {
        return (
            Array
            .from(Array(N), (_, i) => arr.slice(i * n, i * n + n))
        )
    }
};

const constants = {
    EPSILON: 1e-12,
    reference: {
        pressure: 2e-5,
        power: 1e-12,
        intensity: 1e-12
    }
};

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

var lodash_keys = keys;

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    funcTag$1 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]';

/** Used to detect unsigned integer values. */
var reIsUint$1 = /^(?:0|[1-9]\d*)$/;

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes$1(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg$1(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$1 = objectProto$1.toString;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$1.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys$1 = overArg$1(Object.keys, Object);

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys$1(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray$1(value) || isArguments$1(value))
    ? baseTimes$1(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$1.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex$1(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys$1);
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys$1(object) {
  if (!isPrototype$1(object)) {
    return nativeKeys$1(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$1.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike$1(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex$1(value, length) {
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return !!length &&
    (typeof value == 'number' || reIsUint$1.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype$1(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$1;

  return value === proto;
}

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _([1, 2]).forEach(function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray$1(collection) ? arrayEach : baseEach;
  return func(collection, typeof iteratee == 'function' ? iteratee : identity);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments$1(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject$1(value) && hasOwnProperty$1.call(value, 'callee') &&
    (!propertyIsEnumerable$1.call(value, 'callee') || objectToString$1.call(value) == argsTag$1);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray$1 = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike$1(value) {
  return value != null && isLength$1(value.length) && !isFunction$1(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject$1(value) {
  return isObjectLike$1(value) && isArrayLike$1(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$1(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject$1(value) ? objectToString$1.call(value) : '';
  return tag == funcTag$1 || tag == genTag$1;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength$1(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$1(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike$1(value) {
  return !!value && typeof value == 'object';
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys$1(object) {
  return isArrayLike$1(object) ? arrayLikeKeys$1(object) : baseKeys$1(object);
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

var lodash_foreach = forEach;

var metric, imperial;
metric = {
  mm: {
    name: {
      singular: 'Millimeter',
      plural: 'Millimeters'
    },
    to_anchor: 1 / 1000
  },
  cm: {
    name: {
      singular: 'Centimeter',
      plural: 'Centimeters'
    },
    to_anchor: 1 / 100
  },
  m: {
    name: {
      singular: 'Meter',
      plural: 'Meters'
    },
    to_anchor: 1
  },
  km: {
    name: {
      singular: 'Kilometer',
      plural: 'Kilometers'
    },
    to_anchor: 1000
  }
};
imperial = {
  'in': {
    name: {
      singular: 'Inch',
      plural: 'Inches'
    },
    to_anchor: 1 / 12
  },
  yd: {
    name: {
      singular: 'Yard',
      plural: 'Yards'
    },
    to_anchor: 3
  },
  'ft-us': {
    name: {
      singular: 'US Survey Foot',
      plural: 'US Survey Feet'
    },
    to_anchor: 1.000002
  },
  ft: {
    name: {
      singular: 'Foot',
      plural: 'Feet'
    },
    to_anchor: 1
  },
  fathom: {
    name: {
      singular: 'Fathom',
      plural: 'Fathoms'
    },
    to_anchor: 6
  },
  mi: {
    name: {
      singular: 'Mile',
      plural: 'Miles'
    },
    to_anchor: 5280
  },
  nMi: {
    name: {
      singular: 'Nautical Mile',
      plural: 'Nautical Miles'
    },
    to_anchor: 6076.12
  }
};
var length = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'm',
      ratio: 3.28084
    },
    imperial: {
      unit: 'ft',
      ratio: 1 / 3.28084
    }
  }
};

var metric$1, imperial$1;
metric$1 = {
  mm2: {
    name: {
      singular: 'Square Millimeter',
      plural: 'Square Millimeters'
    },
    to_anchor: 1 / 1000000
  },
  cm2: {
    name: {
      singular: 'Centimeter',
      plural: 'Centimeters'
    },
    to_anchor: 1 / 10000
  },
  m2: {
    name: {
      singular: 'Square Meter',
      plural: 'Square Meters'
    },
    to_anchor: 1
  },
  ha: {
    name: {
      singular: 'Hectare',
      plural: 'Hectares'
    },
    to_anchor: 10000
  },
  km2: {
    name: {
      singular: 'Square Kilometer',
      plural: 'Square Kilometers'
    },
    to_anchor: 1000000
  }
};
imperial$1 = {
  'in2': {
    name: {
      singular: 'Square Inch',
      plural: 'Square Inches'
    },
    to_anchor: 1 / 144
  },
  yd2: {
    name: {
      singular: 'Square Yard',
      plural: 'Square Yards'
    },
    to_anchor: 9
  },
  ft2: {
    name: {
      singular: 'Square Foot',
      plural: 'Square Feet'
    },
    to_anchor: 1
  },
  ac: {
    name: {
      singular: 'Acre',
      plural: 'Acres'
    },
    to_anchor: 43560
  },
  mi2: {
    name: {
      singular: 'Square Mile',
      plural: 'Square Miles'
    },
    to_anchor: 27878400
  }
};
var area = {
  metric: metric$1,
  imperial: imperial$1,
  _anchors: {
    metric: {
      unit: 'm2',
      ratio: 10.7639
    },
    imperial: {
      unit: 'ft2',
      ratio: 1 / 10.7639
    }
  }
};

var metric$2, imperial$2;
metric$2 = {
  mcg: {
    name: {
      singular: 'Microgram',
      plural: 'Micrograms'
    },
    to_anchor: 1 / 1000000
  },
  mg: {
    name: {
      singular: 'Milligram',
      plural: 'Milligrams'
    },
    to_anchor: 1 / 1000
  },
  g: {
    name: {
      singular: 'Gram',
      plural: 'Grams'
    },
    to_anchor: 1
  },
  kg: {
    name: {
      singular: 'Kilogram',
      plural: 'Kilograms'
    },
    to_anchor: 1000
  },
  mt: {
    name: {
      singular: 'Metric Tonne',
      plural: 'Metric Tonnes'
    },
    to_anchor: 1000000
  }
};
imperial$2 = {
  oz: {
    name: {
      singular: 'Ounce',
      plural: 'Ounces'
    },
    to_anchor: 1 / 16
  },
  lb: {
    name: {
      singular: 'Pound',
      plural: 'Pounds'
    },
    to_anchor: 1
  },
  t: {
    name: {
      singular: 'Ton',
      plural: 'Tons'
    },
    to_anchor: 2000
  }
};
var mass = {
  metric: metric$2,
  imperial: imperial$2,
  _anchors: {
    metric: {
      unit: 'g',
      ratio: 1 / 453.592
    },
    imperial: {
      unit: 'lb',
      ratio: 453.592
    }
  }
};

var metric$3, imperial$3;
metric$3 = {
  mm3: {
    name: {
      singular: 'Cubic Millimeter',
      plural: 'Cubic Millimeters'
    },
    to_anchor: 1 / 1000000
  },
  cm3: {
    name: {
      singular: 'Cubic Centimeter',
      plural: 'Cubic Centimeters'
    },
    to_anchor: 1 / 1000
  },
  ml: {
    name: {
      singular: 'Millilitre',
      plural: 'Millilitres'
    },
    to_anchor: 1 / 1000
  },
  cl: {
    name: {
      singular: 'Centilitre',
      plural: 'Centilitres'
    },
    to_anchor: 1 / 100
  },
  dl: {
    name: {
      singular: 'Decilitre',
      plural: 'Decilitres'
    },
    to_anchor: 1 / 10
  },
  l: {
    name: {
      singular: 'Litre',
      plural: 'Litres'
    },
    to_anchor: 1
  },
  kl: {
    name: {
      singular: 'Kilolitre',
      plural: 'Kilolitres'
    },
    to_anchor: 1000
  },
  m3: {
    name: {
      singular: 'Cubic meter',
      plural: 'Cubic meters'
    },
    to_anchor: 1000
  },
  km3: {
    name: {
      singular: 'Cubic kilometer',
      plural: 'Cubic kilometers'
    },
    to_anchor: 1000000000000 // Swedish units

  },
  krm: {
    name: {
      singular: 'Matsked',
      plural: 'Matskedar'
    },
    to_anchor: 1 / 1000
  },
  tsk: {
    name: {
      singular: 'Tesked',
      plural: 'Teskedar'
    },
    to_anchor: 5 / 1000
  },
  msk: {
    name: {
      singular: 'Matsked',
      plural: 'Matskedar'
    },
    to_anchor: 15 / 1000
  },
  kkp: {
    name: {
      singular: 'Kaffekopp',
      plural: 'Kaffekoppar'
    },
    to_anchor: 150 / 1000
  },
  glas: {
    name: {
      singular: 'Glas',
      plural: 'Glas'
    },
    to_anchor: 200 / 1000
  },
  kanna: {
    name: {
      singular: 'Kanna',
      plural: 'Kannor'
    },
    to_anchor: 2.617
  }
};
imperial$3 = {
  tsp: {
    name: {
      singular: 'Teaspoon',
      plural: 'Teaspoons'
    },
    to_anchor: 1 / 6
  },
  Tbs: {
    name: {
      singular: 'Tablespoon',
      plural: 'Tablespoons'
    },
    to_anchor: 1 / 2
  },
  in3: {
    name: {
      singular: 'Cubic inch',
      plural: 'Cubic inches'
    },
    to_anchor: 0.55411
  },
  'fl-oz': {
    name: {
      singular: 'Fluid Ounce',
      plural: 'Fluid Ounces'
    },
    to_anchor: 1
  },
  cup: {
    name: {
      singular: 'Cup',
      plural: 'Cups'
    },
    to_anchor: 8
  },
  pnt: {
    name: {
      singular: 'Pint',
      plural: 'Pints'
    },
    to_anchor: 16
  },
  qt: {
    name: {
      singular: 'Quart',
      plural: 'Quarts'
    },
    to_anchor: 32
  },
  gal: {
    name: {
      singular: 'Gallon',
      plural: 'Gallons'
    },
    to_anchor: 128
  },
  ft3: {
    name: {
      singular: 'Cubic foot',
      plural: 'Cubic feet'
    },
    to_anchor: 957.506
  },
  yd3: {
    name: {
      singular: 'Cubic yard',
      plural: 'Cubic yards'
    },
    to_anchor: 25852.7
  }
};
var volume = {
  metric: metric$3,
  imperial: imperial$3,
  _anchors: {
    metric: {
      unit: 'l',
      ratio: 33.8140226
    },
    imperial: {
      unit: 'fl-oz',
      ratio: 1 / 33.8140226
    }
  }
};

var metric$4;
metric$4 = {
  ea: {
    name: {
      singular: 'Each',
      plural: 'Each'
    },
    to_anchor: 1
  },
  dz: {
    name: {
      singular: 'Dozen',
      plural: 'Dozens'
    },
    to_anchor: 12
  }
};
var each = {
  metric: metric$4,
  imperial: {},
  _anchors: {
    metric: {
      unit: 'ea',
      ratio: 1
    }
  }
};

var metric$5, imperial$4;
metric$5 = {
  C: {
    name: {
      singular: 'degree Celsius',
      plural: 'degrees Celsius'
    },
    to_anchor: 1,
    anchor_shift: 0
  },
  K: {
    name: {
      singular: 'degree Kelvin',
      plural: 'degrees Kelvin'
    },
    to_anchor: 1,
    anchor_shift: 273.15
  }
};
imperial$4 = {
  F: {
    name: {
      singular: 'degree Fahrenheit',
      plural: 'degrees Fahrenheit'
    },
    to_anchor: 1
  },
  R: {
    name: {
      singular: 'degree Rankine',
      plural: 'degrees Rankine'
    },
    to_anchor: 1,
    anchor_shift: 459.67
  }
};
var temperature = {
  metric: metric$5,
  imperial: imperial$4,
  _anchors: {
    metric: {
      unit: 'C',
      transform: function (C) {
        return C / (5 / 9) + 32;
      }
    },
    imperial: {
      unit: 'F',
      transform: function (F) {
        return (F - 32) * (5 / 9);
      }
    }
  }
};

var time;
var daysInYear = 365.25;
time = {
  ns: {
    name: {
      singular: 'Nanosecond',
      plural: 'Nanoseconds'
    },
    to_anchor: 1 / 1000000000
  },
  mu: {
    name: {
      singular: 'Microsecond',
      plural: 'Microseconds'
    },
    to_anchor: 1 / 1000000
  },
  ms: {
    name: {
      singular: 'Millisecond',
      plural: 'Milliseconds'
    },
    to_anchor: 1 / 1000
  },
  s: {
    name: {
      singular: 'Second',
      plural: 'Seconds'
    },
    to_anchor: 1
  },
  min: {
    name: {
      singular: 'Minute',
      plural: 'Minutes'
    },
    to_anchor: 60
  },
  h: {
    name: {
      singular: 'Hour',
      plural: 'Hours'
    },
    to_anchor: 60 * 60
  },
  d: {
    name: {
      singular: 'Day',
      plural: 'Days'
    },
    to_anchor: 60 * 60 * 24
  },
  week: {
    name: {
      singular: 'Week',
      plural: 'Weeks'
    },
    to_anchor: 60 * 60 * 24 * 7
  },
  month: {
    name: {
      singular: 'Month',
      plural: 'Months'
    },
    to_anchor: 60 * 60 * 24 * daysInYear / 12
  },
  year: {
    name: {
      singular: 'Year',
      plural: 'Years'
    },
    to_anchor: 60 * 60 * 24 * daysInYear
  }
};
var time_1 = {
  metric: time,
  _anchors: {
    metric: {
      unit: 's',
      ratio: 1
    }
  }
};

var bits, bytes;
bits = {
  b: {
    name: {
      singular: 'Bit',
      plural: 'Bits'
    },
    to_anchor: 1
  },
  Kb: {
    name: {
      singular: 'Kilobit',
      plural: 'Kilobits'
    },
    to_anchor: 1024
  },
  Mb: {
    name: {
      singular: 'Megabit',
      plural: 'Megabits'
    },
    to_anchor: 1048576
  },
  Gb: {
    name: {
      singular: 'Gigabit',
      plural: 'Gigabits'
    },
    to_anchor: 1073741824
  },
  Tb: {
    name: {
      singular: 'Terabit',
      plural: 'Terabits'
    },
    to_anchor: 1099511627776
  }
};
bytes = {
  B: {
    name: {
      singular: 'Byte',
      plural: 'Bytes'
    },
    to_anchor: 1
  },
  KB: {
    name: {
      singular: 'Kilobyte',
      plural: 'Kilobytes'
    },
    to_anchor: 1024
  },
  MB: {
    name: {
      singular: 'Megabyte',
      plural: 'Megabytes'
    },
    to_anchor: 1048576
  },
  GB: {
    name: {
      singular: 'Gigabyte',
      plural: 'Gigabytes'
    },
    to_anchor: 1073741824
  },
  TB: {
    name: {
      singular: 'Terabyte',
      plural: 'Terabytes'
    },
    to_anchor: 1099511627776
  }
};
var digital = {
  bits: bits,
  bytes: bytes,
  _anchors: {
    bits: {
      unit: 'b',
      ratio: 1 / 8
    },
    bytes: {
      unit: 'B',
      ratio: 8
    }
  }
};

var metric$6;
metric$6 = {
  ppm: {
    name: {
      singular: 'Part-per Million',
      plural: 'Parts-per Million'
    },
    to_anchor: 1
  },
  ppb: {
    name: {
      singular: 'Part-per Billion',
      plural: 'Parts-per Billion'
    },
    to_anchor: .001
  },
  ppt: {
    name: {
      singular: 'Part-per Trillion',
      plural: 'Parts-per Trillion'
    },
    to_anchor: .000001
  },
  ppq: {
    name: {
      singular: 'Part-per Quadrillion',
      plural: 'Parts-per Quadrillion'
    },
    to_anchor: .000000001
  }
};
var partsPer = {
  metric: metric$6,
  imperial: {},
  _anchors: {
    metric: {
      unit: 'ppm',
      ratio: .000001
    }
  }
};

var metric$7, imperial$5;
metric$7 = {
  'm/s': {
    name: {
      singular: 'meter per second',
      plural: 'meters per second'
    },
    to_anchor: 3.6
  },
  'km/h': {
    name: {
      singular: 'Kilometer per hour',
      plural: 'Kilometers per hour'
    },
    to_anchor: 1
  }
};
imperial$5 = {
  'm/h': {
    name: {
      singular: 'Mile per hour',
      plural: 'Miles per hour'
    },
    to_anchor: 1
  },
  knot: {
    name: {
      singular: 'Knot',
      plural: 'Knots'
    },
    to_anchor: 1.150779
  },
  'ft/s': {
    name: {
      singular: 'Foot per second',
      plural: 'Feet per second'
    },
    to_anchor: 0.681818
  }
};
var speed = {
  metric: metric$7,
  imperial: imperial$5,
  _anchors: {
    metric: {
      unit: 'km/h',
      ratio: 1 / 1.609344
    },
    imperial: {
      unit: 'm/h',
      ratio: 1.609344
    }
  }
};

var metric$8, imperial$6;
metric$8 = {
  'min/km': {
    name: {
      singular: 'Minute per kilometer',
      plural: 'Minutes per kilometer'
    },
    to_anchor: 0.06
  },
  's/m': {
    name: {
      singular: 'Second per meter',
      plural: 'Seconds per meter'
    },
    to_anchor: 1
  }
};
imperial$6 = {
  'min/mi': {
    name: {
      singular: 'Minute per mile',
      plural: 'Minutes per mile'
    },
    to_anchor: 0.0113636
  },
  's/ft': {
    name: {
      singular: 'Second per foot',
      plural: 'Seconds per foot'
    },
    to_anchor: 1
  }
};
var pace = {
  metric: metric$8,
  imperial: imperial$6,
  _anchors: {
    metric: {
      unit: 's/m',
      ratio: 0.3048
    },
    imperial: {
      unit: 's/ft',
      ratio: 1 / 0.3048
    }
  }
};

var metric$9, imperial$7;
metric$9 = {
  Pa: {
    name: {
      singular: 'pascal',
      plural: 'pascals'
    },
    to_anchor: 1 / 1000
  },
  kPa: {
    name: {
      singular: 'kilopascal',
      plural: 'kilopascals'
    },
    to_anchor: 1
  },
  MPa: {
    name: {
      singular: 'megapascal',
      plural: 'megapascals'
    },
    to_anchor: 1000
  },
  hPa: {
    name: {
      singular: 'hectopascal',
      plural: 'hectopascals'
    },
    to_anchor: 1 / 10
  },
  uPa: {
    name: {
      singular: 'micropascal',
      plural: 'micropascals'
    },
    to_anchor: 1 / 1e9
  },
  bar: {
    name: {
      singular: 'bar',
      plural: 'bar'
    },
    to_anchor: 100
  },
  torr: {
    name: {
      singular: 'torr',
      plural: 'torr'
    },
    to_anchor: 101325 / 760000
  }
};
imperial$7 = {
  psi: {
    name: {
      singular: 'pound per square inch',
      plural: 'pounds per square inch'
    },
    to_anchor: 1 / 1000
  },
  ksi: {
    name: {
      singular: 'kilopound per square inch',
      plural: 'kilopound per square inch'
    },
    to_anchor: 1
  }
};
var pressure = {
  metric: metric$9,
  imperial: imperial$7,
  _anchors: {
    metric: {
      unit: 'kPa',
      ratio: 0.00014503768078
    },
    imperial: {
      unit: 'psi',
      ratio: 1 / 0.00014503768078
    }
  }
};

var current;
current = {
  A: {
    name: {
      singular: 'Ampere',
      plural: 'Amperes'
    },
    to_anchor: 1
  },
  mA: {
    name: {
      singular: 'Milliampere',
      plural: 'Milliamperes'
    },
    to_anchor: .001
  },
  kA: {
    name: {
      singular: 'Kiloampere',
      plural: 'Kiloamperes'
    },
    to_anchor: 1000
  }
};
var current_1 = {
  metric: current,
  _anchors: {
    metric: {
      unit: 'A',
      ratio: 1
    }
  }
};

var voltage;
voltage = {
  V: {
    name: {
      singular: 'Volt',
      plural: 'Volts'
    },
    to_anchor: 1
  },
  mV: {
    name: {
      singular: 'Millivolt',
      plural: 'Millivolts'
    },
    to_anchor: .001
  },
  kV: {
    name: {
      singular: 'Kilovolt',
      plural: 'Kilovolts'
    },
    to_anchor: 1000
  }
};
var voltage_1 = {
  metric: voltage,
  _anchors: {
    metric: {
      unit: 'V',
      ratio: 1
    }
  }
};

var power;
power = {
  W: {
    name: {
      singular: 'Watt',
      plural: 'Watts'
    },
    to_anchor: 1
  },
  mW: {
    name: {
      singular: 'Milliwatt',
      plural: 'Milliwatts'
    },
    to_anchor: .001
  },
  kW: {
    name: {
      singular: 'Kilowatt',
      plural: 'Kilowatts'
    },
    to_anchor: 1000
  },
  MW: {
    name: {
      singular: 'Megawatt',
      plural: 'Megawatts'
    },
    to_anchor: 1000000
  },
  GW: {
    name: {
      singular: 'Gigawatt',
      plural: 'Gigawatts'
    },
    to_anchor: 1000000000
  }
};
var power_1 = {
  metric: power,
  _anchors: {
    metric: {
      unit: 'W',
      ratio: 1
    }
  }
};

var reactivePower;
reactivePower = {
  VAR: {
    name: {
      singular: 'Volt-Ampere Reactive',
      plural: 'Volt-Amperes Reactive'
    },
    to_anchor: 1
  },
  mVAR: {
    name: {
      singular: 'Millivolt-Ampere Reactive',
      plural: 'Millivolt-Amperes Reactive'
    },
    to_anchor: .001
  },
  kVAR: {
    name: {
      singular: 'Kilovolt-Ampere Reactive',
      plural: 'Kilovolt-Amperes Reactive'
    },
    to_anchor: 1000
  },
  MVAR: {
    name: {
      singular: 'Megavolt-Ampere Reactive',
      plural: 'Megavolt-Amperes Reactive'
    },
    to_anchor: 1000000
  },
  GVAR: {
    name: {
      singular: 'Gigavolt-Ampere Reactive',
      plural: 'Gigavolt-Amperes Reactive'
    },
    to_anchor: 1000000000
  }
};
var reactivePower_1 = {
  metric: reactivePower,
  _anchors: {
    metric: {
      unit: 'VAR',
      ratio: 1
    }
  }
};

var apparentPower;
apparentPower = {
  VA: {
    name: {
      singular: 'Volt-Ampere',
      plural: 'Volt-Amperes'
    },
    to_anchor: 1
  },
  mVA: {
    name: {
      singular: 'Millivolt-Ampere',
      plural: 'Millivolt-Amperes'
    },
    to_anchor: .001
  },
  kVA: {
    name: {
      singular: 'Kilovolt-Ampere',
      plural: 'Kilovolt-Amperes'
    },
    to_anchor: 1000
  },
  MVA: {
    name: {
      singular: 'Megavolt-Ampere',
      plural: 'Megavolt-Amperes'
    },
    to_anchor: 1000000
  },
  GVA: {
    name: {
      singular: 'Gigavolt-Ampere',
      plural: 'Gigavolt-Amperes'
    },
    to_anchor: 1000000000
  }
};
var apparentPower_1 = {
  metric: apparentPower,
  _anchors: {
    metric: {
      unit: 'VA',
      ratio: 1
    }
  }
};

var energy;
energy = {
  Wh: {
    name: {
      singular: 'Watt-hour',
      plural: 'Watt-hours'
    },
    to_anchor: 3600
  },
  mWh: {
    name: {
      singular: 'Milliwatt-hour',
      plural: 'Milliwatt-hours'
    },
    to_anchor: 3.6
  },
  kWh: {
    name: {
      singular: 'Kilowatt-hour',
      plural: 'Kilowatt-hours'
    },
    to_anchor: 3600000
  },
  MWh: {
    name: {
      singular: 'Megawatt-hour',
      plural: 'Megawatt-hours'
    },
    to_anchor: 3600000000
  },
  GWh: {
    name: {
      singular: 'Gigawatt-hour',
      plural: 'Gigawatt-hours'
    },
    to_anchor: 3600000000000
  },
  J: {
    name: {
      singular: 'Joule',
      plural: 'Joules'
    },
    to_anchor: 1
  },
  kJ: {
    name: {
      singular: 'Kilojoule',
      plural: 'Kilojoules'
    },
    to_anchor: 1000
  }
};
var energy_1 = {
  metric: energy,
  _anchors: {
    metric: {
      unit: 'J',
      ratio: 1
    }
  }
};

var reactiveEnergy;
reactiveEnergy = {
  VARh: {
    name: {
      singular: 'Volt-Ampere Reactive Hour',
      plural: 'Volt-Amperes Reactive Hour'
    },
    to_anchor: 1
  },
  mVARh: {
    name: {
      singular: 'Millivolt-Ampere Reactive Hour',
      plural: 'Millivolt-Amperes Reactive Hour'
    },
    to_anchor: .001
  },
  kVARh: {
    name: {
      singular: 'Kilovolt-Ampere Reactive Hour',
      plural: 'Kilovolt-Amperes Reactive Hour'
    },
    to_anchor: 1000
  },
  MVARh: {
    name: {
      singular: 'Megavolt-Ampere Reactive Hour',
      plural: 'Megavolt-Amperes Reactive Hour'
    },
    to_anchor: 1000000
  },
  GVARh: {
    name: {
      singular: 'Gigavolt-Ampere Reactive Hour',
      plural: 'Gigavolt-Amperes Reactive Hour'
    },
    to_anchor: 1000000000
  }
};
var reactiveEnergy_1 = {
  metric: reactiveEnergy,
  _anchors: {
    metric: {
      unit: 'VARh',
      ratio: 1
    }
  }
};

var metric$a, imperial$8;
metric$a = {
  'mm3/s': {
    name: {
      singular: 'Cubic Millimeter per second',
      plural: 'Cubic Millimeters per second'
    },
    to_anchor: 1 / 1000000
  },
  'cm3/s': {
    name: {
      singular: 'Cubic Centimeter per second',
      plural: 'Cubic Centimeters per second'
    },
    to_anchor: 1 / 1000
  },
  'ml/s': {
    name: {
      singular: 'Millilitre per second',
      plural: 'Millilitres per second'
    },
    to_anchor: 1 / 1000
  },
  'cl/s': {
    name: {
      singular: 'Centilitre per second',
      plural: 'Centilitres per second'
    },
    to_anchor: 1 / 100
  },
  'dl/s': {
    name: {
      singular: 'Decilitre per second',
      plural: 'Decilitres per second'
    },
    to_anchor: 1 / 10
  },
  'l/s': {
    name: {
      singular: 'Litre per second',
      plural: 'Litres per second'
    },
    to_anchor: 1
  },
  'l/min': {
    name: {
      singular: 'Litre per minute',
      plural: 'Litres per minute'
    },
    to_anchor: 1 / 60
  },
  'l/h': {
    name: {
      singular: 'Litre per hour',
      plural: 'Litres per hour'
    },
    to_anchor: 1 / 3600
  },
  'kl/s': {
    name: {
      singular: 'Kilolitre per second',
      plural: 'Kilolitres per second'
    },
    to_anchor: 1000
  },
  'kl/min': {
    name: {
      singular: 'Kilolitre per minute',
      plural: 'Kilolitres per minute'
    },
    to_anchor: 50 / 3
  },
  'kl/h': {
    name: {
      singular: 'Kilolitre per hour',
      plural: 'Kilolitres per hour'
    },
    to_anchor: 5 / 18
  },
  'm3/s': {
    name: {
      singular: 'Cubic meter per second',
      plural: 'Cubic meters per second'
    },
    to_anchor: 1000
  },
  'm3/min': {
    name: {
      singular: 'Cubic meter per minute',
      plural: 'Cubic meters per minute'
    },
    to_anchor: 50 / 3
  },
  'm3/h': {
    name: {
      singular: 'Cubic meter per hour',
      plural: 'Cubic meters per hour'
    },
    to_anchor: 5 / 18
  },
  'km3/s': {
    name: {
      singular: 'Cubic kilometer per second',
      plural: 'Cubic kilometers per second'
    },
    to_anchor: 1000000000000
  }
};
imperial$8 = {
  'tsp/s': {
    name: {
      singular: 'Teaspoon per second',
      plural: 'Teaspoons per second'
    },
    to_anchor: 1 / 6
  },
  'Tbs/s': {
    name: {
      singular: 'Tablespoon per second',
      plural: 'Tablespoons per second'
    },
    to_anchor: 1 / 2
  },
  'in3/s': {
    name: {
      singular: 'Cubic inch per second',
      plural: 'Cubic inches per second'
    },
    to_anchor: 0.55411
  },
  'in3/min': {
    name: {
      singular: 'Cubic inch per minute',
      plural: 'Cubic inches per minute'
    },
    to_anchor: 0.55411 / 60
  },
  'in3/h': {
    name: {
      singular: 'Cubic inch per hour',
      plural: 'Cubic inches per hour'
    },
    to_anchor: 0.55411 / 3600
  },
  'fl-oz/s': {
    name: {
      singular: 'Fluid Ounce per second',
      plural: 'Fluid Ounces per second'
    },
    to_anchor: 1
  },
  'fl-oz/min': {
    name: {
      singular: 'Fluid Ounce per minute',
      plural: 'Fluid Ounces per minute'
    },
    to_anchor: 1 / 60
  },
  'fl-oz/h': {
    name: {
      singular: 'Fluid Ounce per hour',
      plural: 'Fluid Ounces per hour'
    },
    to_anchor: 1 / 3600
  },
  'cup/s': {
    name: {
      singular: 'Cup per second',
      plural: 'Cups per second'
    },
    to_anchor: 8
  },
  'pnt/s': {
    name: {
      singular: 'Pint per second',
      plural: 'Pints per second'
    },
    to_anchor: 16
  },
  'pnt/min': {
    name: {
      singular: 'Pint per minute',
      plural: 'Pints per minute'
    },
    to_anchor: 4 / 15
  },
  'pnt/h': {
    name: {
      singular: 'Pint per hour',
      plural: 'Pints per hour'
    },
    to_anchor: 1 / 225
  },
  'qt/s': {
    name: {
      singular: 'Quart per second',
      plural: 'Quarts per second'
    },
    to_anchor: 32
  },
  'gal/s': {
    name: {
      singular: 'Gallon per second',
      plural: 'Gallons per second'
    },
    to_anchor: 128
  },
  'gal/min': {
    name: {
      singular: 'Gallon per minute',
      plural: 'Gallons per minute'
    },
    to_anchor: 32 / 15
  },
  'gal/h': {
    name: {
      singular: 'Gallon per hour',
      plural: 'Gallons per hour'
    },
    to_anchor: 8 / 225
  },
  'ft3/s': {
    name: {
      singular: 'Cubic foot per second',
      plural: 'Cubic feet per second'
    },
    to_anchor: 957.506
  },
  'ft3/min': {
    name: {
      singular: 'Cubic foot per minute',
      plural: 'Cubic feet per minute'
    },
    to_anchor: 957.506 / 60
  },
  'ft3/h': {
    name: {
      singular: 'Cubic foot per hour',
      plural: 'Cubic feet per hour'
    },
    to_anchor: 957.506 / 3600
  },
  'yd3/s': {
    name: {
      singular: 'Cubic yard per second',
      plural: 'Cubic yards per second'
    },
    to_anchor: 25852.7
  },
  'yd3/min': {
    name: {
      singular: 'Cubic yard per minute',
      plural: 'Cubic yards per minute'
    },
    to_anchor: 25852.7 / 60
  },
  'yd3/h': {
    name: {
      singular: 'Cubic yard per hour',
      plural: 'Cubic yards per hour'
    },
    to_anchor: 25852.7 / 3600
  }
};
var volumeFlowRate = {
  metric: metric$a,
  imperial: imperial$8,
  _anchors: {
    metric: {
      unit: 'l/s',
      ratio: 33.8140227
    },
    imperial: {
      unit: 'fl-oz/s',
      ratio: 1 / 33.8140227
    }
  }
};

var metric$b, imperial$9;
metric$b = {
  'lx': {
    name: {
      singular: 'Lux',
      plural: 'Lux'
    },
    to_anchor: 1
  }
};
imperial$9 = {
  'ft-cd': {
    name: {
      singular: 'Foot-candle',
      plural: 'Foot-candles'
    },
    to_anchor: 1
  }
};
var illuminance = {
  metric: metric$b,
  imperial: imperial$9,
  _anchors: {
    metric: {
      unit: 'lx',
      ratio: 1 / 10.76391
    },
    imperial: {
      unit: 'ft-cd',
      ratio: 10.76391
    }
  }
};

var frequency;
frequency = {
  mHz: {
    name: {
      singular: 'millihertz',
      plural: 'millihertz'
    },
    to_anchor: 1 / 1000
  },
  Hz: {
    name: {
      singular: 'hertz',
      plural: 'hertz'
    },
    to_anchor: 1
  },
  kHz: {
    name: {
      singular: 'kilohertz',
      plural: 'kilohertz'
    },
    to_anchor: 1000
  },
  MHz: {
    name: {
      singular: 'megahertz',
      plural: 'megahertz'
    },
    to_anchor: 1000 * 1000
  },
  GHz: {
    name: {
      singular: 'gigahertz',
      plural: 'gigahertz'
    },
    to_anchor: 1000 * 1000 * 1000
  },
  THz: {
    name: {
      singular: 'terahertz',
      plural: 'terahertz'
    },
    to_anchor: 1000 * 1000 * 1000 * 1000
  },
  rpm: {
    name: {
      singular: 'rotation per minute',
      plural: 'rotations per minute'
    },
    to_anchor: 1 / 60
  },
  "deg/s": {
    name: {
      singular: 'degree per second',
      plural: 'degrees per second'
    },
    to_anchor: 1 / 360
  },
  "rad/s": {
    name: {
      singular: 'radian per second',
      plural: 'radians per second'
    },
    to_anchor: 1 / (Math.PI * 2)
  }
};
var frequency_1 = {
  metric: frequency,
  _anchors: {
    frequency: {
      unit: 'hz',
      ratio: 1
    }
  }
};

var angle;
angle = {
  rad: {
    name: {
      singular: 'radian',
      plural: 'radians'
    },
    to_anchor: 180 / Math.PI
  },
  deg: {
    name: {
      singular: 'degree',
      plural: 'degrees'
    },
    to_anchor: 1
  },
  grad: {
    name: {
      singular: 'gradian',
      plural: 'gradians'
    },
    to_anchor: 9 / 10
  },
  arcmin: {
    name: {
      singular: 'arcminute',
      plural: 'arcminutes'
    },
    to_anchor: 1 / 60
  },
  arcsec: {
    name: {
      singular: 'arcsecond',
      plural: 'arcseconds'
    },
    to_anchor: 1 / 3600
  }
};
var angle_1 = {
  metric: angle,
  _anchors: {
    metric: {
      unit: 'deg',
      ratio: 1
    }
  }
};

var metric$c;
metric$c = {
  c: {
    name: {
      singular: 'Coulomb',
      plural: 'Coulombs'
    },
    to_anchor: 1
  },
  mC: {
    name: {
      singular: 'Millicoulomb',
      plural: 'Millicoulombs'
    },
    to_anchor: 1 / 1000
  },
  μC: {
    name: {
      singular: 'Microcoulomb',
      plural: 'Microcoulombs'
    },
    to_anchor: 1 / 1000000
  },
  nC: {
    name: {
      singular: 'Nanocoulomb',
      plural: 'Nanocoulombs'
    },
    to_anchor: 1e-9
  },
  pC: {
    name: {
      singular: 'Picocoulomb',
      plural: 'Picocoulombs'
    },
    to_anchor: 1e-12
  }
};
var charge = {
  metric: metric$c,
  imperial: {},
  _anchors: {
    metric: {
      unit: 'c',
      ratio: 1
    }
  }
};

var metric$d;
metric$d = {
  N: {
    name: {
      singular: 'Newton',
      plural: 'Newtons'
    },
    to_anchor: 1
  },
  kN: {
    name: {
      singular: 'Kilonewton',
      plural: 'Kilonewtons'
    },
    to_anchor: 1000
  },
  lbf: {
    name: {
      singular: 'Pound-force',
      plural: 'Pound-forces'
    },
    to_anchor: 4.44822
  }
};
var force = {
  metric: metric$d,
  imperial: {},
  _anchors: {
    metric: {
      unit: 'N',
      ratio: 1
    }
  }
};

var metric$e;
metric$e = {
  'g-force': {
    name: {
      singular: 'g-force',
      plural: 'g-forces'
    },
    to_anchor: 9.80665
  },
  'm/s2': {
    name: {
      singular: 'meter per second squared',
      plural: 'meters per second squared'
    },
    to_anchor: 1
  }
};
var acceleration = {
  metric: metric$e,
  imperial: {},
  _anchors: {
    metric: {
      unit: 'g-force',
      ratio: 1
    }
  }
};

var intensity;
intensity = {
  'W/m2': {
    name: {
      singular: 'watt per meter squared',
      plural: 'watts per meters squared'
    },
    to_anchor: 1
  }
};
var intensity_1 = {
  metric: intensity,
  _anchors: {
    metric: {
      unit: 'W/m2',
      ratio: 1
    }
  }
};

/**
 * Modified version of 'convert-units' which was written by Ben Ng 
 * @see http://benng.me
 * @see https://www.npmjs.com/package/convert-units
 */

var convert,
    measures = {
  length: length,
  area: area,
  mass: mass,
  volume: volume,
  each: each,
  temperature: temperature,
  time: time_1,
  digital: digital,
  partsPer: partsPer,
  speed: speed,
  pace: pace,
  pressure: pressure,
  current: current_1,
  voltage: voltage_1,
  power: power_1,
  reactivePower: reactivePower_1,
  apparentPower: apparentPower_1,
  energy: energy_1,
  reactiveEnergy: reactiveEnergy_1,
  volumeFlowRate: volumeFlowRate,
  illuminance: illuminance,
  frequency: frequency_1,
  angle: angle_1,
  charge: charge,
  force: force,
  acceleration: acceleration,
  intensity: intensity_1
},
    Converter;

Converter = function (numerator, denominator) {
  if (denominator) this.val = numerator / denominator;else this.val = numerator;
};
/**
 * Lets the converter know the source unit abbreviation
 */


Converter.prototype.from = function (from) {
  if (this.destination) throw new Error('.from must be called before .to');
  this.origin = this.getUnit(from);

  if (!this.origin) {
    this.throwUnsupportedUnitError(from);
  }

  return this;
};
/**
 * Converts the unit and returns the value
 */


Converter.prototype.to = function (to) {
  if (!this.origin) throw new Error('.to must be called after .from');
  this.destination = this.getUnit(to);
  var result, transform;

  if (!this.destination) {
    this.throwUnsupportedUnitError(to);
  } // Don't change the value if origin and destination are the same


  if (this.origin.abbr === this.destination.abbr) {
    return this.val;
  } // You can't go from liquid to mass, for example


  if (this.destination.measure != this.origin.measure) {
    throw new Error('Cannot convert incompatible measures of ' + this.destination.measure + ' and ' + this.origin.measure);
  }
  /**
   * Convert from the source value to its anchor inside the system
   */


  result = this.val * this.origin.unit.to_anchor;
  /**
   * For some changes it's a simple shift (C to K)
   * So we'll add it when convering into the unit (later)
   * and subtract it when converting from the unit
   */

  if (this.origin.unit.anchor_shift) {
    result -= this.origin.unit.anchor_shift;
  }
  /**
   * Convert from one system to another through the anchor ratio. Some conversions
   * aren't ratio based or require more than a simple shift. We can provide a custom
   * transform here to provide the direct result
   */


  if (this.origin.system != this.destination.system) {
    transform = measures[this.origin.measure]._anchors[this.origin.system].transform;

    if (typeof transform === 'function') {
      result = transform(result);
    } else {
      result *= measures[this.origin.measure]._anchors[this.origin.system].ratio;
    }
  }
  /**
   * This shift has to be done after the system conversion business
   */


  if (this.destination.unit.anchor_shift) {
    result += this.destination.unit.anchor_shift;
  }
  /**
   * Convert to another unit inside the destination system
   */


  return result / this.destination.unit.to_anchor;
};
/**
 * Converts the unit to the best available unit.
 */


Converter.prototype.toBest = function (options) {
  if (!this.origin) throw new Error('.toBest must be called after .from');
  var options = Object.assign({
    exclude: [],
    cutOffNumber: 1
  }, options);
  var best;
  /**
    Looks through every possibility for the 'best' available unit.
    i.e. Where the value has the fewest numbers before the decimal point,
    but is still higher than 1.
  */

  lodash_foreach(this.possibilities(), function (possibility) {
    var unit = this.describe(possibility);
    var isIncluded = options.exclude.indexOf(possibility) === -1;

    if (isIncluded && unit.system === this.origin.system) {
      var result = this.to(possibility);

      if (!best || result >= options.cutOffNumber && result < best.val) {
        best = {
          val: result,
          unit: possibility,
          singular: unit.singular,
          plural: unit.plural
        };
      }
    }
  }.bind(this));
  return best;
};
/**
 * Finds the unit
 */


Converter.prototype.getUnit = function (abbr) {
  var found;
  lodash_foreach(measures, function (systems, measure) {
    lodash_foreach(systems, function (units, system) {
      if (system == '_anchors') return false;
      lodash_foreach(units, function (unit, testAbbr) {
        if (testAbbr == abbr) {
          found = {
            abbr: abbr,
            measure: measure,
            system: system,
            unit: unit
          };
          return false;
        }
      });
      if (found) return false;
    });
    if (found) return false;
  });
  return found;
};

var describe = function (resp) {
  return {
    abbr: resp.abbr,
    measure: resp.measure,
    system: resp.system,
    singular: resp.unit.name.singular,
    plural: resp.unit.name.plural
  };
};
/**
 * An alias for getUnit
 */


Converter.prototype.describe = function (abbr) {
  var resp = Converter.prototype.getUnit(abbr);
  var desc = null;

  try {
    desc = describe(resp);
  } catch (err) {
    this.throwUnsupportedUnitError(abbr);
  }

  return desc;
};
/**
 * Detailed list of all supported units
 */


Converter.prototype.list = function (measure) {
  var list = [];
  lodash_foreach(measures, function (systems, testMeasure) {
    if (measure && measure !== testMeasure) return;
    lodash_foreach(systems, function (units, system) {
      if (system == '_anchors') return false;
      lodash_foreach(units, function (unit, abbr) {
        list = list.concat(describe({
          abbr: abbr,
          measure: testMeasure,
          system: system,
          unit: unit
        }));
      });
    });
  });
  return list;
};

Converter.prototype.throwUnsupportedUnitError = function (what) {
  var validUnits = [];
  lodash_foreach(measures, function (systems, measure) {
    lodash_foreach(systems, function (units, system) {
      if (system == '_anchors') return false;
      validUnits = validUnits.concat(lodash_keys(units));
    });
  });
  throw new Error('Unsupported unit ' + what + ', use one of: ' + validUnits.join(', '));
};
/**
 * Returns the abbreviated measures that the value can be
 * converted to.
 */


Converter.prototype.possibilities = function (measure) {
  var possibilities = [];

  if (!this.origin && !measure) {
    lodash_foreach(lodash_keys(measures), function (measure) {
      lodash_foreach(measures[measure], function (units, system) {
        if (system == '_anchors') return false;
        possibilities = possibilities.concat(lodash_keys(units));
      });
    });
  } else {
    measure = measure || this.origin.measure;
    lodash_foreach(measures[measure], function (units, system) {
      if (system == '_anchors') return false;
      possibilities = possibilities.concat(lodash_keys(units));
    });
  }

  return possibilities;
};
/**
 * Returns the abbreviated measures that the value can be
 * converted to.
 */


Converter.prototype.measures = function () {
  return lodash_keys(measures);
};

convert = function (value) {
  return new Converter(value);
};

var lib = convert;

const units = {
    convert: lib,
    checkConversion: (fromUnit, toUnit) => lib().from(fromUnit).possibilities().filter(x => x === toUnit).length > 0
};

const clamp = (v, a, b) => v < a ? a : v > b ? b : v;

const ID = {
    Generate: (len) => {
        return Math.round((Math.random() * 1e15)).toString(16).slice(0, clamp(len,1,16))
    }
};

const numCheck = (num) => Number.isFinite(Number(num));
const arrCheck = (arr) => Array.isArray(arr);
const numArrayCheck = (numArray) => arrCheck(numArray) ? numArray.filter(n => !numCheck(n)).length == 0 : false;
const computable = (v) => numCheck(v) || numArrayCheck(v);
var num = { numCheck, arrCheck, numArrayCheck, computable };

const round = (value, precision = 1) => Math.round(value / precision) * precision;

class Data {
    constructor(id) {
        this.id = id || ID.Generate(8);
        this.name = id ? id : "";
        this.data = undefined;
        this.type = undefined;
        this.unit = undefined;
    }
    setName(name) {
        this.name = name;
        return this;
    }
    setData(data) {
        if (num.computable(data)) {
            this.data = data; 
            if (num.numCheck(this.data)) {
                this._data_is = "number";
            } else if (num.numArrayCheck(this.data)) {
                this._data_is = "array";
            }
        }
        else {
             console.error('data needs to be a number or an array of numbers');
        }
        return this;
    }
    setID(id) {
        this.id = id;
        return this;
    }
    setType(type) {
        this.type = type;
        return this;
    }
    setUnit(unit) {
        let error = false;
        try {
            units.checkConversion(unit, this.unit);
        } catch (err) {
            error = true;
            console.error(err);
        } finally {
            if (!error) {
                this.unit = unit;

                return this;
            } else {
  
                return this;
                
            }
        }
       
    }
    convertTo(unit) {
        if (units.checkConversion(unit, this.unit)) {
            switch (this._data_is) {
                case "number":
                    this.data = units.convert(this.data).from(this.unit).to(unit);
                    this.unit = unit;
                    break;
                case "array":
                    this.data = this.data.map(x => units.convert(x).from(this.unit).to(unit));
                    this.unit = unit;
                default:
                    break;
            }
        }
        return this;
    }
    roundTo(decimalPrecision) {
            switch (this._data_is) {
                case "number":
                    this.data = round(this.data,decimalPrecision); 
                    break;
                case "array":
                    this.data = this.data.map(x => round(x, decimalPrecision));
                default:
                    break;
            }
        return this;
    }
    tabulate(orientation = "vertical", order = ["name", "type", "unit", "data"]) {
        let tabular = "";
        let temp = {
            data: this.data,
            unit: this.unit,
            type: this.type,
            name: this.name
        };

        switch (this._data_is) {
            case "number":
                temp.data = [this.data];
                break;
            case "array":
                break;
            default:
                break;
        }
        if (orientation === 'column') {
            orientation = "vertical";
        }
        if (orientation === 'row') {
            orientation = 'horizontal';
        }
        switch (orientation) {
            case "vertical":
                order.forEach(item => {
                    if (item === "data") {
                        temp.data.forEach(d => {
                            tabular += `${d}\n`;
                        });
                    }
                    else {
                         tabular += `${temp[item]}\n`;
                    }
                });
                break;
            case "horizontal":
            order.forEach(item => {
                 if (item === "data") {
                     temp.data.forEach(d => {
                         tabular += `${d}\t`;
                     });
                 } else {
                     tabular += `${temp[item]}\t`;
                 }
            });
            break;
            default:
                break;
        }
        console.log(tabular);
        return tabular;
    }
}

class SoundPressure extends Data{
    constructor(id) {
        super(id);
        this.setType('SoundPressure');
        this.unit = 'Pa';
        this.ref = units.convert(20).from('uPa').to('Pa');
    }
    setUnit(unit) {
        let error = false;
        try {
            units.checkConversion(unit, this.unit);
        } catch (err) {
            error = true;
            console.error(err);
        } finally {
            if (!error) {
                this.unit = unit;
                this.ref = units.convert(20).from('uPa').to(this.unit);
                return this;
            } else {
                return this;
            }
        }
    }
    convertTo(unit) {
        if (units.checkConversion(unit, this.unit)) {
            switch (this._data_is) {
                case "number":
                    this.data = units.convert(this.data).from(this.unit).to(unit);
                    this.unit = unit;
                    this.ref = units.convert(20).from('uPa').to(this.unit);
                    break;
                case "array":
                    this.data = this.data.map(x => units.convert(x).from(this.unit).to(unit));
                    this.unit = unit;
                    this.ref = units.convert(20).from('uPa').to(this.unit);
                default:
                    break;
            }
        }
        return this;
    }
}

class SoundIntensity extends Data {
    constructor(id) {
        super(id);
        this.setType('SoundIntensity');
        this.unit = 'W/m2';
        this.ref = 1e-12;
    }
   
}

class SoundPower extends Data {
    constructor(id) {
        super(id);
        this.setType('SoundPower');
        this.unit = 'W/m2';
        this.ref = 1e-12;
    }
}

class SoundPressureLevel extends Data {
    constructor(id) {
        super(id);
        this.setType('SoundPressureLevel');
        this.unit = 'dB';
        this.weight = undefined;
        this.ref = units.convert(20).from('uPa').to('Pa');
          
    }
    setUnit(unit) {
        let error = false;
        try {
            units.checkConversion(unit, this.unit);
        } catch (err) {
            error = true;
            console.error(err);
        } finally {
            if (!error) {
                this.unit = unit;
                this.ref = units.convert(20).from('uPa').to(this.unit);
                return this;
            } else {
                return this;
            }
        }
    }
    setWeight(weight) {
        const w = WeightTranslation(weight);
        if (w !== null) {
            this.weight = w;
            this.unit = `dB-${this.weight.toUpperCase()} (re: 20uPa)`;
        }
        return this;
    }
    changeWeight(desiredWeight,frequencies) {
        if (!this.weight) {
            const err = 'You must call .setWeight() before calling .to()';
            console.error(err);
            return null;
        } else {
            const dw = WeightTranslation(desiredWeight);
            if (dw !== null) {
                let _data = this.data;
                if (num.numCheck(this.data)) {
                    _data = [_data];
                }
                let dbz = [];
                switch (this.weight) {
                    case 'a':
                        const a = frequencies.map(f => Weight.A(f));
                        dbz = _data.map((x, i) => x - a[i]);
                        break;
                    case 'b':
                        const b = frequencies.map(f => Weight.B(f));
                        dbz = _data.map((x, i) => x - b[i]);
                        break;
                    case 'c':
                        const c = frequencies.map(f => Weight.C(f));
                        dbz = _data.map((x, i) => x - c[i]);
                        break;
                    case 'd':
                        const d = frequencies.map(f => Weight.D(f));
                        dbz = _data.map((x, i) => x - d[i]);
                        break;
                    case 'z':
                        dbz = _data;
                        break;
                    default:
                        break;
                }    
                switch (dw) {
                    case 'a':
                        const a = frequencies.map(f => Weight.A(f));
                        this.data = dbz.map((x, i) => x + a[i]);
                        this.weight = dw;
                         this.unit = `dB-${this.weight.toUpperCase()} (re: 20uPa)`;
                        break;

                    case 'b':
                        const b = frequencies.map(f => Weight.B(f));
                        this.data = dbz.map((x, i) => x + b[i]);
                        this.weight = dw;
                         this.unit = `dB-${this.weight.toUpperCase()} (re: 20uPa)`;
                        break;
                    case 'c':
                        const c = frequencies.map(f => Weight.C(f));
                        this.data = dbz.map((x, i) => x + c[i]);
                        this.weight = dw;
                         this.unit = `dB-${this.weight.toUpperCase()} (re: 20uPa)`;
                        break;
                    case 'd':
                        const d = frequencies.map(f => Weight.D(f));
                        this.data = dbz.map((x, i) => x + d[i]);
                        this.weight = dw;
                         this.unit = `dB-${this.weight.toUpperCase()} (re: 20uPa)`;
                        break;
                    case 'z':
                        this.data = dbz;
                        this.weight = dw;
                         this.unit = `dB-${this.weight.toUpperCase()} (re: 20uPa)`;
                        break;
                    default:
                        break;
                }
                return this;
            } else {
                return null;
            }
        }
    }
    convertTo(unit) {
        if (units.checkConversion(unit, this.unit)) {
            switch (this._data_is) {
                case "number":
                    this.data = units.convert(this.data).from(this.unit).to(unit);
                    this.unit = unit;
                    this.ref = units.convert(20).from('uPa').to(this.unit);
                    break;
                case "array":
                    this.data = this.data.map(x => units.convert(x).from(this.unit).to(unit));
                    this.unit = unit;
                    this.ref = units.convert(20).from('uPa').to(this.unit);
                default:
                    break;
            }
        }
        return this;
    }
    
}

class SoundIntensityLevel extends Data {
    constructor(id) {
        super(id);
        this.setType('SoundIntensityLevel');
        this.unit = 'dB';
        this.ref = 1e-12;
    }
    setUnit(unit) {
        let error = false;
        try {
            units.checkConversion(unit, this.unit);
        } catch (err) {
            error = true;
            console.error(err);
        } finally {
            if (!error) {
                this.unit = unit;

                return this;
            } else {
                return this;
            }
        }
    }
    convertTo(unit) {
        if (units.checkConversion(unit, this.unit)) {
            switch (this._data_is) {
                case "number":
                    this.data = units.convert(this.data).from(this.unit).to(unit);
                    this.unit = unit;

                    break;
                case "array":
                    this.data = this.data.map(x => units.convert(x).from(this.unit).to(unit));
                    this.unit = unit;

                default:
                    break;
            }
        }
        return this;
    }
}

class SoundPowerLevel extends Data {
      constructor(id) {
          super(id);
          this.setType('SoundPowerLevel');
          this.unit = 'dB';
          this.ref = 1e-12;
      }
      setUnit(unit) {
          let error = false;
          try {
              units.checkConversion(unit, this.unit);
          } catch (err) {
              error = true;
              console.error(err);
          } finally {
              if (!error) {
                  this.unit = unit;

                  return this;
              } else {
                  return this;
              }
          }
      }
      convertTo(unit) {
          if (units.checkConversion(unit, this.unit)) {
              switch (this._data_is) {
                  case "number":
                      this.data = units.convert(this.data).from(this.unit).to(unit);
                      this.unit = unit;

                      break;
                  case "array":
                      this.data = this.data.map(x => units.convert(x).from(this.unit).to(unit));
                      this.unit = unit;

                  default:
                      break;
              }
          }
          return this;
      }
}

const Types = {
    SoundPressure,
    SoundIntensity,
    SoundPower,
    SoundPressureLevel,
    SoundIntensityLevel,
    SoundPowerLevel
};

const Translations = {
    SoundPressureLevel: ['spl', 'soundpressurelevel', 'lp'],
    SoundIntensityLevel: ['sil', 'soundintensitylevel', 'li'],
    SoundPowerLevel: ['swl', 'soundpowerlevel', 'lw'],
    SoundPower: ['soundpower', 'w', 'power'],
    SoundIntensity: ['soundintensity', 'i', 'intensity'],
    SoundPressure: ['soundpressure','p','pressure']
};

const TypeTranslation = (str) => {
    let _str = str.toLowerCase().replace(/[-_\s\t]+/gmi, '');
    let type = undefined;
    Object.keys(Translations).forEach(key => {
        Translations[key].forEach(translation => {
            if (_str === translation) {
                type = key;
            }
        });
    });
    return type;
};

class Measurement {
    constructor(id) {
        this.id = id || "";
        this.datachain = [];
        this.name = "";
        this.type = "";
        this.operationHistory = ['constructor'];
    }
    lastOperation() {
        return this.operationHistory[this.operationHistory.length - 1];
    }
    setName(name) {
        this.name = name;
        return this;
    }
    setType(type) {
        this.type = type;
        return this;
    }
    setFrequency(frequency) {
        this.frequency = frequency;
        this.operationHistory.push('setFrequency');
        return this;
    }
    addData(data) {
        this.pendingData = data;
        this.operationHistory.push('addData');
        return this;
    }
    ofType(type) {
        if (!this.pendingData) {
            console.error('must set data with \'.addData([*your-data*])\' before setting its type');
            return this;
        }
  
        let translation = TypeTranslation(type);
        if (translation) {
            let newdata = new Types[translation]();
            if (this.pendingName) {
                newdata.setName(this.pendingName);
                this.pendingName = undefined;
            }
            newdata.setData(this.pendingData);
            this.pendingData = undefined;
            this.datachain.push(newdata);
        }
        this.operationHistory.push('ofType');
        return this;
    }
    withName(name) {
        if (this.lastOperation() === 'ofType') {
            this.datachain[this.datachain.length - 1].setName(name);
        }
        else if (this.pendingData) {
            this.pendingName = name;
        }
        else if (!this.pendingData) {
            console.error('must set data with \'.addData([*your-data*])\' before setting its name');
            return this;
        }
        else 
        this.operationHistory.push('withName');
        return this;
    }
    withWeight(weight) {
        if (this.datachain[this.datachain.length - 1].type === "SoundPressureLevel") {
            this.datachain[this.datachain.length - 1].setWeight(weight);
        }
        else {
            const err = `Must have type SoundPressureLevel!`;
            console.error(err);
        }
        return this;
    }
    changeWeight(desiredWeight) {
        if (!this.frequency) {
            const err = `Must set frequency array before converting`;
            console.error(err);
        }
        else if (this.datachain.length==0) {
            const err = `Must add data before converting`;
            console.error(err);
        }
        else if (!(this.frequency.length == this.datachain[this.datachain.length-1].data.length)) {
            const err = `array mismatch: frequency array has length [${this.frequency.length}] while data array has length [${this.datachain[this.datachain.length-1].data.length}]. They must be the same size.`;
            console.error(err);
        }
        else if (this.datachain[this.datachain.length-1].type!=="SoundPressureLevel"){
            const err = `Cannot change the weight of ${this.datachain[this.datachain.length - 1].type} data. must have type SoundPressureLevel`;
            console.error(err);
        }
        else {
            const newdata = new Types.SoundPressureLevel();
            newdata.setData(this.datachain[this.datachain.length - 1].data);
            newdata.setWeight(this.datachain[this.datachain.length - 1].weight);
            newdata.setName(this.datachain[this.datachain.length - 1].name);
            newdata.changeWeight(desiredWeight, this.frequency);
            this.datachain.push(newdata);
            return this;
        }
    }
}

class RT{
    constructor(params) {
        console.log(params);
    }

}

/* 
 * Free FFT and convolution (JavaScript)
 * 
 * Copyright (c) 2017 Project Nayuki. (MIT License)
 * https://www.nayuki.io/page/free-small-fft-in-multiple-languages
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * - The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 * - The Software is provided "as is", without warranty of any kind, express or
 *   implied, including but not limited to the warranties of merchantability,
 *   fitness for a particular purpose and noninfringement. In no event shall the
 *   authors or copyright holders be liable for any claim, damages or other
 *   liability, whether in an action of contract, tort or otherwise, arising from,
 *   out of or in connection with the Software or the use or other dealings in the
 *   Software.
 */


/* 
 * Computes the discrete Fourier transform (DFT) of the given complex vector, storing the result back into the vector.
 * The vector can have any length. This is a wrapper function.
 */
const transform = (real, imag) => {
    var n = real.length;
    if (n != imag.length)
        throw "Mismatched lengths";
    if (n == 0)
        return;
    else if ((n & (n - 1)) == 0)  // Is power of 2
        transformRadix2(real, imag);
    else  // More complicated algorithm for arbitrary sizes
        transformBluestein(real, imag);
};


/* 
 * Computes the inverse discrete Fourier transform (IDFT) of the given complex vector, storing the result back into the vector.
 * The vector can have any length. This is a wrapper function. This transform does not perform scaling, so the inverse is not a true inverse.
 */
const inverseTransform = (real, imag) => {
    transform(imag, real);
};


/* 
 * Computes the discrete Fourier transform (DFT) of the given complex vector, storing the result back into the vector.
 * The vector's length must be a power of 2. Uses the Cooley-Tukey decimation-in-time radix-2 algorithm.
 */
const transformRadix2 = (real, imag) => {
    // Length variables
    var n = real.length;
    if (n != imag.length)
        throw "Mismatched lengths";
    if (n == 1)  // Trivial transform
        return;
    var levels = -1;
    for (var i = 0; i < 32; i++) {
        if (1 << i == n)
            levels = i;  // Equal to log2(n)
    }
    if (levels == -1)
        throw "Length is not a power of 2";

    // Trigonometric tables
    var cosTable = new Array(n / 2);
    var sinTable = new Array(n / 2);
    for (var i = 0; i < n / 2; i++) {
        cosTable[i] = Math.cos(2 * Math.PI * i / n);
        sinTable[i] = Math.sin(2 * Math.PI * i / n);
    }

    // Bit-reversed addressing permutation
    for (var i = 0; i < n; i++) {
        var j = reverseBits(i, levels);
        if (j > i) {
            var temp = real[i];
            real[i] = real[j];
            real[j] = temp;
            temp = imag[i];
            imag[i] = imag[j];
            imag[j] = temp;
        }
    }

    // Cooley-Tukey decimation-in-time radix-2 FFT
    for (var size = 2; size <= n; size *= 2) {
        var halfsize = size / 2;
        var tablestep = n / size;
        for (var i = 0; i < n; i += size) {
            for (var j = i, k = 0; j < i + halfsize; j++ , k += tablestep) {
                var l = j + halfsize;
                var tpre = real[l] * cosTable[k] + imag[l] * sinTable[k];
                var tpim = -real[l] * sinTable[k] + imag[l] * cosTable[k];
                real[l] = real[j] - tpre;
                imag[l] = imag[j] - tpim;
                real[j] += tpre;
                imag[j] += tpim;
            }
        }
    }

    // Returns the integer whose value is the reverse of the lowest 'bits' bits of the integer 'x'.
    const reverseBits = (x, bits) => {
        var y = 0;
        for (var i = 0; i < bits; i++) {
            y = (y << 1) | (x & 1);
            x >>>= 1;
        }
        return y;
    };
};


/* 
 * Computes the discrete Fourier transform (DFT) of the given complex vector, storing the result back into the vector.
 * The vector can have any length. This requires the convolution function, which in turn requires the radix-2 FFT function.
 * Uses Bluestein's chirp z-transform algorithm.
 */
const transformBluestein = (real, imag) => {
    // Find a power-of-2 convolution length m such that m >= n * 2 + 1
    var n = real.length;
    if (n != imag.length)
        throw "Mismatched lengths";
    var m = 1;
    while (m < n * 2 + 1)
        m *= 2;

    // Trignometric tables
    var cosTable = new Array(n);
    var sinTable = new Array(n);
    for (var i = 0; i < n; i++) {
        var j = i * i % (n * 2);  // This is more accurate than j = i * i
        cosTable[i] = Math.cos(Math.PI * j / n);
        sinTable[i] = Math.sin(Math.PI * j / n);
    }

    // Temporary vectors and preprocessing
    var areal = newArrayOfZeros(m);
    var aimag = newArrayOfZeros(m);
    for (var i = 0; i < n; i++) {
        areal[i] = real[i] * cosTable[i] + imag[i] * sinTable[i];
        aimag[i] = -real[i] * sinTable[i] + imag[i] * cosTable[i];
    }
    var breal = newArrayOfZeros(m);
    var bimag = newArrayOfZeros(m);
    breal[0] = cosTable[0];
    bimag[0] = sinTable[0];
    for (var i = 1; i < n; i++) {
        breal[i] = breal[m - i] = cosTable[i];
        bimag[i] = bimag[m - i] = sinTable[i];
    }

    // Convolution
    var creal = new Array(m);
    var cimag = new Array(m);
    convolveComplex(areal, aimag, breal, bimag, creal, cimag);

    // Postprocessing
    for (var i = 0; i < n; i++) {
        real[i] = creal[i] * cosTable[i] + cimag[i] * sinTable[i];
        imag[i] = -creal[i] * sinTable[i] + cimag[i] * cosTable[i];
    }
};


/* 
 * Computes the circular convolution of the given real vectors. Each vector's length must be the same.
 */
const convolveReal = (x, y, out) => {
    var n = x.length;
    if (n != y.length || n != out.length)
        throw "Mismatched lengths";
    convolveComplex(x, newArrayOfZeros(n), y, newArrayOfZeros(n), out, newArrayOfZeros(n));
};


/* 
 * Computes the circular convolution of the given complex vectors. Each vector's length must be the same.
 */
const convolveComplex = (xreal, ximag, yreal, yimag, outreal, outimag) => {
    var n = xreal.length;
    if (n != ximag.length || n != yreal.length || n != yimag.length
        || n != outreal.length || n != outimag.length)
        throw "Mismatched lengths";

    xreal = xreal.slice();
    ximag = ximag.slice();
    yreal = yreal.slice();
    yimag = yimag.slice();
    transform(xreal, ximag);
    transform(yreal, yimag);

    for (var i = 0; i < n; i++) {
        var temp = xreal[i] * yreal[i] - ximag[i] * yimag[i];
        ximag[i] = ximag[i] * yreal[i] + xreal[i] * yimag[i];
        xreal[i] = temp;
    }
    inverseTransform(xreal, ximag);

    for (var i = 0; i < n; i++) {  // Scaling (because this FFT implementation omits it)
        outreal[i] = xreal[i] / n;
        outimag[i] = ximag[i] / n;
    }
};


const newArrayOfZeros = (n) => {
    var result = [];
    for (var i = 0; i < n; i++)
        result.push(0);
    return result;
};

const FFT = { transform, inverseTransform, transformRadix2, transformBluestein, convolveReal, convolveComplex, newArrayOfZeros };

const RMS = (samples) => Math.sqrt(samples.map(p => p * p).reduce((a, b) => a + b) / samples.length);

const AC = {
  Weight: Weight,
  Conversion: Conversion,
  Bands: Bands,
  dBsum: dBsum,
  Transmission: Transmission,
  Properties: Properties,
  RoomModes: RoomModes,
  Constants: constants,
  Measurement: Measurement,
  Types: Types,
  FFT: FFT,
  RT: RT,
  Buffer: buffer,
  RMS: RMS,
  units: units
};

export default AC;
