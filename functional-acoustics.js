(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('mathjs'), require('fast-sort')) :
    typeof define === 'function' && define.amd ? define(['mathjs', 'fast-sort'], factory) :
    (global = global || self, global['functional-acoustics'] = factory(global.math, global.sort));
}(this, function (math, sort) { 'use strict';

    math = math && math.hasOwnProperty('default') ? math['default'] : math;
    sort = sort && sort.hasOwnProperty('default') ? sort['default'] : sort;

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
            fromRange: (start, end) => {
                let nominal = octave_bands.map(x => x.Center);
                let startindex = nominal.indexOf(start);
                let count = nominal.indexOf(end) - startindex + 1;
                return nominal.splice(startindex, count);
            },
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

    const dBAdd = (dBs) => {
        let tentothe = dBs.map(dB => Math.pow(10, dB / 10));
        let sum = 0;
        tentothe.forEach(val => {
            sum += val;
        });
        return 10 * Math.log10(sum);
    };

    class Barrier{
        constructor() {

        }
        setSource(x, y){
            this.source = {
                x: x,
                y: y
            };
            return this;
        }
        setReciever(x, y){
            this.reciever = {
                x: x,
                y: y
            };
            return this;
        }
        setBarrier(x, y){
            this.barrier = {
                x: x,
                y: y
            };
            return this;
        }
        setSpeed(c){
            this.speed = c;
            return this;
        }
        getInsertionLoss(freq){
            freq = typeof freq === "number" ? [freq] : freq;
        }
    }

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

    class Measurement {
        constructor(measurementData) {
            this.measurementData = measurementData;
            if (this.measurementData.freq.length != this.measurementData.data.length) {
                throw (`freq has length ${this.measurementData.freq.length} while data has length ${this.measurementData.data.length}`);
            }
        }
    }

    const Modes = {
        calcModes: (params) => {
            let units = params.units || "ft";
            let c = params.c || Properties.Air.SpeedOfSound({
                temp: {
                    value: 70,
                    units: "F"
                },
                units: "ft/s"
            });
            let bands = Bands.ThirdOctave.withLimits;
            let length = params.dim[0] || 18;
            let width = params.dim[1] || 13;
            let height = params.dim[2] || 8;
            let nmax = params.nmax || 10;
            let freqlimits = params.freq || [16, 500];
            let stdSchema = params.stdSchema || 'biased';
            let overlap = params.overlap || 'no overlap';
           
            let N = [];
            for (let i = 0; i <= nmax; i++) {
                for (let j = 0; j <= nmax; j++) {
                    for (let k = 0; k <= nmax; k++) {
                        N.push([i, j, k]);
                    }
                }
            }
            N = N.splice(1);
            let freq = [];
            const getBand = (f,limit="Center") => {
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


            freq = sort(freq).asc(u => u.frequency);
            bonello = sort(bonello).asc(u => u.band);

            let stdDifference = math.std(derivative(freq.map(x => x.frequency)), stdSchema);

            let overlapCount = 0;

            for (let i = 1; i < freq.length - 1; i++) {
                let hbw = .01 * freq[i].frequency;


                if (freq[i + 1].frequency - freq[i].frequency < hbw) {
                    overlapCount++;
                }

            }
            let score;
            switch (overlap) {
                case "+overlap":
                    score = stdDifference + math.log10(overlapCount + 1);
                    break;
                case "*overlap":
                    score = stdDifference * math.log10(overlapCount + 1);
                    break;
                case "no overlap":
                    score = stdDifference;
                    break;
                default:

                    break;
            }

            return {
                dim: [length, width, height],
                L: length,
                W: width,
                H: height,
                modes: freq,
                bonello: bonello,
                score: score,
                overlapCount: overlapCount
            };
        }
    };

    const Acoustics = {
        Weight: Weight,
        Conversion: Conversion,
        Bands: Bands,
        dBAdd: dBAdd,
        Barrier: Barrier,
        Properties: Properties,
        Measurement: Measurement,
        Modes: Modes
    };

    return Acoustics;

}));
