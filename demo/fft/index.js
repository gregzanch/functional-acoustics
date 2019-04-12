const AC = require('./functional-acousticsics');
const fs = require('fs');


console.log(AC.p2dB({
    p: 2.0
}));
console.log(AC.I2dB({
    I: [2.2E-04,7.9E-05,2.7E-04,8.2E-05,3.9E-05,4.1E-05,7.0E-06]
}));
console.log(AC.W2dB({
    W: 2.0
}));
console.log(AC.dB2p({
    dB: 100
}));
console.log(AC.dB2I({
    dB: [83.42422680822207,
        78.97627091290443,
        84.31363764158988,
        79.13813852383717,
        75.91064607026499,
        76.12783856719736,
        68.45098040014257
    ]
}));
console.log(AC.dB2W({
    dB: 2.0
}));


let L = 1.2;
let W = 2.0;
let H = 1.0;

let SoundPower = AC.SoundPowerScan({
    frequency: AC.Bands.Octave.fromRange(63, 4000),
    surfaceData: [{
        SurfaceArea: L * H,
        SoundIntensityLevel: [80.45, 76.48, 77.41, 68.33, 64.69, 61.94, 54.66]
    },
    {
        SurfaceArea: W * H,
        SoundIntensityLevel: [74.28, 64.52, 75.89, 69.60, 66.55, 67.57, 60.14]
    },
    {
        SurfaceArea: L * H,
        SoundIntensityLevel: [65.40, 66.23, 72.56, 70.03, 64.78, 62.44, 55.43]
    },
    {
        SurfaceArea: W * H,
        SoundIntensityLevel: [68.18, 65.35, 72.67, 69.26, 66.79, 66.35, 58.21]
    },
    {
        SurfaceArea: L * W,
        SoundIntensityLevel: [66.88, 65.53, 74.18, 70.45, 67.56, 68.52, 60.72]
    }
    ]
});
console.log(SoundPower.toString());




// let sum = Array(7).fill(0);
// data.forEach((surface, index, arr) => {
//     arr[index].SoundIntensity = AC.dB2I({
//         dB: surface.SoundIntensityLevel
//     });
//     arr[index].SoundPower = arr[index].SoundIntensity.map(x => x * surface.SurfaceArea);
//     arr[index].SoundPower.forEach((s, i) => {
//         sum[i] += s;
//     });
// });

// let SoundPowerLevel = AC.W2dB({
//     W: sum
// });

// console.log(SoundPowerLevel);

