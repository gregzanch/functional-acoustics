const AC = require('../functional-acoustics');
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;

const fs = require('fs');

Array.prototype.print = function(){
    for (var i = 0; i < this.length; i++){
        console.log(this[i]);
    }
}

const Data = fs.readFileSync('./demo/res/14sStairs_mono.dat', 'utf8').split('\n');
const tups = Data.slice(2).map(x => x.split(/\s+/gmi).slice(1, 3).map(u => Number(u)));
tups.pop();

fs.writeFileSync('./demo/rt60tups.js', "export default " + JSON.stringify(tups), 'utf8');

const time = AC.Buffer(tups.map(x => x[0]),64);
const samples = AC.Buffer(tups.map(x => x[1]), 64);
const rms = samples.map(x => 20*Math.log10(AC.RMS(x)+AC.Constants.EPSILON));




let exportdata = {
    time: time.map(x => x[0]),
    samples: rms.map(x => x)
}

fs.writeFileSync('./demo/rt60.js', "export default "+JSON.stringify(exportdata), 'utf8');