import Bands from './bands/bands';
import Properties from './properties';
import math from 'mathjs';
import sort from "fast-sort";

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
                    N.push([i, j, k])
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
        }
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
            dim: [
                Number(length.toFixed(2)),
                Number(width.toFixed(2)),
                Number(height.toFixed(2))
            ],
            L: Number(length.toFixed(2)),
            W: Number(width.toFixed(2)),
            H: Number(height.toFixed(2)),
            modes: freq,
            bonello: bonello,
            score: score,
            overlapCount: overlapCount
        };
    }
}


export default Modes