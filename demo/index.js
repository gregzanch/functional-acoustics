const AC = require('../functional-acoustics');


let spl = AC.dBsum([90, 88], 1)

console.log(spl)

const t0 = Date.now();
let modes = AC.RoomModes({
    length: 14,
    width: 19,
    height: 10,
    frequencyRange: [20, 20000],
    units: "english",
    stdNormalization: "biased",
    overlapPenalty: "*",
    overlapWidth: 0.1,
    sortFrequencies: false,
    sortBonello: true,
    modeLimit: 9
});
console.log(`${modes.modes.length} modes`);
console.log(`${Date.now() - t0}ms`);


