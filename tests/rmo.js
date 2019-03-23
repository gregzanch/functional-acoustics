const AC = require('../functional-acoustics');
const sort = require('fast-sort');
let c = AC.Properties.Air.SpeedOfSound({
    temp: {
        value: 70,
        units: "F"
    },
    units: "ft/s"
});



let L = [19, 20];
let W = [14, 14];
let H = [10, 10]; 

let stepsize = .1;

let options = [];

for (let l = L[0]; l <= L[1]; l += stepsize) {
    for (let w = W[0]; w <= W[1]; w += stepsize) {
        for (let h = H[0]; h <= H[1]; h += stepsize) {
            options.push(AC.Modes.calcModes({
                c: c,
                dim: [l, w, h],
                units: "ft",
                freq: [20, 250]
            }));
        }
    }
}


let res = options.map(x => {
    return {
        score: x.score,
        dim: x.dim
    }
});

console.log(sort(res).asc(u=>u.score));
