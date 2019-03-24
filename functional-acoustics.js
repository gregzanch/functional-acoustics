(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.AC = factory());
}(this, function () { 'use strict';

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
        }
    };

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
            withLimits: octave_bands
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
     * Performs dB addition on every array passed in, rounded to an optional precision. 
     * @deprecated use dBsum instead
     * @param  {number[]} dBs - An n-dimmensional array of numbers
     * @param {number=} decimalPrecision - Number of decimals places to round the output to
     * @returns {number|number[]} A number or an (n-1)-dimmensional array of numbers
     */
    const dBAdd = (dBs, decimalPrecision=1) => {
        let _sum_;
        if (typeof dBs === "number") {
            throw "dBAdd requires an array, not a single number";
        }
        else if (typeof dBs === "string") {
             throw "dBAdd requires an array, not a single string";
        }
        else if (typeof dBs === "object") {
                if (typeof dBs[0] === "number") {
                    _sum_ = 10 * Math.log10(dBs.map(x => Math.pow(10, x / 10)).reduce((acc, a) => acc + a));
                }
                else if (typeof dBs[0] === "string") {
                    try {
                        _sum_ = 10 * Math.log10(dBs.map(x => Math.pow(10, Number(x) / 10)).reduce((acc, a) => acc + a));
                    } catch (error) {
                        throw error
                    }
                }
                else if (typeof dBs[0] === "object") {
                    try {
                        _sum_ = dBs.map(x => dBAdd(x));
                    }
                    catch (error) {
                        throw error
                    }
                }
            return _sum_;
        }
        else {
            return null;
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

        let bands = Bands.ThirdOctave.withLimits;
        let modeLimit = 10; 
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
        N.forEach(n => {
            let f = c / 2 * Math.sqrt(Math.pow(n[0] / length, 2) + Math.pow(n[1] / width, 2) + Math.pow(n[2] / height, 2));
            if (f >= freqlimits[0] && f <= freqlimits[1]) {
                let modeIndex = n.filter(x => x == 0).length;
                freq.push({
                    frequency: f,
                    mode: n,
                    modeType: ModeTypes[modeIndex],
                    modeTypeNumber: modeIndex + 1,
                    band: getBand(f)
                });
            }
        });

        let bonelloBands = [...new Set(freq.map(x => x.band))];

        let bonello = bonelloBands.map(freq_band => {
            return {
                band: freq_band,
                count: freq.filter(f => f.band == freq_band).length
            }
        });


        freq = sort$1(freq).asc(u => u.frequency);
        bonello = sort$1(bonello).asc(u => u.band);

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

    const Acoustics = {
        Weight: Weight,
        Conversion: Conversion,
        Bands: Bands,
        dBAdd: dBAdd,
        dBsum: dBsum,
        // Barrier: Barrier,
        Properties: Properties,
        // Measurement: Measurement,
        RoomModes: RoomModes
    };

    return Acoustics;

}));
