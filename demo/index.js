const fs = require('fs');
const path = require('path');
const AC = require('../functional-acoustics');

console.log(AC.Bands.Octave.Nominal)
console.log(AC.Properties.Air.Absorption({
    frequency: AC.Bands.Octave.Nominal
}))

console.log(AC.Bands.ThirdOctave.Nominal)
console.log(AC.Properties.Air.Absorption({
    frequency: AC.Bands.ThirdOctave.Nominal
}))